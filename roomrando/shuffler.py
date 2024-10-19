import collections
import copy
import json
import os
import random
import yaml

class RoomNode:
    def __init__(self, room, row: int, column: int, edge: str, type: str):
        self.room = room
        self.row = row
        self.column = column
        self.edge = edge
        self.type = type
        self.top = self.row + (1 if self.edge == 'Bottom' else 0)
        self.left = self.column + (1 if self.edge == 'Right' else 0)
        self.direction = None
        if edge in ('Top', 'Bottom'):
            self.direction = 'Right'
        elif edge in ('Left', 'Right'):
            self.direction = 'Down'
    
    def __str__(self) -> str:
        result = (self.top, self.left, self.edge, self.type, self.room.room_name, (self.room.top + self.top), (self.room.left + self.left))
        return str(result)
    
    # TODO(sestren): Implement __eq__, __gt__, etc.
    def __lt__(self, other) -> bool:
        result = (
            self.room.room_name, self.row, self.column, self.edge, self.type
        ) < (
            other.room.room_name, other.row, other.column, other.edge, other.type
        )
        return result
    
    def matches(self, node=None) -> bool:
        result = True
        if node is not None:
            result = (
                self.type == node.type and
                self.direction == node.direction and
                self.edge != node.edge
            )
        return result
    
    def get_facing_cell(self) -> set[int, int]:
        top = self.room.top + self.top
        left = self.room.left + self.left
        if self.edge == 'Top':
            top -= 1
        elif self.edge == 'Left':
            left -= 1
        elif self.edge == 'Bottom':
            top += 1
        elif self.edge == 'Right':
            left += 1
        result = (top, left)
        return result

class Room:
    def __init__(self, room_data: dict, top: int=None, left: int=None):
        self.roomset = None
        self.stage_name = room_data['Stage']
        self.room_name = room_data['Room']
        self.index = room_data['Index']
        self.top = top if top is not None else room_data['Top']
        self.left = left if left is not None else room_data['Left']
        self.rows = room_data['Rows']
        self.columns = room_data['Columns']
        self.empty_cells = set()
        for cell_data in room_data['Empty Cells']:
            self.empty_cells.add((cell_data['Row'], cell_data['Column']))
        self.nodes = {}
        for (node_name, node_data) in room_data['Nodes'].items():
            node = RoomNode(
                self, node_data['Row'], node_data['Column'], node_data['Edge'], node_data['Type']
            )
            self.nodes[node_name] = node
    
    def get_cells(self, offset_top: int=0, offset_left: int=0) -> set[tuple[int, int]]:
        result = set()
        for row in range(self.top, self.top + self.rows):
            for col in range(self.left, self.left + self.columns):
                if (row, col) not in self.empty_cells:
                    result.add((row + offset_top, col + offset_left))
        return result

