# External libraries
import argparse
import collections
import datetime
import hashlib
import json
import os
import pathlib
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
        for row in range(self.rows):
            for col in range(self.columns):
                if (row, col) not in self.empty_cells:
                    result.add((self.top + row + offset_top, self.left + col + offset_left))
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
            # TODO(sestren): Verify each open node in the current roomset is not blocked by the source roomset
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
            'Long Library, Loading Room A': (32 + 2, 32 + 3),
            'Long Library, Fake Room With Teleporter A': (32 + 2, 32 + 4),
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
    'Warp Rooms': [
        {
            'Warp Rooms, Warp Room D': (38 + 0, 15 + 0),
            'Warp Rooms, Loading Room B': (38 + 0, 15 + 1),
            'Warp Rooms, Fake Room With Teleporter D': (38 + 0, 15 + 2),
        },
        {
            'Warp Rooms, Fake Room With Teleporter A': (12 + 0, 38 + 0),
            'Warp Rooms, Loading Room E': (12 + 0, 38 + 1),
            'Warp Rooms, Warp Room A': (12 + 0, 38 + 2),
        },
        {
            'Warp Rooms, Fake Room With Teleporter C': (21 + 0, 35 + 0),
            'Warp Rooms, Loading Room C': (21 + 0, 35 + 1),
            'Warp Rooms, Warp Room B': (21 + 0, 35 + 2),
        },
        {
            'Warp Rooms, Warp Room C': (17 + 0, 59 + 0),
            'Warp Rooms, Loading Room D': (17 + 0, 59 + 1),
            'Warp Rooms, Fake Room With Teleporter B': (17 + 0, 59 + 2),
        },
        {
            'Warp Rooms, Fake Room With Teleporter E': (44 + 0, 33 + 0),
            'Warp Rooms, Loading Room A': (44 + 0, 33 + 1),
            'Warp Rooms, Warp Room E': (44 + 0, 33 + 2),
        },
    ],
    'Castle Keep': [
        {
            'Castle Keep, Keep Area': (32 + 0, 32 + 2),
            'Castle Keep, Upper Attic': (32 + 1, 32 + 5),
            'Castle Keep, Lower Attic': (32 + 2, 32 + 6),
            'Castle Keep, Loading Room C': (32 + 7, 32 + 1),
            'Castle Keep, Fake Room With Teleporter B': (32 + 7, 32 + 0),
        },
        {
            'Castle Keep, Lion Torch Platform': (0 + 0, 0 + 0),
            'Castle Keep, Loading Room A': (0 + 1, 0 + 1),
            'Castle Keep, Fake Room With Teleporter A': (0 + 1, 0 + 2),
        },
        {
            'Castle Keep, Dual Platforms': (0 + 0, 0 + 0),
            'Castle Keep, Loading Room B': (0 + 1, 0 + 1),
            'Castle Keep, Fake Room With Teleporter C': (0 + 1, 0 + 2),
        },
        { 'Castle Keep, Bend': (0, 0) },
        { 'Castle Keep, Falchion Room': (0, 0) },
        { 'Castle Keep, Ghost Card Room': (0, 0) },
        { 'Castle Keep, Save Room A': (0, 0) },
        { 'Castle Keep, Tyrfing Room': (0, 0) },
    ],
    'Royal Chapel': [
        {
            # NOTE(sestren): For now, these hallways and towers must be combined until the special behavior that controls transitions between them is better understood
            'Royal Chapel, Spike Hallway': (32 + 4, 32 + 0),
            'Royal Chapel, Left Tower': (32 + 1, 32 + 3),
            'Royal Chapel, Walkway Between Towers': (32 + 3, 32 + 5),
            'Royal Chapel, Middle Tower': (32 + 0, 32 + 8),
            'Royal Chapel, Walkway Left of Hippogryph': (32 + 2, 32 + 10),
        },
        {
            'Royal Chapel, Walkway Right of Hippogryph': (0 + 3, 0 + 0),
            'Royal Chapel, Right Tower': (0 + 0, 0 + 1),
            'Royal Chapel, Loading Room A': (0 + 2, 0 + 4),
            'Royal Chapel, Fake Room With Teleporter A': (0 + 2, 0 + 5),
        },
        {
            'Royal Chapel, Pushing Statue Shortcut': (0 + 0, 0 + 0),
            'Royal Chapel, Loading Room D': (0 + 0, 0 + 1),
            'Royal Chapel, Fake Room With Teleporter B': (0 + 0, 0 + 2),
        },
        {
            'Royal Chapel, Nave': (0 + 0, 0 + 0),
            'Royal Chapel, Loading Room C': (0 + 1, 0 + 2),
            'Royal Chapel, Fake Room With Teleporter C': (0 + 1, 0 + 3),
        },
        {
            'Royal Chapel, Statue Ledge': (0 + 0, 0 + 0),
            'Royal Chapel, Loading Room B': (0 + 0, 0 + 1),
            'Royal Chapel, Fake Room With Teleporter D': (0 + 0, 0 + 2),
        },
        { 'Royal Chapel, Chapel Staircase': (0, 0) },
        { 'Royal Chapel, Confessional Booth': (0, 0) },
        { 'Royal Chapel, Empty Room': (0, 0) },
        { 'Royal Chapel, Goggles Room': (0, 0) },
        { 'Royal Chapel, Hippogryph Room': (0, 0) },
        { 'Royal Chapel, Save Room A': (0, 0) },
        { 'Royal Chapel, Save Room B': (0, 0) },
        { 'Royal Chapel, Silver Ring Room': (0, 0) },
    ],
    'Underground Caverns': [
        {
            'Underground Caverns, False Save Room': (32 + 0, 32 + 0),
            'Underground Caverns, Fake Room With Teleporter B': (32 + 0, 32 + 1),
        },
        {
            'Underground Caverns, Fake Room With Teleporter D': (0 + 0, 0 + 0),
            'Underground Caverns, Loading Room A': (0 + 0, 0 + 1),
            'Underground Caverns, Exit to Castle Entrance': (0 + 0, 0 + 2),
        },
        {
            'Underground Caverns, Long Drop': (0 + 0, 0 + 0),
            'Underground Caverns, Loading Room B': (0 + 0, 0 + 1),
            'Underground Caverns, Fake Room With Teleporter A': (0 + 0, 0 + 2),
        },
        {
            'Underground Caverns, Fake Room With Teleporter C': (0 + 0, 0 + 0),
            'Underground Caverns, Loading Room C': (0 + 0, 0 + 1),
            'Underground Caverns, Exit to Abandoned Mine': (0 + 0, 0 + 2),
        },
        { 'Underground Caverns, Save Room A': (0, 0) },
        { 'Underground Caverns, Save Room B': (0, 0) },
        { 'Underground Caverns, Save Room C': (0, 0) },
        { 'Underground Caverns, Hidden Crystal Entrance': (0, 0) },
        { 'Underground Caverns, Crystal Bend': (0, 0) },
        { 'Underground Caverns, Tall Stairwell': (0, 0) },
        { 'Underground Caverns, Plaque Room With Life Max-Up': (0, 0) },
        { 'Underground Caverns, Small Stairwell': (0, 0) },
        { 'Underground Caverns, Claymore Stairwell': (0, 0) },
        { 'Underground Caverns, Meal Tickets and Moonstone Room': (0, 0) },
        { 'Underground Caverns, Plaque Room With Breakable Wall': (0, 0) },
        { 'Underground Caverns, Room ID 09': (0, 0) },
        { 'Underground Caverns, Room ID 10': (0, 0) },
        { 'Underground Caverns, Room ID 11': (0, 0) },
        { 'Underground Caverns, Room ID 12': (0, 0) },
        { 'Underground Caverns, Holy Symbol Room': (0, 0) },
        { 'Underground Caverns, Pentagram Room': (0, 0) },
        { 'Underground Caverns, DK Bridge': (0, 0) },
        { 'Underground Caverns, DK Button': (0, 0) },
        { 'Underground Caverns, Room ID 18': (0, 0) },
        { 'Underground Caverns, Room ID 19': (0, 0) },
        { 'Underground Caverns, Merman Statue Room': (0, 0) },
        { 'Underground Caverns, Ice Floe Room': (0, 0) },
        { 'Underground Caverns, Right Ferryman Route': (0, 0) },
        { 'Underground Caverns, Crystal Cloak Room': (0, 0) },
        { 'Underground Caverns, Left Ferryman Route': (0, 0) },
        { 'Underground Caverns, Waterfall': (0, 0) },
        { 'Underground Caverns, Scylla Room': (0, 0) },
        { 'Underground Caverns, Scylla Wyrm Room': (0, 0) },
        { 'Underground Caverns, Rising Water Room': (0, 0) },
        { 'Underground Caverns, Bandanna Room': (0, 0) },
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
    for roomset_id in range(1, len(stage_data)):
        if len(result.get_open_nodes()) < 1:
            # print('place extra room', roomset_id)
            result.add_roomset(pool.pop(roomset_id), 0, 0)
        else:
            break
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
        if len(open_nodes) < 1:
            # print('ERROR: No matching source nodes for the chosen target node')
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
            # if (target_node.room.stage_name, target_node.room.index) != ('Underground Caverns', 39):
            #     print('ERROR: All matching source nodes for the target node result in invalid room placement:', target_node)
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
            'warp-rooms',
            'castle-keep',
            'royal-chapel',
            'underground-caverns',
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
        self.commands = {
            'Global': {
                'Use Library Card': {
                    'Outcomes': {
                        'Location': 'Long Library, Outside Shop',
                        'Section': 'Main',
                        'Item - Library Card': -1,
                    },
                    'Requirements': {
                        'Default': {
                            'Item - Library Card': {
                                'Minimum': 1,
                            },
                        },
                    },
                },
            },
        }
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
            'Warp Rooms',
            'Castle Keep',
            'Royal Chapel',
            'Underground Caverns',
        ):
            # print('', stage_name)
            nodes = {}
            for (location_name, room_data) in mapper_data['Rooms'].items():
                if room_data['Stage'] != stage_name:
                    continue
                # print(' ', location_name)
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
                # if stage_name == 'Castle Entrance':
                #     print((row, column, edge), (location_name, node_name, section_name, stage_name))
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
        self.steps = []
    
    def generate(self):
        self.current_seed = self.next_seed
        self.next_seed = self.rng.randint(0, 2 ** 64)
        self.rng = random.Random(self.current_seed)
        if self.attempts < 1:
            self.start_time = datetime.datetime.now(datetime.timezone.utc)
        pool = {}
        for (roomset_id, roomset_data) in enumerate(stages[self.stage_name]):
            room_placements = []
            for (room_name, (top, left)) in roomset_data.items():
                room_placements.append((self.rooms[room_name], top, left))
            pool[roomset_id] = RoomSet(roomset_id, room_placements)
        self.stage = pool.pop(0)
        for roomset_id in range(1, len(stages[self.stage_name])):
            if len(self.stage.get_open_nodes()) < 1:
                print('place extra room', roomset_id)
                self.stage.add_roomset(pool.pop(roomset_id), 0, 0)
            else:
                break
        self.steps = []
        while len(pool) > 0:
            step = []
            possible_target_nodes = self.stage.get_open_nodes()
            if len(possible_target_nodes) < 1:
                step.append('ERROR: No open nodes left')
                break
            target_node = self.rng.choice(possible_target_nodes)
            step.append('Target Node: ' + str(target_node))
            open_nodes = []
            for (roomset_id, roomset) in pool.items():
                for open_node in roomset.get_open_nodes(matching_node=target_node):
                    open_nodes.append(open_node)
            if len(open_nodes) < 1:
                step.append('ERROR: No matching source nodes for the chosen target node')
                break
            # Go through possible source nodes in random order until a valid source node is found
            open_nodes.sort()
            self.rng.shuffle(open_nodes)
            for source_node in open_nodes:
                roomset_key = source_node.room.roomset.roomset_id
                offset_top = (target_node.room.top + target_node.top) - (source_node.room.top + source_node.top)
                offset_left = (target_node.room.left + target_node.left) - (source_node.room.left + source_node.left)
                valid_ind = self.stage.add_roomset(source_node.room.roomset, offset_top, offset_left)
                if valid_ind:
                    step.append('Source Node: ' + str(source_node))
                    roomset = pool.pop(roomset_key, None)
                    break
            else:
                step.append('ERROR: All matching source nodes for the target node result in invalid room placement')
                break
            self.steps.append(' | '.join(step))
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
            result = (
                all_rooms_used and
                no_nodes_unused and
                (all_rooms_connected or self.stage_name in ('Warp Rooms', 'Underground Caverns'))
            )
            # if len(self.stage.rooms) > 41:
            #     print(all_rooms_used, no_nodes_unused, all_rooms_connected, len(self.stage.rooms), len(self.rooms))
            #     for line in self.get_spoiler('Underground Caverns'):
            #         print(line)
            #     print(len(self.steps))
            #     for step in self.steps:
            #         print(step)
            #     print(set(self.rooms) - set(self.stage.rooms.keys()))
        return result

    def get_spoiler(self, stage_name: str) -> list[str]:
        codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+. '
        legend = []
        (stage_top, stage_left, stage_bottom, stage_right) = (float('inf'), float('inf'), float('-inf'), float('-inf'))
        for (room_name, room) in self.rooms.items():
            if room.stage_name != stage_name:
                continue
            room_bottom = room.top + room.rows - 1
            room_right = room.left + room.columns - 1
            stage_top = min(stage_top, room.top)
            stage_left = min(stage_left, room.left)
            stage_bottom = max(stage_bottom, room_bottom)
            stage_right = max(stage_right, room_right)
        stage_rows = 1 + stage_bottom - stage_top
        stage_cols = 1 + stage_right - stage_left
        grid = [[' ' for col in range(5 * stage_cols)] for row in range(5 * stage_rows)]
        for (room_name, room) in self.rooms.items():
            if room.stage_name != stage_name:
                continue
            code = codes[room.index]
            legend.append((code, room_name))
            for cell_row in range(max(0, room.top), min(64, room.top + room.rows)):
                for cell_col in range(max(0, room.left), min(64, room.left + room.columns)):
                    if (cell_row - room.top, cell_col - room.left) in room.empty_cells:
                        continue
                    top = cell_row - stage_top
                    left = cell_col - stage_left
                    for row in range(5 * top + 1, 5 * top + 4):
                        for col in range(5 * left + 1, 5 * left + 4):
                            prev_index = codes.find(grid[row][col])
                            if room.index < prev_index:
                                grid[row][col] = code
            for node in room.nodes.values():
                (exit_row, exit_col, exit_edge) = (node.row, node.column, node.edge)
                row = 2 + 5 * (room.top - stage_top + exit_row)
                col = 2 + 5 * (room.left - stage_left + exit_col)
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
            room = self.rooms[room_name]
            result.append(str((code, room_name, ('I:', room.index, 'T:', room.top, 'L:', room.left, 'R:', room.rows, 'C:', room.columns))))
        return result

