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
        self.remaining_cells = self.get_empty_cells()

    def get_empty_cells(self):
        result = set()
        top = 23
        left = 0
        for row in range(len(self.stage_cells)):
            for col in range(len(self.stage_cells[row])):
                if self.stage_cells[row][col] == ' ':
                    continue
                result.add((top + row, left + col))
        return result
    
    def get_segment(self, row, col, edge) -> tuple[int]:
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
    
    def shuffle_rooms(self) -> dict:
        def F(room_name):
            for (node_name, node) in self.logic[room_name]['Node Sections'].items():
                row = self.changes[room_name]['Top'] + node['Row']
                col = self.changes[room_name]['Left'] + node['Column']
                segment = self.get_segment(row, col, node['Edge'])
                segments[segment].add(node['Edge'])
                unplaced_nodes[node['Edge']].remove((room_name, node_name))
        self.remaining_cells = self.get_empty_cells()
        self.changes = {}
        unplaced_nodes = {
            'Left': set(),
            'Top': set(),
            'Right': set(),
            'Bottom': set(),
        }
        for (room_name, room) in self.logic.items():
            for (node_name, node) in room['Node Sections'].items():
                unplaced_nodes[node['Edge']].add((room_name, node_name))
        segments = collections.defaultdict(set)
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
            self.changes[room_name] = {}
            self.changes[room_name]['Index'] = self.logic[room_name]['Index']
            self.changes[room_name]['Top'] = self.logic[room_name]['Top']
            self.changes[room_name]['Left'] = self.logic[room_name]['Left']
            F(room_name)
        # Hard-code possible red door placements for now
        if random.random() < 0.5:
            room_name = 'Alchemy Laboratory, Exit to Marble Gallery'
            self.changes[room_name] = {}
            self.changes[room_name]['Index'] = self.logic[room_name]['Index']
            self.changes[room_name]['Top'] = self.logic[room_name]['Top']
            self.changes[room_name]['Left'] = self.logic[room_name]['Left']
            F(room_name)
            room_name = 'Alchemy Laboratory, Entryway'
            self.changes[room_name] = {}
            self.changes[room_name]['Index'] = self.logic[room_name]['Index']
            self.changes[room_name]['Top'] = self.logic[room_name]['Top']
            self.changes[room_name]['Left'] = self.logic[room_name]['Left']
            F(room_name)
        else:
            room_name = 'Alchemy Laboratory, Exit to Marble Gallery'
            self.changes[room_name] = {}
            self.changes[room_name]['Index'] = self.logic[room_name]['Index']
            self.changes[room_name]['Top'] = 35
            self.changes[room_name]['Left'] = 15
            F(room_name)
            room_name = 'Alchemy Laboratory, Entryway'
            self.changes[room_name] = {}
            self.changes[room_name]['Index'] = self.logic[room_name]['Index']
            self.changes[room_name]['Top'] = 26
            self.changes[room_name]['Left'] = 18
            F(room_name)
        # Check all placed nodes for openness
        
        # Choose random open node A
        # Choose random unplaced node B that complements A
        # Place all nodes from B's room, relative to where B was placed

        # Always place Bat Card Room inside Tetromino Room for now
        # room_name = 'Alchemy Laboratory, Bat Card Room'
        # result[room_name] = {}
        # result[room_name]['Index'] = self.logic[room_name]['Index']
        # result[room_name]['Top'] = self.logic['Alchemy Laboratory, Tetromino Room']['Top'] + 1
        # result[room_name]['Left'] = self.logic['Alchemy Laboratory, Tetromino Room']['Left']
        result = segments
        return result
    
    def show_spoiler(self, open_segments):
        codes = '0123456789abcdefghijklmnopqrstuv+. '
        result = [[' ' for col in range(64)] for row in range(64)]
        for (row, col) in self.get_empty_cells():
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
                    assert result[row][col] != ' '
                    prev_index = codes.find(result[row][col])
                    if index < prev_index:
                        result[row][col] = code
        for (segment, edge) in open_segments:
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
            assert result[row][col] == '.'
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
        segments = room_randomizer.shuffle_rooms()
        room_randomizer.show_spoiler(
            set((segment, list(edges)[0]) for (segment, edges) in segments.items() if
            len(edges) == 1)
        )
    file_name = 'build/AlchemyLabChanges.yaml'
    with open(file_name, 'w') as open_file:
        yaml.dump(changes, open_file, default_flow_style=False)