class RoomSet:
    # TODO(sestren): Enforce a maximum row for all rooms of 55 (54?), as that is the visual bottom of the map
    # TODO(sestren): After generating all stages, try N times to lay them out on the map with no overlapping rooms, take the one with the smallest overall footprint. If it is still too big, throw it all away and start over
    def __init__(self, roomset_id, room_placements: list[list[Room, int, int]]):
        # room_placements: [ [room: Room, top: int=None, left: int=None], ... ]
        self.roomset_id = roomset_id
        self.rooms = {}
        for (room, top, left) in room_placements:
            room.roomset = self
            room.top = top if top is not None else room.top
            room.left = left if left is not None else room.left
            room_name = room.stage_name + ', ' + room.room_name
            self.rooms[room_name] = room
    
    def get_bounds(self) -> tuple:
        (top, left, bottom, right) = (float('inf'), float('inf'), float('-inf'), float('-inf'))
        for (row, col) in self.get_cells():
            top = min(top, row)
            left = min(left, col)
            bottom = max(bottom, row)
            right = max(right, col)
        result = (top, left, bottom, right)
        return result
    
    def get_cells(self, offset_top: int=0, offset_left: int=0) -> set[tuple[int, int]]:
        result = set()
        for (room_name, room) in self.rooms.items():
            result = result.union(room.get_cells(offset_top, offset_left))
        return result

    def get_open_nodes(self, matching_node: RoomNode=None) -> list:
        edges = {}
        for (room_name, room) in self.rooms.items():
            for (node_name, node) in room.nodes.items():
                edge_key = (room.top + node.top, room.left + node.left, node.direction)
                if edge_key not in edges:
                    edges[edge_key] = {}
                if node.edge not in edges[edge_key]:
                    edges[edge_key][node.edge] = []
                edges[edge_key][node.edge].append(node)
        # edge_key: { edge: [node, node], edge: [node, node] }
        result = []
        for (edge_key, sides) in edges.items():
            if len(sides) == 1:
                side = list(sides)[0]
                node = sides[side][0]
                if node.matches(matching_node):
                    result.append(node)
        result.sort()
        return result

    def add_roomset(self, source_roomset, offset_top: int, offset_left: int) -> bool:
        target_cells = self.get_cells()
        valid_ind = True
        # Verify each cell where the source roomset will be placed is vacant and in bounds
        for (source_room_name, source_room) in source_roomset.rooms.items():
            source_cells = source_room.get_cells(offset_top, offset_left)
            if len(source_cells.intersection(target_cells)) > 0:
                valid_ind = False
                break
            (min_row, min_col, max_row, max_col) = (float('inf'), float('inf'), float('-inf'), float('-inf'))
            for (row, col) in source_cells:
                min_row = min(min_row, row)
                min_col = min(min_col, col)
                max_row = min(max_row, row)
                max_col = min(max_col, col)
            if min_row >= 0 and min_col >= 0 and max_row < 64 and max_col < 64:
                pass
            else:
                valid_ind = False
                break
        if valid_ind:
            edges = set()
            for other_target_node in self.get_open_nodes():
                edges.add((other_target_node.top, other_target_node.left, other_target_node.direction))
            # Verify each open node in the source roomset faces a vacant cell or connects with a matching node
            for other_source_node in source_roomset.get_open_nodes():
                facing_cell = other_source_node.get_facing_cell()
                if facing_cell in target_cells:
                    if (other_source_node.top, other_source_node.left, other_source_node.direction) not in edges:
                        valid_ind = False
                        break
        if valid_ind:
            for (source_room_name, source_room) in source_roomset.rooms.items():
                source_room.roomset = self
                source_room.top += offset_top
                source_room.left += offset_left
                self.rooms[source_room_name] = source_room
        result = valid_ind
        return result
    
    def get_changes(self) -> dict:
        result = {
            'Rooms': {}
        }
        for (room_name, room) in self.rooms.items():
            result['Rooms'][room_name] = {
                'Index': room.index,
                'Top': room.top,
                'Left': room.left,
            }
        return result
    
    def get_stage_spoiler(self, logic: dict, changes: dict) -> list[str]:
        codes = '0123456789abcdefghijklmnopqrstuv+. '
        legend = []
        grid = [['.' for col in range(64)] for row in range(64)]
        for room_name in changes['Rooms'].keys():
            (index, top, left, rows, cols) = (
                changes['Rooms'][room_name]['Index'],
                changes['Rooms'][room_name]['Top'],
                changes['Rooms'][room_name]['Left'],
                logic['Rooms'][room_name]['Rows'],
                logic['Rooms'][room_name]['Columns'],
            )
            code = codes[index]
            legend.append((code, room_name))
            for row in range(max(0, top), min(64, top + rows)):
                for col in range(max(0, left), min(64, left + cols)):
                    prev_index = codes.find(grid[row][col])
                    if index < prev_index:
                        grid[row][col] = code
        result = []
        for row_data in grid:
            result.append(''.join(row_data))
        for (code, room_name) in legend:
            index = logic['Rooms'][room_name]['Index']
            top = changes['Rooms'][room_name]['Top']
            left = changes['Rooms'][room_name]['Left']
            width = logic['Rooms'][room_name]['Columns']
            height = logic['Rooms'][room_name]['Rows']
            result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
        return result
    
    def get_room_spoiler(self, logic: dict) -> list[str]:
        changes = self.get_changes()
        codes = '0123456789abcdefghijklmnopqrstuv+. '
        legend = []
        (stage_top, stage_left, stage_bottom, stage_right) = self.get_bounds()
        stage_rows = 1 + stage_bottom - stage_top
        stage_cols = 1 + stage_right - stage_left
        grid = [[' ' for col in range(5 * stage_cols)] for row in range(5 * stage_rows)]
        for room_name in changes['Rooms'].keys():
            (index, room_top, room_left, room_rows, room_cols) = (
                changes['Rooms'][room_name]['Index'],
                changes['Rooms'][room_name]['Top'],
                changes['Rooms'][room_name]['Left'],
                logic['Rooms'][room_name]['Rows'],
                logic['Rooms'][room_name]['Columns'],
            )
            code = codes[index]
            legend.append((code, room_name))
            for cell_row in range(max(0, room_top), min(64, room_top + room_rows)):
                for cell_col in range(max(0, room_left), min(64, room_left + room_cols)):
                    top = cell_row - stage_top
                    left = cell_col - stage_left
                    for row in range(5 * top + 1, 5 * top + 4):
                        for col in range(5 * left + 1, 5 * left + 4):
                            prev_index = codes.find(grid[row][col])
                            if index < prev_index:
                                grid[row][col] = code
            for node in logic['Rooms'][room_name]['Nodes'].values():
                (exit_row, exit_col, exit_edge) = (node['Row'], node['Column'], node['Edge'])
                row = 2 + 5 * (room_top - stage_top + exit_row)
                col = 2 + 5 * (room_left - stage_left + exit_col)
                if exit_edge == 'Top':
                    row -= 2
                elif exit_edge == 'Left':
                    col -= 2
                elif exit_edge == 'Bottom':
                    row += 2
                elif exit_edge == 'Right':
                    col += 2
                grid[row][col] = '@'
        result = []
        for row_data in grid:
            result.append(''.join(row_data))
        for (code, room_name) in legend:
            index = logic['Rooms'][room_name]['Index']
            top = changes['Rooms'][room_name]['Top']
            left = changes['Rooms'][room_name]['Left']
            width = logic['Rooms'][room_name]['Columns']
            height = logic['Rooms'][room_name]['Rows']
            result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
        return result

    def remove_room(self, room_name):
        self.rooms.pop(room_name, None)

