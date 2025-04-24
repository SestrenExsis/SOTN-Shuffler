
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
    'Underground Caverns': set(),
}
rooms = {}

room_name = 'Underground Caverns, Crystal Bend'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
# Foreground
source = get_empty_room(2, 1)
stamp(source, 0, 0, ['----..----------'])
stamp(source, 1, 0, ['###@..@#########'])
stamp(source, 2, 0, ['###@..@#########'])
stamp(source, 3, 0, ['##@r.=@#########'])
stamp(source, 4, 0, ['##@...7@@#######'])
stamp(source, 5, 0, ['##@.....7@@#####'])
stamp(source, 6, 0, ['##@.......@#####'])
stamp(source, 7, 0, ['##@==.....@#####'])
target = get_empty_room(2, 1)
stamp(target, 0, 0, ['------....------'])
stamp(target, 1, 0, ['####@r....@#####'])
stamp(target, 2, 0, ['###@r.....@#####'])
stamp(target, 3, 0, ['##@r..====@#####'])
stamp(target, 4, 0, ['##@.......@#####'])
stamp(target, 5, 0, ['##@.......@#####'])
stamp(target, 6, 0, ['##@.......@#####'])
stamp(target, 7, 0, ['##@===....@#####'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)
# Background
source = get_empty_room(2, 1)
stamp(source, 17, 0, ['      0123      '])
stamp(source, 18, 0, ['      4567      '])
stamp(source, 19, 0, ['   ===89AB      '])
stamp(source, 20, 0, ['      CDEF      '])
target = get_empty_room(2, 1)
stamp(target, 0, 0, ['                '])
stamp(target, 1, 0, ['    230123      '])
stamp(target, 2, 0, ['    674567      '])
stamp(target, 3, 0, ['    AB====      '])
stamp(target, 4, 0, ['    EFCDEF      '])
stamp(target, 5, 0, ['    230123      '])
stamp(target, 6, 0, ['                '])
stamp(target, 7, 0, ['   ===          '])
edit = {
    'Layer': 'Background',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, DK Bridge'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
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
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Exit to Abandoned Mine'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
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
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Hidden Crystal Entrance'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
source = get_empty_room(3, 1)
stamp(source,  0, 0, ['-----.......----'])
stamp(source,  1, 0, ['####@.......@###'])
stamp(source,  2, 0, ['####@.......@###'])
stamp(source,  3, 0, ['####@.......@###'])
stamp(source,  4, 0, ['###@r.......@###'])
stamp(source,  5, 0, ['@@@r........7@@@'])
target = get_empty_room(3, 1)
stamp(target, 0, 0, ['------....------'])
stamp(target, 1, 0, ['#####@....@#####'])
stamp(target, 2, 0, ['#####@....@#####'])
stamp(target, 3, 0, ['####@r....7@####'])
stamp(target, 4, 0, ['###@r......7@###'])
stamp(target, 5, 0, ['@@@r........7@@@'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Long Drop'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
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
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Plaque Room With Life Max-Up'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
source = get_empty_room(1, 1)
stamp(source, 11, 0, ['@@@@@L.......@@@'])
stamp(source, 12, 0, ['##@.7#L......@##'])
stamp(source, 13, 0, ['##@..7#L.....@##'])
stamp(source, 14, 0, ['@@@@@@@@@@...@@@'])
stamp(source, 15, 0, ['----------...---'])
target = get_empty_room(1, 1)
stamp(target, 11, 0, ['                '])
stamp(target, 12, 0, ['      ....      '])
stamp(target, 13, 0, ['      ....      '])
stamp(target, 14, 0, ['      ....@@@@  '])
stamp(target, 15, 0, ['      ....----  '])
edit = {
    'Layer': 'Foreground and Background',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Small Stairwell'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
source = get_empty_room(2, 1)
stamp(source, 0, 0, ['----------...---'])
stamp(source, 1, 0, ['#########@...@##'])
target = get_empty_room(2, 1)
stamp(target, 0, 0, ['------....------'])
stamp(target, 1, 0, ['#####@....@#####'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Tall Stairwell'
stages['Underground Caverns'].add(room_name)
rooms[room_name] = []
source = get_empty_room(9, 1)
stamp(source, 8 * 16 + 10, 3, ['@L.++++...'])
stamp(source, 8 * 16 + 11, 3, ['#@L,,,,J@@'])
stamp(source, 8 * 16 + 12, 3, ['##@,,,,@##'])
stamp(source, 8 * 16 + 13, 3, ['##@L,,J@##'])
stamp(source, 8 * 16 + 14, 3, ['###@,,@###'])
stamp(source, 8 * 16 + 15, 3, ['----..----'])
target = get_empty_room(9, 1)
stamp(target, 8 * 16 + 10, 3, ['L..    ...'])
stamp(target, 8 * 16 + 11, 3, ['@L,    ,J@'])
stamp(target, 8 * 16 + 12, 3, ['#@,    ,@#'])
stamp(target, 8 * 16 + 13, 3, ['#@L,  ,J@#'])
stamp(target, 8 * 16 + 14, 3, ['##@,  ,@##'])
stamp(target, 8 * 16 + 15, 3, ['---.  .---'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

other_stages = {
    # 'Abandoned Mine': ('Cave', True),
    # 'Alchemy Laboratory': ('Necromancy Laboratory', True),
    # 'Castle Entrance': ('Castle Entrance Revisited', False),
    # 'Castle Entrance Revisited': ('Reverse Entrance', True),
    # 'Castle Keep': ('Reverse Keep', True),
    # 'Catacombs': ('Floating Catacombs', True),
    # 'Clock Tower': ('Reverse Clock Tower', True),
    # 'Colosseum': ('Reverse Colosseum', True),
    # 'Long Library': ('Forbidden Library', True),
    # 'Marble Gallery': ('Black Marble Gallery', True),
    # "Olrox's Quarters": ("Death Wing's Lair", True),
    # 'Outer Wall': ('Reverse Outer Wall', True),
    # 'Royal Chapel': ('Anti-Chapel', True),
    'Underground Caverns': ('Reverse Caverns', True),
}
for (stage_name, (other_stage_name, flip_ind)) in other_stages.items():
    for room_name in stages[stage_name]:
        other_room_name = room_name.replace(stage_name, other_stage_name, 1)
        rooms[room_name]

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