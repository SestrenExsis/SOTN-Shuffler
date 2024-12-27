# External libraries
import collections
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
        self.top = top
        self.left = left
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
            room.top = top
            room.left = left
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
            if not (min_row >= 0 and min_col >= 0 and max_row < 64 and max_col < 64):
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
                'Top': room.top,
                'Left': room.left,
            }
        return result
    
    def remove_room(self, room_name):
        self.rooms.pop(room_name, None)

stages = {
    'Castle Entrance': [
        {
            # TODO(sestren): For now, the position of these rooms cannot be modified
            'Castle Entrance, Forest Cutscene': (44, 0),
            'Castle Entrance, Unknown Room 19': (44, 18),
            # TODO(sestren): For now, the horizontal position of these rooms cannot be modified
            'Castle Entrance, Unknown Room 20': (40, 30 + 1),
            'Castle Entrance, After Drawbridge': (38, 30 + 2),
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
    'Outer Wall': [
        {
            'Outer Wall, Elevator Shaft Room': (32 + 0, 32 + 2),
            'Outer Wall, Fake Room With Teleporter B': (32 + 2, 32 + 1),
            'Outer Wall, Loading Room A': (32 + 2, 32 + 2),
            'Outer Wall, Fake Room With Teleporter C': (32 + 6, 32 + 0),
            'Outer Wall, Loading Room C': (32 + 6, 32 + 1),
        },
        {
            'Outer Wall, Fake Room With Teleporter A': (0, 0),
            'Outer Wall, Loading Room B': (0, 1),
            'Outer Wall, Exit to Clock Tower': (0, 2),
        },
        {
            'Outer Wall, Fake Room With Teleporter D': (0, 0),
            'Outer Wall, Loading Room D': (0, 1),
            'Outer Wall, Exit to Marble Gallery': (0, 2),
        },
        {
            'Outer Wall, Lower Medusa Room': (0, 1),
            'Outer Wall, Telescope Room': (3, 0),
        },
        { 'Outer Wall, Blue Axe Knight Room': (0, 0) },
        { 'Outer Wall, Doppelganger Room': (0, 0) },
        { 'Outer Wall, Doppelganger Room': (0, 0) },
        { 'Outer Wall, Garlic Room': (0, 0) },
        { 'Outer Wall, Garnet Vase Room': (0, 0) },
        { 'Outer Wall, Gladius Room': (0, 0) },
        { 'Outer Wall, Jewel Knuckles Room': (1, 0) },
        { 'Outer Wall, Save Room A': (0, 0) },
        { 'Outer Wall, Save Room B': (0, 0) },
        { 'Outer Wall, Secret Platform Room': (0, 0) },
        { 'Outer Wall, Top of Outer Wall': (0, 0) },
    ],
    'Olrox\'s Quarters': [
        {
            'Olrox\'s Quarters, Skelerang Room': (32 + 0, 32 + 0),
            'Olrox\'s Quarters, Loading Room A': (32 + 2, 32 + 1),
            'Olrox\'s Quarters, Fake Room With Teleporter D': (32 + 2, 32 + 2),
        },
        {
            'Olrox\'s Quarters, Fake Room With Teleporter C': (1, 0),
            'Olrox\'s Quarters, Loading Room B': (1, 1),
            'Olrox\'s Quarters, Grand Staircase': (0, 2),
            'Olrox\'s Quarters, Bottom of Stairwell': (2, 3),
        },
        {
            'Olrox\'s Quarters, Tall Shaft': (0, 0),
            'Olrox\'s Quarters, Loading Room C': (5, 1),
            'Olrox\'s Quarters, Fake Room With Teleporter B': (5, 2),
        },
        {
            'Olrox\'s Quarters, Fake Room With Teleporter A': (0, 0),
            'Olrox\'s Quarters, Loading Room D': (0, 1),
            'Olrox\'s Quarters, Catwalk Crypt': (0, 2),
        },
        { 'Olrox\'s Quarters, Echo of Bat Room': (0, 0) },
        { 'Olrox\'s Quarters, Empty Cells': (0, 0) },
        { 'Olrox\'s Quarters, Empty Room': (0, 0) },
        { 'Olrox\'s Quarters, Garnet Room': (0, 0) },
        { 'Olrox\'s Quarters, Hammer and Blade Room': (0, 0) },
        { 'Olrox\'s Quarters, Narrow Hallway to Olrox': (0, 0) },
        { 'Olrox\'s Quarters, Olrox\'s Room': (0, 0) },
        { 'Olrox\'s Quarters, Open Courtyard': (0, 0) },
        { 'Olrox\'s Quarters, Prison': (0, 0) },
        { 'Olrox\'s Quarters, Save Room A': (0, 0) },
        { 'Olrox\'s Quarters, Secret Onyx Room': (0, 0) },
        { 'Olrox\'s Quarters, Sword Card Room': (0, 0) },
    ],
    'Colosseum': [
        {
            'Colosseum, Top of Elevator Shaft': (32 + 0, 32 + 0),
            'Colosseum, Loading Room B': (32 + 0, 32 + 5),
            'Colosseum, Fake Room With Teleporter B': (32 + 0, 32 + 6),
            'Colosseum, Bottom of Elevator Shaft': (32 + 1, 32 + 0),
        },
        {
            'Colosseum, Fake Room With Teleporter A': (0, 0),
            'Colosseum, Loading Room A': (0, 1),
            'Colosseum, Passageway Between Arena and Royal Chapel': (0, 2),
        },
        { 'Colosseum, Arena': (0, 0) },
        { 'Colosseum, Blade Master Room': (0, 0) },
        { 'Colosseum, Blood Cloak Room': (0, 0) },
        { 'Colosseum, Fountain Room': (0, 0) },
        { 'Colosseum, Holy Sword Room': (0, 0) },
        { 'Colosseum, Left-Side Armory': (0, 0) },
        { 'Colosseum, Right-Side Armory': (0, 0) },
        { 'Colosseum, Save Room A': (0, 0) },
        { 'Colosseum, Save Room B': (0, 0) },
        { 'Colosseum, Spiral Staircases': (0, 0) },
        { 'Colosseum, Top of Left Spiral Staircase': (0, 0) },
        { 'Colosseum, Top of Right Spiral Staircase': (0, 0) },
        { 'Colosseum, Valhalla Knight Room': (0, 0) },
    ],
    'Long Library': [
        {
            'Long Library, Exit to Outer Wall': (32 + 0, 32 + 0),
            'Long Library, Loading Room A': (32 + 0, 32 + 3),
            'Long Library, Fake Room With Teleporter A': (32 + 0, 32 + 4),
        },
        {
            'Long Library, Spellbook Area': (0, 0),
            'Long Library, Foot of Staircase': (3, 2),
        },
        { 'Long Library, Lesser Demon Area': (0, 0) },
        { 'Long Library, Secret Bookcase Room': (0, 0) },
        { 'Long Library, Holy Rod Room': (0, 0) },
        { 'Long Library, Dhuron and Flea Armor Room': (0, 0) },
        { 'Long Library, Shop': (0, 0) },
        { 'Long Library, Outside Shop': (0, 0) },
        { 'Long Library, Flea Man Room': (0, 0) },
        { 'Long Library, Faerie Card Room': (0, 0) },
        { 'Long Library, Three Layer Room': (0, 0) },
        { 'Long Library, Dhuron and Flea Man Room': (0, 0) },
        { 'Long Library, Save Room A': (0, 0) },
    ],
    'Clock Tower': [
        {
            'Clock Tower, Fake Room With Teleporter A': (32 + 0, 32 + 0),
            'Clock Tower, Loading Room B': (32 + 0, 32 + 1),
            'Clock Tower, Karasuman\'s Room': (32 + 0, 32 + 2),
        },
        {
            'Clock Tower, Stairwell to Outer Wall': (32 + 0, 32 + 0),
            'Clock Tower, Loading Room A': (32 + 0, 32 + 1),
            'Clock Tower, Fake Room With Teleporter B': (32 + 0, 32 + 2),
        },
        { 'Clock Tower, Path to Karasuman': (0, 0) },
        { 'Clock Tower, Healing Mail Room': (0, 0) },
        { 'Clock Tower, Pendulum Room': (0, 0) },
        { 'Clock Tower, Spire': (0, 0) },
        { 'Clock Tower, Hidden Armory': (0, 0) },
        { 'Clock Tower, Left Gear Room': (0, 0) },
        { 'Clock Tower, Right Gear Room': (0, 0) },
        { 'Clock Tower, Exit to Courtyard': (0, 0) },
        { 'Clock Tower, Belfry': (0, 0) },
        { 'Clock Tower, Open Courtyard': (0, 0) },
        { 'Clock Tower, Fire of Bat Room': (0, 0) },
    ],
}

def get_roomset(rng, rooms: dict, stage_data: dict) -> RoomSet:
    pool = {}
    for (roomset_id, roomset_data) in enumerate(stage_data):
        room_placements = []
        for (room_name, (top, left)) in roomset_data.items():
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
        # Go through possible source nodes in random order until a valid source node is found
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

class MapperData:
    def __init__(self):
        print('Build data core')
        self.rooms = {}
        self.teleporters = {}
        for stage_folder in (
            'castle-entrance',
            'castle-entrance-revisited',
            'alchemy-laboratory',
            'marble-gallery',
            'outer-wall',
            'olroxs-quarters',
            'colosseum',
            'long-library',
            'clock-tower',
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
    def __init__(self, mapper_data, changes):
        print('Build logic core')
        self.commands = {}
        for stage_name in (
            'Castle Entrance',
            'Castle Entrance Revisited',
            'Alchemy Laboratory',
            'Marble Gallery',
            'Outer Wall',
            'Olrox\'s Quarters',
            'Colosseum',
            'Long Library',
            'Clock Tower',
        ):
            print('', stage_name)
            nodes = {}
            for (location_name, room_data) in mapper_data['Rooms'].items():
                if room_data['Stage'] != stage_name:
                    continue
                print(' ', location_name)
                stage_changes = changes['Stages'][stage_name]
                location_key = None
                for possible_location_key in (
                    str(room_data['Index']),
                    room_data['Index'],
                    location_name,
                    stage_name + ', Room ID ' + f'{room_data['Index']:02d}',
                ):
                    if possible_location_key in stage_changes['Rooms']:
                        location_key = possible_location_key
                        break
                else:
                    print('Could not find key')
                    # print(room_data)
                    # print(stage_changes['Rooms'])
                # if mapper_data['Rooms'][location_name]['Stage'] != stage_name:
                #     continue
                room_top = None
                room_left = None
                if 'Rooms' in stage_changes and location_key in stage_changes['Rooms']:
                    if 'Top' in stage_changes['Rooms'][location_key]:
                        room_top = stage_changes['Rooms'][location_key]['Top']
                    if 'Left' in stage_changes['Rooms'][location_key]:
                        room_left = stage_changes['Rooms'][location_key]['Left']
                assert room_top is not None
                assert room_left is not None
                # print(location_name, (stage_name, location_key), (room_top, room_left))
                self.commands[location_name] = room_data['Commands']
                for (node_name, node) in room_data['Nodes'].items():
                    row = room_top + node['Row']
                    column = room_left + node['Column']
                    edge = node['Edge']
                    nodes[(row, column, edge)] = (location_name, node_name, node['Entry Section'], stage_name)
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
            for (row, column, edge), (location_name, node_name, section_name, stage_name) in nodes.items():
                if stage_name == 'Castle Entrance':
                    print((row, column, edge), (location_name, node_name, section_name, stage_name))
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
                (matching_location_name, matching_node_name, matching_section, matching_stage_name) = (None, 'Unknown', None, 'Unknown')
                if (matching_row, matching_column, matching_edge) in nodes:
                    (matching_location_name, matching_node_name, matching_section, matching_stage_name) = nodes[(matching_row, matching_column, matching_edge)]
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Location'] = matching_location_name
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Section'] = matching_section
                # TODO(sestren): Use Milestone instead of Progression for reaching a stage
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Progression - ' + matching_stage_name + ' Stage Reached'] = True
        # Replace source teleporter locations with their targets
        for (location_name, location_info) in self.commands.items():
            for (command_name, command_info) in location_info.items():
                if 'Outcomes' in command_info and 'Location' in command_info['Outcomes']:
                    old_location_name = command_info['Outcomes']['Location']
                    if old_location_name in mapper_data['Teleporters']['Sources']:
                        source = mapper_data['Teleporters']['Sources'][old_location_name]
                        target = mapper_data['Teleporters']['Targets'][source['Target']]
                        new_location_name = target['Stage'] + ', ' + target['Room']
                        self.commands[location_name][command_name]['Outcomes']['Location'] = new_location_name
                        target_section_name = mapper_data['Rooms'][new_location_name]['Nodes'][target['Node']]['Entry Section']
                        self.commands[location_name][command_name]['Outcomes']['Section'] = target_section_name
        # Delete fake rooms mentioned as teleporter locations
        for location_name in mapper_data['Teleporters']['Sources']:
            if 'Fake' in location_name:
                self.commands.pop(location_name, None)
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
            'Debug - Get Soul of Wolf': {
                'Relic - Soul of Wolf': True,
            },
        }
    
    def get_core(self) -> dict:
        result = {
            'State': self.state,
            'Goals': self.goals,
            'Commands': self.commands,
        }
        return result

class Mapper:
    def __init__(self, mapper_data, stage_name: str, seed: int):
        self.stage_name = stage_name
        self.attempts = 0
        self.start_time = None
        self.end_time = None
        self.stage = None
        self.rooms = {}
        for (room_name, room_data) in mapper_data['Rooms'].items():
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
    
    def validate(self) -> bool:
        result = False
        if self.stage is not None:
            excluded_room_names = {
                'Castle Entrance, Forest Cutscene',
                'Castle Entrance, Unknown Room 19',
                'Castle Entrance, Unknown Room 20',
                'Castle Entrance Revisited, Forest Cutscene',
                'Castle Entrance Revisited, Unknown Room 19',
                'Castle Entrance Revisited, Unknown Room 20',
            }
            all_rooms_used = len(self.stage.rooms) >= len(self.rooms)
            no_nodes_unused = len(self.stage.get_open_nodes()) < 1
            room_names_left = set(self.stage.rooms.keys()) - excluded_room_names
            room_names_visited = set()
            work = collections.deque()
            work.append(next(iter(room_names_left)))
            while len(work) > 0:
                source_room_name = work.pop()
                room_names_visited.add(source_room_name)
                if source_room_name not in room_names_left:
                    continue
                room_names_left.remove(source_room_name)
                source_room = self.stage.rooms[source_room_name]
                for (source_node_name, source_node) in source_room.nodes.items():
                    for target_room_name in room_names_left:
                        target_room = self.stage.rooms[target_room_name]
                        for (target_node_name, target_node) in target_room.nodes.items():
                            if target_node.matches(source_node):
                                work.appendleft(target_room_name)
                                break
            all_rooms_connected = len(room_names_visited) >= (len(set(self.rooms) - excluded_room_names))
            result = all_rooms_used and no_nodes_unused and all_rooms_connected
        return result

if __name__ == '__main__':
    '''
    Usage
    python mapper.py
    '''
    GENERATION_VERSION = '0.0.4'
    mapper_data = MapperData().get_core()
    try:
        with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'r') as generated_stages_json:
            generated_stages = json.load(generated_stages_json)
    except:
        generated_stages = {
            'Alchemy Laboratory': [],
            'Marble Gallery': [],
            'Outer Wall': [],
            'Olrox\'s Quarters': [],
            'Colosseum': [],
            'Castle Entrance': [],
            'Long Library': [],
            'Clock Tower': [],
        }
    seed = random.randint(0, 2 ** 64)
    MULTIPLIER = 50
    WEIGHTS = [2, 2, 1, 2, 2, 1, 2, 1] # 100, 50
    for (stage_name, target_seed_count) in (
        ('Alchemy Laboratory', MULTIPLIER * WEIGHTS[0]),
        ('Marble Gallery', MULTIPLIER * WEIGHTS[1]),
        ('Outer Wall', MULTIPLIER * WEIGHTS[2]),
        ('Olrox\'s Quarters', MULTIPLIER * WEIGHTS[3]),
        ('Colosseum', MULTIPLIER * WEIGHTS[4]),
        ('Castle Entrance', MULTIPLIER * WEIGHTS[5]),
        ('Long Library', MULTIPLIER * WEIGHTS[6]),
        ('Clock Tower', MULTIPLIER * WEIGHTS[7]),
    ):
        if stage_name not in generated_stages:
            generated_stages[stage_name] = []
        print('')
        print(stage_name, target_seed_count, target_seed_count - len(generated_stages[stage_name]))
        if stage_name not in generated_stages:
            generated_stages[stage_name] = []
        while len(generated_stages[stage_name]) < target_seed_count:
            stage_map = Mapper(mapper_data, stage_name, seed)
            while True:
                stage_map.generate()
                if stage_map.validate():
                    break
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
            seed = stage_map.rng.randint(0, 2 ** 64)
        with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'w') as generated_stages_json:
            json.dump(generated_stages, generated_stages_json, indent='    ', sort_keys=True, default=str)