stages = {
    'Castle Entrance': [
        {
            'Castle Entrance, Forest Cutscene': (None, None),
            'Castle Entrance, Unknown 19': (None, None),
            'Castle Entrance, Unknown 20': (40, 31),
            'Castle Entrance, After Drawbridge': (38, 32),
        },
        {
            'Castle Entrance, Fake Room With Teleporter A': (0, 0),
            'Castle Entrance, Loading Room C': (0, 1),
            'Castle Entrance, Cube of Zoe Room': (0, 2),
            'Castle Entrance, Loading Room A': (0, 4),
            'Castle Entrance, Fake Room With Teleporter B': (0, 5),
        },
        {
            'Castle Entrance, Fake Room With Teleporter C': (0, 0),
            'Castle Entrance, Loading Room B': (0, 1),
            'Castle Entrance, Shortcut to Warp': (0, 2),
        },
        {
            'Castle Entrance, Fake Room With Teleporter C': (0, 0),
            'Castle Entrance, Loading Room B': (0, 1),
            'Castle Entrance, Shortcut to Warp': (0, 2),
        },
        {
            'Castle Entrance, Shortcut to Underground Caverns': (0, 0),
            'Castle Entrance, Loading Room D': (0, 1),
            'Castle Entrance, Fake Room With Teleporter D': (0, 2),
        },
        { 'Castle Entrance, Attic Entrance': (0, 0) },
        { 'Castle Entrance, Attic Hallway': (0, 0) },
        { 'Castle Entrance, Attic Staircase': (0, 0) },
        { 'Castle Entrance, Drop Under Portcullis': (0, 0) },
        { 'Castle Entrance, Gargoyle Room': (0, 0) },
        { 'Castle Entrance, Heart Max-Up Room': (0, 0) },
        { 'Castle Entrance, Holy Mail Room': (0, 0) },
        { 'Castle Entrance, Jewel Sword Room': (0, 0) },
        { 'Castle Entrance, Life Max-Up Room': (0, 0) },
        { 'Castle Entrance, Meeting Room With Death': (0, 0) },
        { 'Castle Entrance, Merman Room': (0, 0) },
        { 'Castle Entrance, Save Room A': (0, 0) },
        { 'Castle Entrance, Save Room B': (0, 0) },
        { 'Castle Entrance, Save Room C': (0, 0) },
        { 'Castle Entrance, Stairwell After Death': (0, 0) },
        { 'Castle Entrance, Warg Hallway': (0, 0) },
        { 'Castle Entrance, Zombie Hallway': (0, 0) },
    ],
    'Alchemy Laboratory': [
        {
            'Alchemy Laboratory, Entryway': (32 + 0, 32 + 0),
            'Alchemy Laboratory, Loading Room C': (32 + 0, 32 + 3),
            'Alchemy Laboratory, Fake Room With Teleporter C': (32 + 0, 32 + 4),
        },
        {
            'Alchemy Laboratory, Fake Room With Teleporter B': (0, 0),
            'Alchemy Laboratory, Loading Room B': (0, 1),
            'Alchemy Laboratory, Exit to Royal Chapel': (0, 2),
        },
        {
            'Alchemy Laboratory, Exit to Marble Gallery': (0, 0),
            'Alchemy Laboratory, Loading Room A': (1, 2),
            'Alchemy Laboratory, Fake Room With Teleporter A': (1, 3),
        },
        {
            'Alchemy Laboratory, Tetromino Room': (0, 0),
            'Alchemy Laboratory, Bat Card Room': (1, 0),
        },
        { 'Alchemy Laboratory, Bloody Zombie Hallway': (0, 0) },
        { 'Alchemy Laboratory, Blue Door Hallway': (0, 0) },
        { 'Alchemy Laboratory, Box Puzzle Room': (0, 0) },
        { 'Alchemy Laboratory, Cannon Room': (0, 0) },
        { 'Alchemy Laboratory, Cloth Cape Room': (0, 0) },
        { 'Alchemy Laboratory, Corridor to Elevator': (0, 0) },
        { 'Alchemy Laboratory, Elevator Shaft': (0, 0) },
        { 'Alchemy Laboratory, Empty Zig Zag Room': (0, 0) },
        { 'Alchemy Laboratory, Glass Vats': (0, 0) },
        { 'Alchemy Laboratory, Heart Max-Up Room': (0, 0) },
        { 'Alchemy Laboratory, Red Skeleton Lift Room': (0, 0) },
        { 'Alchemy Laboratory, Save Room A': (0, 0) },
        { 'Alchemy Laboratory, Save Room B': (0, 0) },
        { 'Alchemy Laboratory, Save Room C': (0, 0) },
        { 'Alchemy Laboratory, Secret Life Max-Up Room': (0, 0) },
        { 'Alchemy Laboratory, Short Zig Zag Room': (0, 0) },
        { 'Alchemy Laboratory, Skill of Wolf Room': (0, 0) },
        { 'Alchemy Laboratory, Slogra and Gaibon Boss Room': (0, 0) },
        { 'Alchemy Laboratory, Sunglasses Room': (0, 0) },
        { 'Alchemy Laboratory, Tall Spittlebone Room': (0, 0) },
        { 'Alchemy Laboratory, Tall Zig Zag Room': (0, 0) },
    ],
}

