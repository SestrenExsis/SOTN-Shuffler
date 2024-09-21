import collections
import json
import random
import roomrando
import yaml

'''
- A dummy copy of NZ0-00 is visible from NZ0-13
- Initially, NZ0-00 and NZ0-13 should be moved around as one unit
- Once the ability to alter tilemaps becomes possible, that can be revisited
'''

class RoomRandomizer:
    stage_cells = [
        '..        ....             ',
        '..        ...              ',
        '..        .................',
        '..        .............    ',
        '..      ...................',
        '.. ......................  ',
        '.........................  ',
        '.........................  ',
        '.........................  ',
        '.........................  ',
        '...........................',
        '.....................      ',
        '.....................      ',
        '...................        ',
        '.................          ',
        '..  .  .........           ',
        '..  .       .......        ',
    ]
    def __init__(self, logic):
        self.logic = logic
        self.changes = {}
        self.empty_cells = set()
        self.segments = collections.defaultdict(set)
        self.unplaced_nodes = {
            'Left': set(),
            'Top': set(),
            'Right': set(),
            'Bottom': set(),
        }
        self.reset()

    def reset(self):
        self.empty_cells = set()
        TOP = 23
        LEFT = 0
        for row in range(len(self.stage_cells)):
            for col in range(len(self.stage_cells[row])):
                if self.stage_cells[row][col] == ' ':
                    continue
                self.empty_cells.add((TOP + row, LEFT + col))
        self.changes = {}
        self.unplaced_nodes = {
            'Left': set(),
            'Top': set(),
            'Right': set(),
            'Bottom': set(),
        }
        for (room_name, room) in self.logic.items():
            # Bat Card Room will be placed manually at a later step
            if room_name == 'Alchemy Laboratory, Bat Card Room':
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

    def place_room(self, room_name, top, left):
        self.changes[room_name] = {}
        # Room indexes are left at default values for now
        self.changes[room_name]['Index'] = self.logic[room_name]['Index']
        self.changes[room_name]['Top'] = top
        self.changes[room_name]['Left'] = left
        for (node_name, node) in self.logic[room_name]['Node Sections'].items():
            row = self.changes[room_name]['Top'] + node['Row']
            col = self.changes[room_name]['Left'] + node['Column']
            segment = self.to_segment(row, col, node['Edge'])
            self.segments[segment].add(node['Edge'])
            self.unplaced_nodes[node['Edge']].remove((room_name, node_name))
        for row in range(self.logic[room_name]['Rows']):
            for col in range(self.logic[room_name]['Columns']):
                cell = (
                    self.changes[room_name]['Top'] + row,
                    self.changes[room_name]['Left'] + col,
                )
                if cell in self.empty_cells:
                    self.empty_cells.remove(cell)
    
    def possible_matching_nodes(self, segment, edge):
        # (top, left, bottom, right) = segment
        matching_edge = self.to_matching_edge(edge)
        (target_row, target_col) = self.to_cell(segment, edge)
        open_edges = self.open_edges()
        result = []
        for (room_name, node_name) in self.unplaced_nodes[matching_edge]:
            legal_ind = True
            # All cells of where the room will be placed must be empty
            node_row = self.logic[room_name]['Node Sections'][node_name]['Row']
            node_col = self.logic[room_name]['Node Sections'][node_name]['Column']
            room_top = target_row - node_row
            room_left = target_col - node_col
            for row in range(self.logic[room_name]['Rows']):
                for col in range(self.logic[room_name]['Columns']):
                    if (room_top + row, room_left + col) not in self.empty_cells:
                        legal_ind = False
            # TODO(sestren): All nodes of the room must connect or remain open
            if legal_ind:
                result.append((room_name, node_name))
        return result

    def shuffle_rooms(self) -> dict:
        self.reset()
        # The location of these rooms do not change for now
        for room_name in (
            'Alchemy Laboratory, Fake Castle Entrance Room',
            'Alchemy Laboratory, Fake Marble Gallery Room',
            'Alchemy Laboratory, Fake Royal Chapel Room',
            'Alchemy Laboratory, Loading Room A',
            'Alchemy Laboratory, Loading Room B',
            'Alchemy Laboratory, Loading Room C',
            'Alchemy Laboratory, Exit to Holy Chapel',
        ):
            self.place_room(
                room_name,
                self.logic[room_name]['Top'],
                self.logic[room_name]['Left']
            )
        # Hard-code placing the other two red door rooms randomly
        if random.random() < 0.5:
            room_name = 'Alchemy Laboratory, Exit to Marble Gallery'
            self.place_room(
                room_name,
                self.logic[room_name]['Top'],
                self.logic[room_name]['Left']
            )
            room_name = 'Alchemy Laboratory, Entryway'
            self.place_room(
                room_name,
                self.logic[room_name]['Top'],
                self.logic[room_name]['Left']
            )
        else:
            room_name = 'Alchemy Laboratory, Exit to Marble Gallery'
            self.place_room(room_name, 35, 15)
            room_name = 'Alchemy Laboratory, Entryway'
            self.place_room(room_name, 26, 18)
        while len(self.unplaced_nodes) > 0:
            # Check all placed nodes for openness
            open_edges = self.open_edges()
            # Choose random open node A
            (segment, edge) = random.choice(tuple(open_edges))
            nodes = self.possible_matching_nodes(segment, edge)
            if len(nodes) < 1:
                # Halt if you can't find a matching node
                break
            # Choose random unplaced legal node B that complements A
            (room_name, node_name) = random.choice(nodes)
            # Place all nodes from B's room, relative to where B was placed
            node_row = self.logic[room_name]['Node Sections'][node_name]['Row']
            node_col = self.logic[room_name]['Node Sections'][node_name]['Column']
            (target_row, target_col) = self.to_cell(segment, edge)
            room_top = target_row - node_row
            room_left = target_col - node_col
            self.place_room(room_name, room_top, room_left)
            # break
        # Always place Bat Card Room inside Tetromino Room for now
        room_name = 'Alchemy Laboratory, Bat Card Room'
        room = self.logic[room_name]
        for (node_name, node) in room['Node Sections'].items():
            self.unplaced_nodes[node['Edge']].add((room_name, node_name))
        self.place_room(
            room_name,
            self.logic['Alchemy Laboratory, Tetromino Room']['Top'] + 1,
            self.logic['Alchemy Laboratory, Tetromino Room']['Left']
        )
    
    def show_spoiler(self):
        codes = '0123456789abcdefghijklmnopqrstuv+. '
        result = [[' ' for col in range(64)] for row in range(64)]
        for (row, col) in self.empty_cells:
            result[row][col] = '.'
        for room_name in self.changes.keys():
            (index, top, left, rows, cols) = (
                self.changes[room_name]['Index'],
                self.changes[room_name]['Top'],
                self.changes[room_name]['Left'],
                self.logic[room_name]['Rows'],
                self.logic[room_name]['Columns'],
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

if __name__ == '__main__':
    '''
    Usage
    python shufflealchemylab.py
    '''
    changes = {}
    with open('build/logic.json') as open_file:
        logic = json.load(open_file)
        room_randomizer = RoomRandomizer(logic)
        room_randomizer.shuffle_rooms()
        room_randomizer.show_spoiler()
    file_name = 'build/AlchemyLabChanges.yaml'
    with open(file_name, 'w') as open_file:
        yaml.dump(changes, open_file, default_flow_style=False)