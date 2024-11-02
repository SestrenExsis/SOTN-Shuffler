import datetime
import hashlib
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
    
    def get_stage_spoiler(self, data_core: dict) -> list[str]:
        changes = self.get_changes()
        codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+. '
        legend = []
        grid = [['.' for col in range(64)] for row in range(64)]
        for room_name in changes['Rooms'].keys():
            (index, top, left, rows, cols) = (
                changes['Rooms'][room_name]['Index'],
                changes['Rooms'][room_name]['Top'],
                changes['Rooms'][room_name]['Left'],
                data_core['Rooms'][room_name]['Rows'],
                data_core['Rooms'][room_name]['Columns'],
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
            index = data_core['Rooms'][room_name]['Index']
            top = changes['Rooms'][room_name]['Top']
            left = changes['Rooms'][room_name]['Left']
            width = data_core['Rooms'][room_name]['Columns']
            height = data_core['Rooms'][room_name]['Rows']
            result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
        return result
    
    def get_room_spoiler(self, data_core: dict) -> list[str]:
        changes = self.get_changes()
        codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+. '
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
                data_core['Rooms'][room_name]['Rows'],
                data_core['Rooms'][room_name]['Columns'],
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
            for node in data_core['Rooms'][room_name]['Nodes'].values():
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
                grid[row][col] = code # '@'
        result = []
        for row_data in grid:
            result.append(''.join(row_data))
        for (code, room_name) in legend:
            index = data_core['Rooms'][room_name]['Index']
            top = changes['Rooms'][room_name]['Top']
            left = changes['Rooms'][room_name]['Left']
            width = data_core['Rooms'][room_name]['Columns']
            height = data_core['Rooms'][room_name]['Rows']
            result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
        return result

    def remove_room(self, room_name):
        self.rooms.pop(room_name, None)

class DataCore:
    def __init__(self):
        self.rooms = {}
        self.teleporters = {}
        for stage_folder in (
            'castle-entrance',
            # 'castle-entrance-revisited',
            'alchemy-laboratory',
            'marble-gallery',
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
    'Marble Gallery': [
        {
            'Marble Gallery, Long Hallway': (32 + 0, 32 + 0),
            'Marble Gallery, Loading Room A': (32 + 0, 32 + 15),
            'Marble Gallery, Fake Room With Teleporter B': (32 + 0, 32 + 16),
        },
        {
            'Marble Gallery, Fake Room With Teleporter F': (2, 0),
            'Marble Gallery, Loading Room E': (2, 1),
            'Marble Gallery, S-Shaped Hallways': (0, 2),
        },
        {
            'Marble Gallery, Fake Room With Teleporter C': (0, 0),
            'Marble Gallery, Loading Room C': (0, 1),
            'Marble Gallery, Entrance': (0, 2),
        },
        {
            'Marble Gallery, Fake Room With Teleporter A': (0, 0),
            'Marble Gallery, Loading Room D': (0, 1),
            'Marble Gallery, Pathway After Left Statue': (0, 2),
        },
        {
            'Marble Gallery, Elevator Room': (0, 0),
            'Marble Gallery, Fake Room With Teleporter E': (1, 0),
        },
        {
            'Marble Gallery, Fake Room With Teleporter D': (1, 0),
            'Marble Gallery, Loading Room B': (1, 1),
            'Marble Gallery, Stairwell to Underground Caverns': (0, 2),
        },
        {
            'Marble Gallery, Three Paths': (0, 0),
            'Marble Gallery, Clock Room': (2, 0),
        },
        {
            'Marble Gallery, Dropoff': (0, 0),
            'Marble Gallery, Beneath Dropoff': (1, 1),
            'Marble Gallery, Stained Glass Corner': (2, 1),
        },
        { 'Marble Gallery, Alucart Room': (0, 0) },
        { 'Marble Gallery, Gravity Boots Room': (0, 0) },
        { 'Marble Gallery, Beneath Right Trapdoor': (0, 0) },
        { 'Marble Gallery, Power-Up Room': (0, 0) },
        { 'Marble Gallery, Right of Clock Room': (0, 0) },
        { 'Marble Gallery, Tall Stained Glass Windows': (0, 0) },
        { 'Marble Gallery, Spirit Orb Room': (0, 0) },
        { 'Marble Gallery, Stopwatch Room': (0, 0) },
        { 'Marble Gallery, Left of Clock Room': (0, 0) },
        { 'Marble Gallery, Empty Room': (0, 0) },
        { 'Marble Gallery, Blue Door Room': (0, 0) },
        { 'Marble Gallery, Pathway After Right Statue': (0, 0) },
        { 'Marble Gallery, Ouija Table Stairway': (0, 0) },
        { 'Marble Gallery, Slinger Staircase': (0, 0) },
        { 'Marble Gallery, Beneath Left Trapdoor': (0, 0) },
        { 'Marble Gallery, Save Room A': (0, 0) },
        { 'Marble Gallery, Save Room B': (0, 0) },
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
            # ERROR: No open nodes left
            break
        target_node = rng.choice(possible_target_nodes)
        open_nodes = []
        for (roomset_id, roomset) in pool.items():
            for open_node in roomset.get_open_nodes(matching_node=target_node):
                open_nodes.append(open_node)
        if len(open_nodes) < 1:
            # ERROR: No matching source nodes for the chosen target node
            break
        # Go through possible source nodes in random order until we get a valid source node
        open_nodes.sort()
        rng.shuffle(open_nodes)
        for source_node in open_nodes:
            roomset_key = source_node.room.roomset.roomset_id
            offset_top = (target_node.room.top + target_node.top) - (source_node.room.top + source_node.top)
            offset_left = (target_node.room.left + target_node.left) - (source_node.room.left + source_node.left)
            valid_ind = result.add_roomset(source_node.room.roomset, offset_top, offset_left)
            if valid_ind:
                roomset = pool.pop(roomset_key, None)
                break
        else:
            # ERROR: All matching source nodes for the target node result in invalid room placement
            break
        steps += 1
    return result

class Mapper:
    def __init__(self, data_core, stage_name: str, seed: int):
        self.stage_name = stage_name
        self.attempts = 0
        self.start_time = None
        self.end_time = None
        self.stage = None
        self.rooms = {}
        for (room_name, room_data) in data_core['Rooms'].items():
            if room_data['Stage'] == stage_name:
                self.rooms[room_name] = Room(room_data)
        self.current_seed = self.next_seed = seed
        self.rng = random.Random(self.current_seed)
    
    def generate(self):
        self.current_seed = self.next_seed
        self.next_seed = self.rng.randint(0, 2 ** 64)
        self.rng = random.Random(self.current_seed)
        if self.attempts < 1:
            self.start_time = datetime.datetime.now(datetime.timezone.utc)
        self.stage = get_roomset(self.rng, self.rooms, stages[self.stage_name])
        self.attempts += 1
        self.end_time = datetime.datetime.now(datetime.timezone.utc)
    
    def validate(self, tolerance: int=0) -> bool:
        result = False
        if self.stage is not None:
            result = (len(self.stage.rooms) + tolerance) >= len(self.rooms) and len(self.stage.get_open_nodes()) <= 2 * tolerance
        return result

if __name__ == '__main__':
    '''
    Usage
    python mapper.py
    '''
    GENERATION_VERSION = '0.0.2'
    data_core = DataCore().get_core()
    with open(os.path.join('build', 'sandbox', 'data-core.json'), 'w') as data_core_json:
        json.dump(data_core, data_core_json, indent='    ', sort_keys=True)
    try:
        with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'r') as generated_stages_json:
            generated_stages = json.load(generated_stages_json)
    except:
        generated_stages = {
            'Castle Entrance': [],
            'Alchemy Laboratory': [],
            'Marble Gallery': [],
        }
    seed = random.randint(0, 2 ** 64)
    for (stage_name, target_seed_count) in (
        ('Castle Entrance', 200),
        ('Alchemy Laboratory', 1000),
        ('Marble Gallery', 1000),
    ):
        if stage_name not in generated_stages:
            generated_stages[stage_name] = []
        while len(generated_stages[stage_name]) < target_seed_count:
            stage_map = Mapper(data_core, stage_name, seed)
            while not stage_map.validate():
                stage_map.generate()
            generated_stages[stage_name].append(
                {
                    'Attempts': stage_map.attempts,
                    'Generation Start Date': stage_map.start_time.isoformat(),
                    'Generation End Date': stage_map.end_time.isoformat(),
                    'Generation Version': GENERATION_VERSION,
                    'Hash of Changes': hashlib.sha256(json.dumps(stage_map.stage.get_changes(), sort_keys=True).encode()).hexdigest(),
                    'Seed': stage_map.current_seed,
                    'Stage': stage_name,
                }
            )
            print(generated_stages[stage_name][-1])
            # with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'w') as generated_stages_json:
            #     json.dump(generated_stages, generated_stages_json, indent='    ', sort_keys=True, default=str)
            seed = stage_map.rng.randint(0, 2 ** 64)
    with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'w') as generated_stages_json:
        json.dump(generated_stages, generated_stages_json, indent='    ', sort_keys=True, default=str)