def get_roomset(rng, rooms: dict, stage_data: dict) -> RoomSet:
    pool = {}
    for roomset_id, roomset_data in enumerate(stage_data):
        room_placements = []
        for room_name, (top, left) in roomset_data.items():
            room_placements.append((rooms[room_name], top, left))
        pool[roomset_id] = RoomSet(roomset_id, room_placements)
    result = pool.pop(0)
    steps = 0
    while len(pool) > 0:
        possible_target_nodes = result.get_open_nodes()
        if len(possible_target_nodes) < 1:
            # print('ERROR: No open nodes left')
            break
        target_node = rng.choice(possible_target_nodes)
        open_nodes = []
        for (roomset_id, roomset) in pool.items():
            for open_node in roomset.get_open_nodes(matching_node=target_node):
                open_nodes.append(open_node)
        # Go through possible source nodes in random order until we get a valid source node
        if len(open_nodes) < 1:
            # print('ERROR: No matching source nodes for the chosen target node')
            break
        open_nodes.sort()
        rng.shuffle(open_nodes)
        for source_node in open_nodes:
            roomset_key = source_node.room.roomset.roomset_id
            offset_top = (target_node.room.top + target_node.top) - (source_node.room.top + source_node.top)
            offset_left = (target_node.room.left + target_node.left) - (source_node.room.left + source_node.left)
            valid_ind = result.add_roomset(source_node.room.roomset, offset_top, offset_left)
            if valid_ind:
                # print('  ', roomset_key)
                roomset = pool.pop(roomset_key, None)
                break
        else:
            # print('ERROR: All matching source nodes for the target node result in invalid room placement')
            break
        steps += 1
    return result

