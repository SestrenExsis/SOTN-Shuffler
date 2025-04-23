
def get_empty_room(room_height: int, room_width: int) -> list[str]:
    result = []
    for _ in range(16 * room_height):
        row_data = ' ' * 16 * room_width
        result.append(row_data)
    return result

def stamp(room, top, left, grid):
    rows = len(grid)
    cols = len(grid[0])
    for grid_row in range(rows):
        room_row = top + grid_row
        room[room_row] = room[room_row][:left] + grid[grid_row] + room[room_row][left + cols:]

stages = {
    'Underground Caverns': {
        'Underground Caverns, Crystal Bend',
        'Underground Caverns, DK Bridge',
        'Underground Caverns, Exit to Abandoned Mine',
        'Underground Caverns, Long Drop',
        'Underground Caverns, Tall Stairwell',
    },
}

rooms = {
    'Underground Caverns, Crystal Bend': [
        {
            'Layer': 'Foreground',
            'Source': [
                r'----..----------', # r'----..----------',
                r'###@..@#########', # r'###@..@#########',
                r'###@..@#########', # r'###@..@#########',
                r'##@r.=@#########', # r'##@r.=@#########',
                r'##@...7@@#######', # r'##@...7@@#######',
                r'##@.....7@@#####', # r'##@.....7@@#####',
                r'##@.......@#####', # r'##@.......@#####',
                r'##@==.....@#####', # r'##@==.....@#####',
                r'                ', # r'##@.......@#####',
                r'                ', # r'##@L.....J@#####',
                r'                ', # r'###@L....@######',
                r'                ', # r'####@=...@######',
                r'                ', # r'####@....@######',
                r'                ', # r'###@r....@######',
                r'                ', # r'###@.....@######',
                r'                ', # r'##@r....=@######',
                r'                ', # r'##@......7@#####',
                r'                ', # r'##@.......@#####',
                r'                ', # r'##@.......@#####',
                r'                ', # r'##@===....7@####',
                r'                ', # r'##@........7@###',
                r'                ', # r'##@L........7@@@',
                r'                ', # r'###@.........vvv',
                r'                ', # r'###@L...=.......',
                r'                ', # r'####@L..|.......',
                r'                ', # r'#####@@L^.o..o..',
                r'                ', # r'#######@@@@@@@@@',
                r'                ', # r'################',
                r'                ', # r'################',
                r'                ', # r'################',
                r'                ', # r'################',
                r'                ', # r'                ',
            ],
            'Target': [
                r'------....------',
                r'####@r....@#####',
                r'###@r.....@#####',
                r'##@r..====@#####',
                r'##@.......@#####',
                r'##@.......@#####',
                r'##@.......@#####',
                r'##@===....@#####',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
                r'                ',
            ],
        },
        {
            'Layer': 'Background',
            'Source': [
                r'                ', # r'----..----------',
                r'                ', # r'###@..@#########',
                r'                ', # r'###@..@#########',
                r'     =          ', # r'##@r.=@#########',
                r'                ', # r'##@...7@@#######',
                r'                ', # r'##@.....7@@#####',
                r'                ', # r'##@.......@#####',
                r'   ==           ', # r'##@==.....@#####',
                r'                ', # r'##@.......@#####',
                r'                ', # r'##@L.....J@#####',
                r'                ', # r'###@L....@######',
                r'     =          ', # r'####@=...@######',
                r'                ', # r'####@....@######',
                r'                ', # r'###@r....@######',
                r'                ', # r'###@.....@######',
                r'        =       ', # r'##@r....=@######',
                r'                ', # r'##@......7@#####',
                r'      0123      ', # r'##@.......@#####',
                r'      4567      ', # r'##@.......@#####',
                r'   ===89AB      ', # r'##@===....7@####',
                r'      CDEF      ', # r'##@........7@###',
                r'                ', # r'##@L........7@@@',
                r'                ', # r'###@.........vvv',
                r'                ', # r'###@L...=.......',
                r'                ', # r'####@L..|.......',
                r'                ', # r'#####@@L^.o..o..',
                r'                ', # r'#######@@@@@@@@@',
                r'                ', # r'################',
                r'                ', # r'################',
                r'                ', # r'################',
                r'                ', # r'################',
                r'                ', # r'                ',
            ],
            'Target': [
                r'                ', # r'------....------',
                r'    230123      ', # r'####@r....@#####',
                r'    674567      ', # r'###@r.....@#####',
                r'    AB====      ', # r'##@r..====@#####',
                r'    EFCDEF      ', # r'##@.......@#####',
                r'    230123      ', # r'##@.......@#####',
                r'                ', # r'##@.......@#####',
                r'   ===          ', # r'##@===....@#####',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
                r'                ', # r'                ',
            ],
        },
    ],
}

