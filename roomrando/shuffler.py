import collections
import json
import random
import yaml

'''
- A dummy copy of NZ0-00 is visible from NZ0-13
- Initially, NZ0-00 and NZ0-13 should be moved around as one unit
- Once the ability to alter tilemaps becomes possible, that can be revisited
'''

class RoomRandomizer:
    room_sets = {
        'Alchemy Laboratory, Tetromino Room':
        {
            'Alchemy Laboratory, Bat Card Room': (1, 0),
        },
        'Alchemy Laboratory, Exit to Marble Gallery':
        {
            'Alchemy Laboratory, Loading Room A': (1, 2),
            'Alchemy Laboratory, Fake Room With Teleporter A': (1, 3),
        },
        'Alchemy Laboratory, Exit to Holy Chapel':
        {
            'Alchemy Laboratory, Loading Room B': (0, -1),
            'Alchemy Laboratory, Fake Room With Teleporter B': (0, -2),
        },
        'Alchemy Laboratory, Entryway':
        {
            'Alchemy Laboratory, Loading Room C': (0, 3),
            'Alchemy Laboratory, Fake Room With Teleporter C': (0, 4),
        },
        'Castle Entrance, Cube of Zoe Room':
        {
            'Castle Entrance, Loading Room A': (0, 2),
            'Castle Entrance, Fake Room With Teleporter B': (0, 3),
            'Castle Entrance, Loading Room C': (0, -1),
            'Castle Entrance, Fake Room With Teleporter A': (0, -2),
        },
        'Castle Entrance, Shortcut to Warp':
        {
            'Castle Entrance, Loading Room B': (0, -1),
            'Castle Entrance, Fake Room With Teleporter C': (0, -2),
        },
        'Castle Entrance, Shortcut to Underground Caverns':
        {
            'Castle Entrance, Loading Room D': (0, 1),
            'Castle Entrance, Fake Room With Teleporter D': (0, 2),
        },
    }
    def __init__(self, logic, initial_seed: int=None):
        self.logic = logic
        for (room_name, room) in self.logic['Rooms'].items():
            # NOTE: Treat loading rooms as having red door nodes for stage connection purposes
            if 'Loading Room' in room_name:
                for node_name in room['Node Sections']:
                    self.logic['Rooms'][room_name]['Node Sections'][node_name]['Type'] = 'Red Door'
        self.initial_seed = initial_seed
        self.rng = random.Random(self.initial_seed)
        self.reset()

    def reset(self):
        self.empty_cells = set()
        # For now, allow the shuffled rooms to overlap all other rooms and stages
        for row in range(64):
            for col in range(64):
                self.empty_cells.add((row, col))
        self.changes = {
            'Rooms': {},
            'Teleporters': {},
        }
        self.unplaced_nodes = {
            'Left': set(),
            'Top': set(),
            'Right': set(),
            'Bottom': set(),
        }
        for (room_name, room) in self.logic['Rooms'].items():
            if room_name not in (
                'Castle Entrance, After Drawbridge',
                'Castle Entrance, Attic Entrance',
                'Castle Entrance, Attic Hallway',
                'Castle Entrance, Attic Staircase',
                'Castle Entrance, Cube of Zoe Room',
                'Castle Entrance, Drop Under Portcullis',
                'Castle Entrance, Gargoyle Room',
                'Castle Entrance, Heart Max-Up Room',
                'Castle Entrance, Holy Mail Room',
                'Castle Entrance, Jewel Sword Room',
                'Castle Entrance, Life Max-Up Room',
                'Castle Entrance, Meeting Room With Death',
                'Castle Entrance, Merman Room',
                'Castle Entrance, Save Room A',
                'Castle Entrance, Save Room B',
                'Castle Entrance, Save Room C',
                'Castle Entrance, Shortcut to Underground Caverns',
                'Castle Entrance, Shortcut to Warp',
                'Castle Entrance, Stairwell After Death',
                'Castle Entrance, Warg Hallway',
                'Castle Entrance, Zombie Hallway',
                # 'Alchemy Laboratory, Bloody Zombie Hallway',
                # 'Alchemy Laboratory, Blue Door Hallway',
                # 'Alchemy Laboratory, Box Puzzle Room',
                # 'Alchemy Laboratory, Cannon Room',
                # 'Alchemy Laboratory, Cloth Cape Room',
                # 'Alchemy Laboratory, Corridor to Elevator',
                # 'Alchemy Laboratory, Elevator Shaft',
                # 'Alchemy Laboratory, Empty Zig Zag Room',
                # 'Alchemy Laboratory, Entryway',
                # 'Alchemy Laboratory, Exit to Holy Chapel',
                # 'Alchemy Laboratory, Exit to Marble Gallery',
                # 'Alchemy Laboratory, Glass Vats',
                # 'Alchemy Laboratory, Heart Max-Up Room',
                # 'Alchemy Laboratory, Red Skeleton Lift Room',
                # 'Alchemy Laboratory, Save Room A',
                # 'Alchemy Laboratory, Save Room B',
                # 'Alchemy Laboratory, Save Room C',
                # 'Alchemy Laboratory, Secret Life Max-Up Room',
                # 'Alchemy Laboratory, Short Zig Zag Room',
                # 'Alchemy Laboratory, Skill of Wolf Room',
                # 'Alchemy Laboratory, Slogra and Gaibon Boss Room',
                # 'Alchemy Laboratory, Sunglasses Room',
                # 'Alchemy Laboratory, Tall Spittlebone Room',
                # 'Alchemy Laboratory, Tall Zig Zag Room',
                # 'Alchemy Laboratory, Tetromino Room',
            ):
                continue
            for (node_name, node) in room['Node Sections'].items():
                self.unplaced_nodes[node['Edge']].add((room_name, node_name))
        self.segments = collections.defaultdict(set)
    
    def to_segment(self, row: int, col: int, edge: str) -> tuple[int]:
        top = None
        left = None
        bottom = None
        right = None
        if edge == 'Top':
            (top, left, bottom, right) = (row    , col    , row    , col + 1)
        elif edge == 'Left':
            (top, left, bottom, right) = (row    , col    , row + 1, col    )
        elif edge == 'Bottom':
            (top, left, bottom, right) = (row + 1, col    , row + 1, col + 1)
        elif edge == 'Right':
            (top, left, bottom, right) = (row    , col + 1, row + 1, col + 1)
        result = (top, left, bottom, right)
        return result
    
    def to_cell(self, segment: tuple[int], edge: str) -> tuple[int]:
        (top, left, bottom, right) = segment
        (row, col) = (None, None)
        if edge == 'Top':
            (row, col) = (top - 1, left)
        elif edge == 'Left':
            (row, col) = (top, left - 1)
        elif edge == 'Bottom':
            (row, col) = (top, left)
        elif edge == 'Right':
            (row, col) = (top, left)
        result = (row, col)
        return result

    def to_matching_edge(self, edge: str) -> str:
        result = None
        if edge == 'Top':
            result = 'Bottom'
        elif edge == 'Bottom':
            result = 'Top'
        elif edge == 'Left':
            result = 'Right'
        elif edge == 'Right':
            result = 'Left'
        return result

    def open_edges(self):
        result = set(
            (segment, list(edges)[0]) for (segment, edges) in
            self.segments.items() if len(edges) == 1
        )
        return result

    def place_room(self, room_name: str, top: int, left: int):
        # TODO: If room is part of a set, place all rooms in that set together
        self.changes['Rooms'][room_name] = {}
        # Room indexes are left at default values for now
        self.changes['Rooms'][room_name]['Index'] = self.logic['Rooms'][room_name]['Index']
        self.changes['Rooms'][room_name]['Top'] = top
        self.changes['Rooms'][room_name]['Left'] = left
        for (node_name, node) in self.logic['Rooms'][room_name]['Node Sections'].items():
            # NOTE: Red door connections will be handled in a hard-coded way in a later step
            if node['Type'] == 'Red Door':
                continue
            row = self.changes['Rooms'][room_name]['Top'] + node['Row']
            col = self.changes['Rooms'][room_name]['Left'] + node['Column']
            segment = self.to_segment(row, col, node['Edge'])
            self.segments[segment].add(node['Edge'])
            try:
                self.unplaced_nodes[node['Edge']].remove((room_name, node_name))
            except KeyError:
                pass
        for row in range(self.logic['Rooms'][room_name]['Rows']):
            for col in range(self.logic['Rooms'][room_name]['Columns']):
                cell = (
                    self.changes['Rooms'][room_name]['Top'] + row,
                    self.changes['Rooms'][room_name]['Left'] + col,
                )
                if cell in self.empty_cells:
                    self.empty_cells.remove(cell)
    
    def place_teleporter(self, source_name: str, target_name: str):
        if 'Sources' not in self.changes['Teleporters']:
            self.changes['Teleporters']['Sources'] = {}
        if source_name not in self.changes['Teleporters']['Sources']:
            self.changes['Teleporters']['Sources'][source_name] = {}
        self.changes['Teleporters']['Sources'][source_name]['Target'] = target_name

    def possible_matching_nodes(self, segment, edge):
        # (top, left, bottom, right) = segment
        matching_edge = self.to_matching_edge(edge)
        (target_row, target_col) = self.to_cell(segment, edge)
        # (segment, edge)
        result = []
        for (room_name, node_name) in sorted(self.unplaced_nodes[matching_edge]):
            legal_ind = True
            # All cells of where the room will be placed must be empty
            node_row = self.logic['Rooms'][room_name]['Node Sections'][node_name]['Row']
            node_col = self.logic['Rooms'][room_name]['Node Sections'][node_name]['Column']
            room_top = target_row - node_row
            room_left = target_col - node_col
            for row in range(self.logic['Rooms'][room_name]['Rows']):
                for col in range(self.logic['Rooms'][room_name]['Columns']):
                    if (room_top + row, room_left + col) not in self.empty_cells:
                        legal_ind = False
                        break
                if not legal_ind:
                    break
            if not legal_ind:
                continue
            # All nodes of the room must complete an open node or start a new one
            for (other_node_name, node) in self.logic['Rooms'][room_name]['Node Sections'].items():
                row = room_top + node['Row']
                col = room_left + node['Column']
                segment = self.to_segment(row, col, node['Edge'])
                (target_row, target_col) = self.to_cell(segment, node['Edge'])
                if (target_row, target_col) in self.empty_cells:
                    continue
                if len(self.segments[segment]) == 1:
                    continue
                legal_ind = False
                break
            if legal_ind:
                result.append((room_name, node_name))
        return result

    def shuffle_rooms(self) -> dict:
        self.reset()
        # The location of these rooms do not change for now
        for room_name in (
            'Castle Entrance, Forest Cutscene',
            'Castle Entrance, Unknown 19',
            'Castle Entrance, Unknown 20',
            'Castle Entrance, After Drawbridge',
        ):
            self.place_room(
                room_name,
                self.logic['Rooms'][room_name]['Top'],
                self.logic['Rooms'][room_name]['Left'],
            )
        # Hard-code placing the other two red door rooms randomly
        # if self.rng.random() <= 0.0:
        #     for room_name in (
        #         'Alchemy Laboratory, Exit to Marble Gallery',
        #         'Alchemy Laboratory, Entryway',
        #     ):
        #         self.place_room(
        #             room_name,
        #             self.logic['Rooms'][room_name]['Top'],
        #             self.logic['Rooms'][room_name]['Left'],
        #         )
        # else:
        #     self.place_room('Alchemy Laboratory, Exit to Marble Gallery', 35, 15)
        #     self.place_room('Alchemy Laboratory, Entryway', 26, 18)
        #     self.place_teleporter('Castle Entrance, Fake Room With Teleporter A', 'Alchemy Laboratory, Exit to Marble Gallery (Right Node)')
        #     self.place_teleporter('Castle Entrance Revisited, Fake Room With Teleporter A', 'Alchemy Laboratory, Exit to Marble Gallery (Right Node)')
        #     self.place_teleporter('Marble Gallery, Fake Room With Teleporter A', 'Alchemy Laboratory, Entryway (Right Node)')
        rooms_placed = 0
        while len(self.unplaced_nodes) > 0:
            # Check all placed nodes for openness
            # NOTE: It is important to always sort before using RNG for consistency
            open_edges = list(sorted(self.open_edges()))
            if len(open_edges) < 1:
                break
            # Choose random open node A, if any exist
            self.rng.shuffle(open_edges)
            for (segment, edge) in open_edges:
                nodes = self.possible_matching_nodes(segment, edge)
                # Stop looking once you've found at least one open node
                if len(nodes) > 0:
                    break
            if len(nodes) < 1:
                # Halt if you can't find a matching node
                break
            # Choose random unplaced legal node B that complements A
            (room_name, node_name) = self.rng.choice(nodes)
            # print(' ', len(self.unplaced_nodes), room_name, '(', node_name, ')') # , self.unplaced_nodes)
            # Place all nodes from B's room, relative to where B was placed
            node_row = self.logic['Rooms'][room_name]['Node Sections'][node_name]['Row']
            node_col = self.logic['Rooms'][room_name]['Node Sections'][node_name]['Column']
            (target_row, target_col) = self.to_cell(segment, edge)
            room_top = target_row - node_row
            room_left = target_col - node_col
            self.place_room(room_name, room_top, room_left)
            if room_name in self.room_sets:
                for other_room_name, (offset_row, offset_col) in self.room_sets[room_name].items():
                    self.place_room(other_room_name, room_top + offset_row, room_left + offset_col)
                    # print('  ', len(self.unplaced_nodes), other_room_name, (offset_row, offset_col))
                    rooms_placed += 1
            rooms_placed += 1
    
    def show_spoiler(self):
        codes = '0123456789abcdefghijklmnopqrstuv+. '
        result = [[' ' for col in range(64)] for row in range(64)]
        for (row, col) in self.empty_cells:
            result[row][col] = '.'
        for room_name in self.changes['Rooms'].keys():
            (index, top, left, rows, cols) = (
                self.changes['Rooms'][room_name]['Index'],
                self.changes['Rooms'][room_name]['Top'],
                self.changes['Rooms'][room_name]['Left'],
                self.logic['Rooms'][room_name]['Rows'],
                self.logic['Rooms'][room_name]['Columns'],
            )
            code = codes[index]
            for row in range(top, top + rows):
                for col in range(left, left + cols):
                    # assert result[row][col] != ' '
                    prev_index = codes.find(result[row][col])
                    if index < prev_index:
                        result[row][col] = code
        for (segment, edge) in self.open_edges():
            (row, col) = self.to_cell(segment, edge)
            # assert result[row][col] == '.'
            result[row][col] = '+'
        for row in range(len(result)):
            print(''.join(result[row]))
        return result

    def fitness(self):
        result = (
            sum((
                len(self.unplaced_nodes['Top']),
                len(self.unplaced_nodes['Left']),
                len(self.unplaced_nodes['Bottom']),
                len(self.unplaced_nodes['Right']),
            )),
            len(self.open_edges()),
        )
        return result

if __name__ == '__main__':
    '''
    Usage
    python shufflealchemylab.py
    '''
    with open('build/logic.json') as open_file:
        logic = json.load(open_file)
        best_fit = None
        for i in range(1_000):
            seed = random.randint(0, 2 ** 64)
            room_randomizer = RoomRandomizer(logic, seed)
            room_randomizer.shuffle_rooms()
            if (
                best_fit is None or
                room_randomizer.fitness() < best_fit.fitness()
            ):
                best_fit = room_randomizer
            if best_fit.fitness() == (0, 0):
                break
            # print(i, best_fit.fitness(), seed)
        best_fit.show_spoiler()
        print(best_fit.initial_seed)
        print(best_fit.fitness())
        print(best_fit.unplaced_nodes)
        print(best_fit.open_edges())
        changes = best_fit.changes
        file_name = 'build/RoomChanges.yaml'
        with open(file_name, 'w') as open_file:
            yaml.dump(changes, open_file, default_flow_style=False)