class Randomizer:
    def __init__(self, data_core, initial_seed):
        print('Randomize with seed:', initial_seed)
        self.data_core = data_core
        self.initial_seed = initial_seed
        self.rng = random.Random(self.initial_seed)
        self.castle = None
        rooms = {}
        for (room_name, room_data) in data_core['Rooms'].items():
            rooms[room_name] = Room(room_data)
        seed_count = 0
        while True:
            self.castle = get_roomset(self.rng, rooms, stages['Castle Entrance'])
            seed_count += 1
            if len(self.castle.rooms) >= 32 and len(self.castle.get_open_nodes()) < 1:
                print('Castle Entrance:', len(self.castle.rooms), seed_count, current_seed)
                for row_data in self.castle.get_room_spoiler(data_core):
                    print(row_data)
                break
            current_seed = self.rng.randint(0, 2 ** 64)
        # alchemy_laboratory = None
        # seed_count = 0
        # while True:
        #     alchemy_laboratory = get_roomset(rng, rooms, stages['Alchemy Laboratory'])
        #     seed_count += 1
        #     if len(alchemy_laboratory.rooms) >= 32 and len(alchemy_laboratory.get_open_nodes()) < 1:
        #         print('Alchemy Laboratory:', len(alchemy_laboratory.rooms), seed_count, current_seed)
        #         for row_data in alchemy_laboratory.get_room_spoiler(data_core):
        #             print(row_data)
        #         break
        #     current_seed = rng.randint(0, 2 ** 64)
        #     rng = random.Random(current_seed)
        # (top, left, bottom, right) = alchemy_laboratory.get_bounds()
        # castle.add_roomset(alchemy_laboratory, 46 - top, 14 - left)
        # changes = castle.get_changes()
        # for row_data in castle.get_stage_spoiler(data_core, changes):
        #     print(row_data)
        # if len(alchemy_laboratory.rooms) < 32:
        #     for room_name in rooms:
        #         if 'Alchemy Laboratory' in room_name and room_name not in alchemy_laboratory.rooms:
        #             print(room_name)
    
    def get_changes(self):
        result = self.castle.get_changes()
        return result

