import collections
import copy
import json
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
        for (node_name, node_data) in room_data['Node Sections'].items():
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
                    edges[edge_key] = []
                edges[edge_key].append(node)
        result = []
        for (edge_key, nodes) in edges.items():
            if len(nodes) == 1:
                node = nodes[0]
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
    
    def get_spoiler(self, logic: dict, changes: dict) -> list[str]:
        codes = '0123456789abcdefghijklmnopqrstuv+. '
        legend = {}
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
            legend[code] = room_name
            for row in range(max(0, top), min(64, top + rows)):
                for col in range(max(0, left), min(64, left + cols)):
                    prev_index = codes.find(grid[row][col])
                    if index < prev_index:
                        grid[row][col] = code
        result = []
        for row_data in grid:
            result.append(''.join(row_data))
        for code, room_name in legend.items():
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
            'Castle Entrance, Unknown 20': (None, None),
            'Castle Entrance, After Drawbridge': (None, None),
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
            'Alchemy Laboratory, Entryway': (32, 32), # (0, 0),
            'Alchemy Laboratory, Loading Room C': (32, 32 + 3), # (0, 3),
            'Alchemy Laboratory, Fake Room With Teleporter C': (32, 32 + 4), # (0, 4),
        },
        {
            'Alchemy Laboratory, Exit to Marble Gallery': (0, 0),
            'Alchemy Laboratory, Loading Room A': (1, 2),
            'Alchemy Laboratory, Fake Room With Teleporter A': (1, 3),
        },
        {
            'Alchemy Laboratory, Fake Room With Teleporter B': (0, 0),
            'Alchemy Laboratory, Loading Room B': (0, 1),
            'Alchemy Laboratory, Exit to Royal Chapel': (0, 2),
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
    while len(pool) > 1:
        possible_target_nodes = result.get_open_nodes()
        if len(possible_target_nodes) < 1:
            print('ERROR: No open nodes left')
            break
        target_node = rng.choice(possible_target_nodes)
        open_nodes = []
        for (roomset_id, roomset) in pool.items():
            for open_node in roomset.get_open_nodes(matching_node=target_node):
                open_nodes.append(open_node)
        # Go through possible source nodes in random order until we get a valid source node
        if len(open_nodes) < 1:
            print('ERROR: No matching source nodes for the chosen target node')
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
            print('ERROR: All matching source nodes for the target node result in invalid room placement')
            break
        steps += 1
    return result

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py
    '''
    with open('build/logic.json') as open_file:
        logic = json.load(open_file)
        rooms = {}
        for (room_name, room_data) in logic['Rooms'].items():
            rooms[room_name] = Room(room_data)
        current_seed = random.randint(0, 2 ** 64)
        rng = random.Random(current_seed)
        castle = None
        while True:
            print('Castle Entrance:', current_seed)
            castle = get_roomset(rng, rooms, stages['Castle Entrance'])
            if len(castle.rooms) >= 32:
                break
            current_seed = rng.randint(0, 2 ** 64)
            rng = random.Random(current_seed)
        alchemy_laboratory = None
        while True:
            print('Alchemy Laboratory:', current_seed)
            alchemy_laboratory = get_roomset(rng, rooms, stages['Alchemy Laboratory'])
            if len(alchemy_laboratory.rooms) >= 24:
                break
            current_seed = rng.randint(0, 2 ** 64)
            rng = random.Random(current_seed)
        (top, left, bottom, right) = alchemy_laboratory.get_bounds()
        castle.add_roomset(alchemy_laboratory, 48 - top, 16 - left)
        file_name = 'build/RoomChanges.yaml'
        with open(file_name, 'w') as open_file:
            changes = castle.get_changes()
            for row_data in castle.get_spoiler(logic, changes):
                print(row_data)
            yaml.dump(castle.get_changes(), open_file, default_flow_style=False)