# Underground Caverns, DK Bridge
edits = []
source = get_empty_room(1, 4)
stamp(source, 14, 3 * 16 + 0, ['######@...@#####'])
stamp(source, 15, 3 * 16 + 0, ['-------...------'])
target = get_empty_room(1, 4)
stamp(target, 14, 3 * 16 + 0, ['#####@....@#####'])
stamp(target, 15, 3 * 16 + 0, ['------....------'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
edits.append(edit)
rooms['Underground Caverns, DK Bridge'] = edits

# Underground Caverns, Exit to Abandoned Mine
edits = []
source = get_empty_room(1, 1)
stamp(source, 0, 0, ['   ----.        '])
stamp(source, 1, 0, ['   ###@.        '])
stamp(source, 2, 0, ['   ###@.        '])
stamp(source, 3, 0, ['   ###@.        '])
stamp(source, 4, 0, ['   ###@=        '])
stamp(source, 5, 0, ['   @@@r.        '])
stamp(source, 6, 0, ['   www..        '])
target = get_empty_room(1, 1)
stamp(target, 0, 0, ['   ---..        '])
stamp(target, 1, 0, ['   ##@..        '])
stamp(target, 2, 0, ['   ##@..        '])
stamp(target, 3, 0, ['   ##@..        '])
stamp(target, 4, 0, ['   ##@==        '])
stamp(target, 5, 0, ['   @@r..        '])
stamp(target, 6, 0, ['   ww...        '])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
edits.append(edit)
rooms['Underground Caverns, Exit to Abandoned Mine'] = edits


# Underground Caverns, Hidden Crystal Entrance
# edits = []
# source = get_empty_room(3, 1)
# stamp(source, 14, 3 * 16 + 0, ['######@...@#####'])
# stamp(source, 15, 3 * 16 + 0, ['-------...------'])
# target = get_empty_room(3, 1)
# stamp(target, 14, 3 * 16 + 0, ['#####@....@#####'])
# stamp(target, 15, 3 * 16 + 0, ['------....------'])
# edit = {
#     'Layer': 'Foreground',
#     'Source': source,
#     'Target': target,
# }
# edits.append(edit)
# rooms['Underground Caverns, Hidden Crystal Entrance'] = edits

# Underground Caverns, Long Drop
edits = []
source = get_empty_room(11, 1)
stamp(source, 10 * 16 + 11, 0, ['###@L.......J@##'])
stamp(source, 10 * 16 + 12, 0, ['###@@.......@@##'])
stamp(source, 10 * 16 + 13, 0, ['###@@.......@@##'])
stamp(source, 10 * 16 + 14, 0, ['###@@.......@@##'])
stamp(source, 10 * 16 + 15, 0, ['-------..-------'])
target = get_empty_room(11, 1)
stamp(target, 10 * 16 + 12, 0, ['           J@#  '])
stamp(target, 10 * 16 + 13, 0, ['   #@L    J@##  '])
stamp(target, 10 * 16 + 14, 0, ['   #@@    @@##  '])
stamp(target, 10 * 16 + 15, 0, ['      ....      '])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
edits.append(edit)
rooms['Underground Caverns, Long Drop'] = edits

# Underground Caverns, Tall Stairwell
edits = []
source = get_empty_room(9, 1)
stamp(source, 8 * 16 + 12, 4, ['##.  .##'])
stamp(source, 8 * 16 + 13, 4, ['        '])
stamp(source, 8 * 16 + 14, 4, ['        '])
stamp(source, 8 * 16 + 15, 4, ['---..---'])
target = get_empty_room(9, 1)
stamp(target, 8 * 16 + 12, 4, ['        '])
stamp(target, 8 * 16 + 13, 4, ['##.  .##'])
stamp(target, 8 * 16 + 14, 4, ['##.  .##'])
stamp(target, 8 * 16 + 15, 4, ['--.  .--'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
edits.append(edit)
rooms['Underground Caverns, Tall Stairwell'] = edits

def normalize(room_name: str):
    edits = []
    if room_name in rooms:
        edits = rooms[room_name]
    result = edits
    return result

if __name__ == '__main__':
    '''
    Usage
    python normalizer.py
    '''
    pass