class DataCore:
    def __init__(self):
        self.rooms = {}
        self.teleporters = {}
        for stage_folder in (
            'castle-entrance',
            # 'castle-entrance-revisited',
            'alchemy-laboratory',
        ):
            folder_path = os.path.join('data', 'rooms', stage_folder)
            for file_name in os.listdir(folder_path):
                if file_name[-5:] != '.yaml':
                    continue
                file_path = os.path.join(folder_path, file_name)
                with open(file_path) as open_file:
                    yaml_obj = yaml.safe_load(open_file)
                    room_name = yaml_obj['Stage'] + ', ' + yaml_obj['Room']
                    self.rooms[room_name] = yaml_obj
        with open(os.path.join('data', 'Teleporters.yaml')) as open_file:
            yaml_obj = yaml.safe_load(open_file)
            self.teleporters = yaml_obj
    
    def get_core(self) -> dict:
        result = {
            'Rooms': self.rooms,
            'Teleporters': self.teleporters,
        }
        return result

class LogicCore:
    def __init__(self, data_core, changes):
        print('Build logic core')
        self.commands = {}
        for stage_name in (
            'Castle Entrance',
            'Alchemy Laboratory',
        ):
            nodes = {}
            for (location_name, room_data) in data_core['Rooms'].items():
                if data_core['Rooms']['Stage'] != stage_name:
                    continue
                room_top = room_data['Top']
                room_left = room_data['Left']
                if 'Rooms' in changes and location_name in changes['Rooms']:
                    if 'Top' in changes['Rooms'][location_name]:
                        room_top = changes['Rooms'][location_name]['Top']
                    if 'Left' in changes['Rooms'][location_name]:
                        room_left = changes['Rooms'][location_name]['Left']
                self.commands[location_name] = room_data['Commands']
                for (node_name, node) in room_data['Nodes'].items():
                    row = room_top + node['Row']
                    column = room_left + node['Column']
                    edge = node['Edge']
                    nodes[(row, column, edge)] = (location_name, node_name, node['Entry Section'])
                    exit = {
                        'Outcomes': {
                            'Location': None,
                            'Section': None,
                        },
                        'Requirements': {
                            'Default': {
                                'Location': location_name,
                                'Section': node['Exit Section']
                            },
                        },
                    }
                    self.commands[location_name]['Exit - ' + node_name] = exit
            for (row, column, edge), (location_name, node_name, section_name) in nodes.items():
                matching_row = row
                matching_column = column
                matching_edge = edge
                if edge == 'Top':
                    matching_edge = 'Bottom'
                    matching_row -= 1
                elif edge == 'Left':
                    matching_edge = 'Right'
                    matching_column -= 1
                elif edge == 'Bottom':
                    matching_edge = 'Top'
                    matching_row += 1
                elif edge == 'Right':
                    matching_edge = 'Left'
                    matching_column += 1
                (matching_location_name, matching_node_name, matching_section) = (None, 'Unknown', None)
                if (matching_row, matching_column, matching_edge) in nodes:
                    (matching_location_name, matching_node_name, matching_section) = nodes[(matching_row, matching_column, matching_edge)]
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Location'] = matching_location_name
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Section'] = matching_section
        # Replace source teleporter locations with their targets
        for (location_name, location_info) in self.commands.items():
            for (command_name, command_info) in location_info.items():
                if 'Outcomes' in command_info and 'Location' in command_info['Outcomes']:
                    location_name = command_info['Outcomes']['Location']
                    if location_name in data_core['Teleporters']['Sources']:
                        source = data_core['Teleporters']['Sources'][location_name]
                        target = data_core['Teleporters']['Targets'][source['Target']]
                        target_location_name = target['Stage'] + ', ' + target['Room']
                        self.commands[location_name][command_name]['Outcomes']['Location'] = target_location_name
                        target_section_name = data_core['Rooms'][target_location_name]['Nodes'][target['Node']]['Entry Section']
                        self.commands[location_name][command_name]['Outcomes']['Section'] = target_section_name
        # Delete fake rooms mentioned as teleporter locations
        for location_name in data_core['Teleporters']['Sources']:
            if 'Fake' in location_name:
                self.data_core.pop(location_name, None)
        self.state = {
            'Character': 'Alucard',
            'Location': 'Castle Entrance, After Drawbridge',
            'Section': 'Ground',
            'Item - Alucard Sword': 1,
            'Item - Alucard Shield': 1,
            'Item - Dragon Helm': 1,
            'Item - Alucard Mail': 1,
            'Item - Twilight Cloak': 1,
            'Item - Necklace of J': 1,
            'Item - Neutron Bomb': 1,
            'Item - Heart Refresh': 1,
        }
        self.goals = {
            'Debug - Reach Fake Room With Teleporter A': {
                'Location': 'Castle Entrance, Fake Room With Teleporter A',
            },
            'Debug - Reach Fake Room With Teleporter B': {
                'Location': 'Castle Entrance, Fake Room With Teleporter B',
            },
            'Debug - Reach Fake Room With Teleporter C': {
                'Location': 'Castle Entrance, Fake Room With Teleporter C',
            },
            'Debug - Reach Fake Room With Teleporter D': {
                'Location': 'Castle Entrance, Fake Room With Teleporter D',
            },
            'Debug - Reach Entryway in Alchemy Laboratory': {
                'Location': 'Alchemy Laboratory, Entryway',
            },
            'Debug - Reach Exit to Marble Gallery in Alchemy Laboratory': {
                'Location': 'Alchemy Laboratory, Exit to Marble Gallery',
            },
            'Debug - Reach Exit to Royal Chapel in Alchemy Laboratory': {
                'Location': 'Alchemy Laboratory, Exit to Royal Chapel',
            },
        }
    
    def get_core(self) -> dict:
        result = {
            'State': self.state,
            'Goals': self.goals,
            'Commands': self.commands,
        }
        return result

