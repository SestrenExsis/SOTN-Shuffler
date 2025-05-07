
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

# NOTE(sestren): Disable normalizing of Crystal Bend (Top Passage) for now, until Hidden Crystal Entrance (Bottom Passage) is also normalized
stages = {
    'Underground Caverns': {
        # 'Underground Caverns, Crystal Bend',
        'Underground Caverns, DK Bridge',
        'Underground Caverns, Exit to Abandoned Mine',
        'Underground Caverns, Exit to Castle Entrance',
        'Underground Caverns, Hidden Crystal Entrance',
        'Underground Caverns, Ice Floe Room',
        'Underground Caverns, Left Ferryman Route',
        'Underground Caverns, Long Drop',
        'Underground Caverns, Plaque Room With Life Max-Up',
        'Underground Caverns, Room ID 09',
        'Underground Caverns, Room ID 10',
        'Underground Caverns, Small Stairwell',
        'Underground Caverns, Tall Stairwell',
    },
}
nodes = {
    # ('Underground Caverns, Crystal Bend', 'Top Passage'): '######....######',
    ('Underground Caverns, DK Bridge', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Exit to Abandoned Mine', 'Top Passage'): '######....######',
    ('Underground Caverns, Exit to Castle Entrance', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Hidden Crystal Entrance', 'Top Passage'): '######....######',
    ('Underground Caverns, Ice Floe Room', 'Top Passage'): '######....######',
    ('Underground Caverns, Left Ferryman Route', 'Top Passage'): '######....######',
    ('Underground Caverns, Long Drop', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Plaque Room With Life Max-Up', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Room ID 09', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Room ID 10', 'Top Passage'): '######....######',
    ('Underground Caverns, Small Stairwell', 'Top Passage'): '######....######',
    ('Underground Caverns, Tall Stairwell', 'Bottom Passage'): '######....######',
}

rooms = {}
room_name = 'Underground Caverns, Crystal Bend'
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

room_name = 'Underground Caverns, Exit to Castle Entrance'
rooms[room_name] = []
# Foreground
source = get_empty_room(1, 2)
stamp(source, 12, 17, ['.......J @'])
stamp(source, 13, 17, ['@OL....@##'])
stamp(source, 14, 17, ['##@=...@##'])
stamp(source, 15, 17, ['---....---'])
target = get_empty_room(1, 2)
stamp(target, 12, 17, ['       .. '])
stamp(target, 13, 17, ['@@@OL ...@'])
stamp(target, 14, 17, ['####@....@'])
stamp(target, 15, 17, ['-----....-'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)
# Background
source = get_empty_room(1, 2)
stamp(source, 12, 18, ['......J@@'])
stamp(source, 13, 18, ['@L....@##'])
stamp(source, 14, 18, ['#@=...@##'])
stamp(source, 15, 18, ['--....---'])
target = get_empty_room(1, 2)
stamp(target, 12, 18, ['      .. '])
stamp(target, 13, 18, ['@@@L ...@'])
stamp(target, 14, 18, ['###@....@'])
stamp(target, 15, 18, ['----....-'])
edit = {
    'Layer': 'Background',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Hidden Crystal Entrance'
rooms[room_name] = []
source = get_empty_room(3, 1)
stamp(source,  0, 0, ['-----.......----'])
stamp(source,  1, 0, ['####@.......@###'])
stamp(source,  2, 0, ['####@.......@###'])
stamp(source,  3, 0, ['####@.......@###'])
stamp(source,  4, 0, ['###@r.......@###'])
stamp(source,  5, 0, ['@@@r........7@@@'])
# TODO(sestren): Fix the bottom passageway using the breakable floor entity in addition to using direct tilemap editing
# stamp(source, 2 * 16 + 13, 0, ['      @@@@      '])
# stamp(source, 2 * 16 + 14, 0, ['      @###      '])
# stamp(source, 2 * 16 + 15, 0, ['    ..----      '])
target = get_empty_room(3, 1)
stamp(target,  0, 0, ['------....------'])
stamp(target,  1, 0, ['#####@....@#####'])
stamp(target,  2, 0, ['#####@....@#####'])
stamp(target,  3, 0, ['####@r....7@####'])
stamp(target,  4, 0, ['###@r......7@###'])
stamp(target,  5, 0, ['@@@r........7@@@'])
# TODO(sestren): Fix the bottom passageway using the breakable floor entity in addition to using direct tilemap editing
# stamp(source, 2 * 16 + 13, 0, ['      ....      '])
# stamp(source, 2 * 16 + 14, 0, ['      ....      '])
# stamp(target, 2 * 16 + 15, 0, ['    --....      '])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Ice Floe Room'
rooms[room_name] = []
source = get_empty_room(2, 9)
stamp(source, 0, 8 * 16 + 6, ['-..-'])
stamp(source, 1, 8 * 16 + 6, ['@..@'])
target = get_empty_room(2, 9)
stamp(target, 0, 8 * 16 + 6, ['....'])
stamp(target, 1, 8 * 16 + 6, ['....'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Left Ferryman Route'
rooms[room_name] = []
source = get_empty_room(2, 13)
stamp(source, 0, 8 * 16, ['----....----'])
stamp(source, 1, 8 * 16, ['###@....@###'])
stamp(source, 2, 8 * 16, ['@@@@...=@@@@'])
stamp(source, 3, 8 * 16, ['****....****'])
target = get_empty_room(2, 13)
stamp(target, 0, 8 * 16, ['------....--'])
stamp(target, 1, 8 * 16, ['#####@....@#'])
stamp(target, 2, 8 * 16, ['@@@@@@...=@@'])
stamp(target, 3, 8 * 16, ['******....**'])
edit = {
    'Layer': 'Foreground and Background',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Long Drop'
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
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Room ID 09'
rooms[room_name] = []
source = get_empty_room(1, 2)
stamp(source, 10, 6, ['....    '])
stamp(source, 11, 6, ['        '])
stamp(source, 12, 6, ['        '])
stamp(source, 13, 6, ['@@@    @'])
stamp(source, 14, 6, ['###    #'])
stamp(source, 15, 6, ['---    -'])
target = get_empty_room(1, 2)
stamp(target, 11, 6, ['....    '])
stamp(target, 12, 6, ['....    '])
stamp(target, 13, 6, ['....@@@@'])
stamp(target, 14, 6, ['....####'])
stamp(target, 15, 6, ['....----'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Room ID 10'
rooms[room_name] = []
source = get_empty_room(1, 1)
stamp(source, 0, 6, ['---....'])
stamp(source, 1, 6, ['@@@....'])
target = get_empty_room(1, 1)
stamp(target, 0, 6, ['....---'])
stamp(target, 1, 6, ['....@@@'])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Small Stairwell'
# NOTE(sestren): This room's background layer might be shared with another room? Can't seem to update it
rooms[room_name] = []
source = get_empty_room(2, 1)
stamp(source, 0, 0, ['     -----...-  '])
stamp(source, 1, 0, ['     ####@...@  '])
stamp(source, 2, 0, ['                '])
target = get_empty_room(2, 1)
stamp(target, 0, 0, ['     -....----  '])
stamp(target, 1, 0, ['     @....@###  '])
stamp(target, 2, 0, ['     @@         '])
edit = {
    'Layer': 'Foreground',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

room_name = 'Underground Caverns, Tall Stairwell'
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
for (stage_name, (alt_stage_name, flip_ind)) in other_stages.items():
    stages[alt_stage_name] = set()
    for room_name in stages[stage_name]:
        alt_room_name = room_name.replace(stage_name, alt_stage_name, 1)
        rooms[alt_room_name] = []
        for edit in rooms[room_name]:
            source = list(reversed(edit['Source']))
            for row in range(len(source)):
                source[row] = source[row][::-1]
            target = list(reversed(edit['Target']))
            for row in range(len(target)):
                target[row] = target[row][::-1]
            alt_edit = {
                'Layer': edit['Layer'],
                'Source': source,
                'Target': target,
            }
            rooms[alt_room_name].append(alt_edit)
        stages[alt_stage_name].add(alt_room_name)

def normalize_room_tilemap(room_name: str):
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
    for stage_name in stages:
        if stage_name != 'Reverse Caverns':
            continue
        print('', stage_name)
        for room_name in stages[stage_name]:
            print('  ', room_name)
            for edit in normalize_room_tilemap(room_name):
                print(edit['Layer'])
                for layer in (
                    'Source',
                    'Target',
                ):
                    print('  ', layer)
                    for row_data in edit[layer]:
                        print('    ', '[' + row_data + ']')