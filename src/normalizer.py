
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
    'Alchemy Laboratory': {
        'Alchemy Laboratory, Entryway',
        'Alchemy Laboratory, Glass Vats',
        'Alchemy Laboratory, Red Skeleton Lift Room',
        'Alchemy Laboratory, Secret Life Max-Up Room',
        'Alchemy Laboratory, Tall Zig Zag Room',
    },
    'Castle Entrance': {
        'Castle Entrance, Merman Room',
        'Castle Entrance, Attic Entrance',
        'Castle Entrance, Drop Under Portcullis',
        'Castle Entrance, After Drawbridge',
    },
    'Castle Entrance Revisited': {
        'Castle Entrance Revisited, Merman Room',
        'Castle Entrance Revisited, Attic Entrance',
        'Castle Entrance Revisited, Drop Under Portcullis',
        'Castle Entrance Revisited, After Drawbridge',
    },
    'Long Library': {
        'Long Library, Secret Bookcase Room',
        'Long Library, Holy Rod Room',
    },
    'Marble Gallery': {
        'Marble Gallery, Beneath Left Trapdoor',
        'Marble Gallery, Beneath Right Trapdoor',
        'Marble Gallery, Gravity Boots Room',
        'Marble Gallery, Slinger Staircase',
        'Marble Gallery, Stopwatch Room',
        'Marble Gallery, Three Paths',
    },
    "Olrox's Quarters": {
        "Olrox's Quarters, Catwalk Crypt",
        "Olrox's Quarters, Grand Staircase",
        "Olrox's Quarters, Open Courtyard",
        "Olrox's Quarters, Prison",
        "Olrox's Quarters, Sword Card Room",
        "Olrox's Quarters, Tall Shaft",
    },
    'Underground Caverns': {
        'Underground Caverns, Crystal Bend',
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
    ('Alchemy Laboratory, Entryway', 'Top Passage'): '######....######',
    ('Alchemy Laboratory, Glass Vats', 'Left-Bottom Passage'): '######....######',
    ('Alchemy Laboratory, Red Skeleton Lift Room', 'Bottom Passage'): '######....######',
    ('Alchemy Laboratory, Red Skeleton Lift Room', 'Top Passage'): '######....######',
    ('Alchemy Laboratory, Secret Life Max-Up Room', 'Top Passage'): '######....######',
    ('Alchemy Laboratory, Tall Zig Zag Room', 'Lower Passage'): '######....######',
    ('Castle Entrance, Merman Room', 'Top Passage'): '######....######',
    ('Castle Entrance, Attic Entrance', 'Bottom Passage'): '######....######',
    ('Castle Entrance, Drop Under Portcullis', 'Top Passage'): '######....######',
    ('Castle Entrance, After Drawbridge', 'Bottom Passage'): '######....######',
    ('Castle Entrance Revisited, Merman Room', 'Top Passage'): '######....######',
    ('Castle Entrance Revisited, Attic Entrance', 'Bottom Passage'): '######....######',
    ('Castle Entrance Revisited, Drop Under Portcullis', 'Top Passage'): '######....######',
    ('Castle Entrance Revisited, After Drawbridge', 'Bottom Passage'): '######....######',
    ('Long Library, Secret Bookcase Room', 'Right Passage'): '######....######',
    ('Long Library, Holy Rod Room', 'Left Passage'): '######....######',
    ('Marble Gallery, Beneath Left Trapdoor', 'Top Passage'): '######....######',
    ('Marble Gallery, Beneath Right Trapdoor', 'Top Passage'): '######....######',
    ('Marble Gallery, Gravity Boots Room', 'Bottom Passage'): '######....######',
    ('Marble Gallery, Slinger Staircase', 'Right-Bottom Passage'): '######....######',
    ('Marble Gallery, Stopwatch Room', 'Bottom Passage'): '######....######',
    ('Marble Gallery, Three Paths', 'Top Passage'): '######....######',
    ("Olrox's Quarters, Catwalk Crypt", 'Left-Top Passage'): '######....######',
    ("Olrox's Quarters, Open Courtyard", 'Top Passage'): '######....######',
    ("Olrox's Quarters, Prison", 'Left-Bottom Passage'): '######....######',
    ("Olrox's Quarters, Prison", 'Right-Bottom Passage'): '######....######',
    ("Olrox's Quarters, Sword Card Room", 'Left-Bottom Passage'): '######....######',
    ("Olrox's Quarters, Tall Shaft", 'Top Passage'): '######....######',
    ('Underground Caverns, Crystal Bend', 'Top Passage'): '######....######',
    ('Underground Caverns, DK Bridge', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Exit to Abandoned Mine', 'Top Passage'): '######....######',
    ('Underground Caverns, Exit to Castle Entrance', 'Bottom Passage'): '######....######',
    ('Underground Caverns, Hidden Crystal Entrance', 'Top Passage'): '######....######',
    ('Underground Caverns, Hidden Crystal Entrance', 'Bottom Passage'): '######....######',
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

room_name = "Olrox's Quarters, Grand Staircase"
rooms[room_name] = []
# Foreground and Background
source = get_empty_room(2, 3)
stamp(source, 1 * 16 +  6, 2 * 16 + 13, ['.@#'])
stamp(source, 1 * 16 +  7, 2 * 16 + 13, ['.@#'])
stamp(source, 1 * 16 +  8, 2 * 16 + 13, ['.@#'])
stamp(source, 1 * 16 +  9, 2 * 16 + 13, ['.@#'])
target = get_empty_room(2, 3)
stamp(target, 1 * 16 +  6, 2 * 16 + 13, ['.@.'])
stamp(target, 1 * 16 +  7, 2 * 16 + 13, ['.@.'])
stamp(target, 1 * 16 +  8, 2 * 16 + 13, ['.@.'])
stamp(target, 1 * 16 +  9, 2 * 16 + 13, ['.@.'])
edit = {
    'Layer': 'Foreground and Background',
    'Source': source,
    'Target': target,
}
rooms[room_name].append(edit)

other_stages = {
    # 'Abandoned Mine': ('Cave', True),
    'Alchemy Laboratory': ('Necromancy Laboratory', True),
    # 'Castle Entrance': ('Castle Entrance Revisited', False),
    # 'Castle Entrance Revisited': ('Reverse Entrance', True),
    # 'Castle Keep': ('Reverse Keep', True),
    # 'Catacombs': ('Floating Catacombs', True),
    # 'Clock Tower': ('Reverse Clock Tower', True),
    # 'Colosseum': ('Reverse Colosseum', True),
    # 'Long Library': ('Forbidden Library', True),
    # 'Marble Gallery': ('Black Marble Gallery', True),
    "Olrox's Quarters": ("Death Wing's Lair", True),
    # 'Outer Wall': ('Reverse Outer Wall', True),
    # 'Royal Chapel': ('Anti-Chapel', True),
    'Underground Caverns': ('Reverse Caverns', True),
}
for (stage_name, (alt_stage_name, flip_ind)) in other_stages.items():
    stages[alt_stage_name] = set()
    for room_name in stages[stage_name]:
        alt_room_name = room_name.replace(stage_name, alt_stage_name, 1)
        rooms[alt_room_name] = []
        for edit in rooms.get(room_name, []):
            source = list(edit['Source'])
            target = list(edit['Target'])
            if flip_ind:
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