if __name__ == '__main__':
    '''
    Usage
    python mapper.py
    '''
    for stage_name in stages:
        pathlib.Path(
            os.path.join('build', 'mapper', stage_name)
        ).mkdir(parents=True, exist_ok=True)
    GENERATION_VERSION = '0.0.4'
    mapper_core = MapperData().get_core()
    with (
        open(os.path.join('build', 'mapper', 'mapper-core.json'), 'w') as mapper_core_json,
    ):
        json.dump(mapper_core, mapper_core_json, indent='    ', sort_keys=True, default=str)
    parser = argparse.ArgumentParser()
    parser.add_argument('stage_name', help='Input a valid stage name', type=str)
    parser.add_argument('stage_count', help='Input the number of stage instances to generate', type=int)
    args = parser.parse_args()
    print('')
    print(args.stage_name, args.stage_count)
    seed = random.randint(0, 2 ** 64)
    for _ in range(args.stage_count):
        stage_map = Mapper(mapper_core, args.stage_name, seed)
        while True:
            stage_map.generate()
            if stage_map.validate():
                break
        changes = stage_map.stage.get_changes()
        hash_of_rooms = hashlib.sha256(json.dumps(changes['Rooms'], sort_keys=True).encode()).hexdigest()
        mapper_data = {
            'Attempts': stage_map.attempts,
            'Generation Start Date': stage_map.start_time.isoformat(),
            'Generation End Date': stage_map.end_time.isoformat(),
            'Generation Version': GENERATION_VERSION,
            'Hash of Rooms': hash_of_rooms,
            'Seed': stage_map.current_seed,
            'Stage': args.stage_name,
        }
        print(mapper_data)
        mapper_data['Rooms'] = changes['Rooms']
        mapper_data['Spoiler'] = stage_map.get_spoiler(args.stage_name)
        # spoiler = stage_map.get_spoiler(args.stage_name)
        # for line in spoiler:
        #     print(line)
        filepath = os.path.join('build', 'mapper', args.stage_name, hash_of_rooms + '.json')
        if not os.path.exists(filepath):
            with (
                open(os.path.join('build', 'mapper', args.stage_name, hash_of_rooms + '.json'), 'w') as mapper_data_json,
            ):
                json.dump(mapper_data, mapper_data_json, indent='    ', sort_keys=True, default=str)
        else:
            print('Stage with that hash already exists:', (args.stage_name, hash_of_rooms))
        seed = stage_map.rng.randint(0, 2 ** 64)