class Game:
    def __init__(self,
        starting_state: dict,
        commands: dict,
        goals: dict,
    ):
        self.state = copy.deepcopy(starting_state)
        self.commands = commands
        self.goals = goals
        self.starting_state = copy.deepcopy(starting_state)
        self.command_history = []
        self.debug = False
    
    def clone(self):
        result = Game(self.state, self.commands, self.goals)
        result.command_history = list(self.command_history)
        return result
    
    def get_key(self) -> int:
        hashed_state = hash(json.dumps(self.state, sort_keys=True))
        result = (self.state['Location'], self.state['Section'], hashed_state)
        return result
    
    def validate(self, requirements):
        result = False
        for requirement in requirements.values():
            # All checks within a requirement list must pass
            valid_ind = True
            for (key, value) in requirement.items():
                target_value = None
                if key not in self.state:
                    if type(value) == str:
                        target_value = 'NONE'
                    elif type(value) == bool:
                        target_value = False
                    elif type(value) in (int, dict):
                        target_value = 0
                else:
                    target_value = self.state[key]
                if type(value) == dict:
                    if 'Minimum' in value:
                        if target_value < value['Minimum']:
                            valid_ind = False
                            break
                    if 'Maximum' in value:
                        if target_value > value['Maximum']:
                            valid_ind = False
                            break
                elif target_value != value:
                    valid_ind = False
                    break
            # Satisfying even one requirement list is sufficient
            if valid_ind:
                result = True
                break
        return result

    def process_command(self, command_name: str):
        self.command_history.append(command_name)
        command_data = {}
        if self.state['Location'] in self.commands:
            command_data = self.commands[self.state['Location']]
        # Apply outcomes from the command
        for (key, value) in command_data[command_name]['Outcomes'].items():
            if type(value) in (str, bool):
                if self.debug and (key not in self.state or self.state[key] != value):
                    print('  +', key, ': ', value)
                self.state[key] = value
            elif type(value) in (int, float):
                if key not in self.state:
                    self.state[key] = 0
                if self.debug:
                    print('  +', key, ': ', value)
                self.state[key] += value

    def get_valid_command_names(self) -> list:
        result = set()
        # Add choices for valid commands the player can issue
        command_data = {}
        if self.state['Location'] in self.commands:
            command_data = self.commands[self.state['Location']]
        for (command_name, command_info) in command_data.items():
            if self.validate(command_info['Requirements']):
                result.add(command_name)
        result = list(reversed(sorted(result)))
        return result

    def play(self):
        print('@', self.state['Location'], '-', self.state['Section'])
        command_map = {}
        codes = '1234567890abcdefghijklmnopqrstuvwxyz'
        valid_command_names = self.get_valid_command_names()
        for (i, command_name) in enumerate(valid_command_names):
            command_code = codes[i]
            command_map[command_code] = command_name
            print(command_code + ':', command_name)
        # Ask player for next command
        command_input = input('> ').strip()
        if command_input in command_map.keys():
            command_name = command_map[command_input]
            self.process_command(command_name)
        elif command_input in command_map.values():
            command_name = command_input
            self.process_command(command_name)
        else:
            print('command not valid:', command_input)
            raise Exception()
        print('')

def solver__solve(logic_core, rules, skills):
    print('Solve')
    modified_state = logic_core['State']
    for (skill_key, skill_value) in skills.items():
        modified_state[skill_key] = skill_value
    winning_games = []
    losing_games = []
    memo = {} # (location, section, hashed_state): (distance, game)
    work = collections.deque()
    work.appendleft((0, Game(modified_state, logic_core['Commands'], logic_core['Goals'])))
    while len(work) > 0:
        (distance, game) = work.pop()
        goal_reached = False
        for (goal_name, requirements) in game.goals.items():
            if game.state['Location'] == requirements['Location']:
                goal_reached = True
                break
        if goal_reached:
            winning_games.append(game.command_history)
            break
        if distance >= 128:
            continue
        game_key = game.get_key()
        if game_key in memo and memo[game_key][0] < distance:
            continue
        memo[game_key] = (distance, game)
        commands = game.get_valid_command_names()
        if len(commands) < 1:
            losing_games.append(game.command_history)
            continue
        for command_name in commands:
            next_game = game.clone()
            next_game.process_command(command_name)
            work.appendleft((distance + 1, next_game))
    return {
        'Wins': winning_games,
        'Losses': losing_games,
    }

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py

    TODO(sestren): Elevator Room (m) placed on top of Red Skeleton Lift Room (i), which shouldn't be allowed:
    ..................
    .ur13333hh4m......
    ......bdhhcm......
    .....9bd22cm......
    ......b..77m......
    ......b8.f.m......
    ......b..f.m......
    .....jjggggm......
    ....50jggggiiio...
    ....njje...iiillp.
    .......ekk..aaasv.
    .......ekkqt......
    ........kk........
    ..................

    TODO(sestren): Entering Skill of Wolf Room leads to the void (Alchemy Lab seed: 1095466689126170730)
    '''
    with (
        open(os.path.join('build', 'sandbox', 'rules.json')) as rules_json,
        open(os.path.join('build', 'sandbox', 'skills.json')) as skills_json,
    ):
        print('Build data core')
        data_core = DataCore().get_core()
        with open(os.path.join('build', 'sandbox', 'data-core.json'), 'w') as data_core_json:
            json.dump(data_core, data_core_json, indent='    ', sort_keys=True)
        rules = json.load(rules_json)
        skills = json.load(skills_json)
        # Keep randomizing until a solution is found
        seed = random.randint(0, 2 ** 64)
        while True:
            # Randomize
            randomizer = Randomizer(data_core, seed)
            changes = randomizer.get_changes()
            with open(os.path.join('build', 'sandbox', 'changes.json'), 'w') as changes_json:
                json.dump(changes, changes_json, indent='    ', sort_keys=True)
            # Build
            logic_core = LogicCore(data_core, changes).get_core()
            with open(os.path.join('build', 'sandbox', 'logic-core.json'), 'w') as logic_core_json:
                json.dump(logic_core, logic_core_json, indent='    ', sort_keys=True)
            # Solve
            solutions = solver__solve(logic_core, rules, skills)
            with open(os.path.join('build', 'sandbox', 'solutions.json'), 'w') as solutions_json:
                json.dump(solutions, solutions_json, indent='    ', sort_keys=True)
            # Halt if solution found
            if len(solutions['Wins']) > 0:
                # patcher.patch(changes.json, 'build/patch.ppf')
                break
            seed = randomizer.rng.randint(0, 2 ** 64)