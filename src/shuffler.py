# External libraries
import argparse
import datetime
import hashlib
import json
import os
import random
import yaml

# Local libraries
import mapper
import validator

def get_room_drawing(mapper_core, room_name) -> list[str]:
    room = mapper_core['Rooms'][room_name]
    char = '1'
    if room_name.startswith('Warp Room '):
        char = '5'
    elif 'Save Room' in room_name:
        char = '4'
    elif 'Loading Room' in room_name:
        char = 'd'
    elif 'FAKE ROOM WITH TELEPORTER' in room_name.upper():
        char = ' '
    grid = [[' ' for col in range(1 + 4 * room['Columns'])] for row in range(1 + 4 * room['Rows'])]
    for row in range(room['Rows']):
        row_span = 4 if row < (room['Rows'] - 1) else 3
        for col in range(room['Columns']):
            if (row, col) in room['Empty Cells']:
                continue
            col_span = 4 if col < (room['Columns'] - 1) else 3
            for r in range(row_span):
                for c in range(col_span):
                    grid[1 + 4 * row + r][1 + 4 * col + c] = char
    for node in room['Nodes'].values():
        row = 2 + 4 * node['Row']
        col = 2 + 4 * node['Column']
        if node['Edge'] == 'Top':
            row -= 2
        elif node['Edge'] == 'Left':
            col -= 2
        elif node['Edge'] == 'Bottom':
            row += 2
        elif node['Edge'] == 'Right':
            col += 2
        grid[row][col] = '1'
    result = []
    for row in range(len(grid)):
        result.append(''.join(grid[row]))
    return result

rules = {}
skills = {
    "Technique - Pixel-Perfect Diagonal Gravity Jump Through Narrow Gap": True,
}

# NOTE(sestren): There is only one boss teleporter in the game data for the following bosses,
# NOTE(sestren): despite there being multiple entrances, so not all entrances will be covered:
# NOTE(sestren): Granfaloon, Akmodan II, Olrox, Galamoth
boss_teleporters = {
    '0': ('Marble Gallery', 'Marble Gallery, Clock Room', 0, 0), # Cutscene - Meeting Maria in Clock Room
    '3': ('Olrox\'s Quarters', 'Olrox\'s Quarters, Olrox\'s Room', 0, 1), # Boss - Olrox
    '4': ('Catacombs', 'Catacombs, Granfaloon\'s Lair', 0, 1), # Boss - Granfaloon
    '5': ('Colosseum', 'Colosseum, Arena', 0, 0), # Boss - Minotaur and Werewolf
    '6': ('Colosseum', 'Colosseum, Arena', 0, 1), # Boss - Minotaur and Werewolf
    '7': ('Underground Caverns', 'Underground Caverns, Scylla Wyrm Room', 0, 0), # Boss - Scylla
    '8': ('Outer Wall', 'Outer Wall, Doppelganger Room', 0, 0), # Boss - Doppelganger 10
    '9': ('Outer Wall', 'Outer Wall, Doppelganger Room', 0, 1), # Boss - Doppelganger 10
    '10': ('Royal Chapel', 'Royal Chapel, Hippogryph Room', 0, 0), # Boss - Hippogryph
    '11': ('Royal Chapel', 'Royal Chapel, Hippogryph Room', 0, 1), # Boss - Hippogryph
    '12': ('Castle Keep', 'Castle Keep, Keep Area', 3, 3), # Boss - Richter
    '13': ('Abandoned Mine', 'Abandoned Mine, Cerberus Room', 0, 0), # Boss - Cerberus
    '14': ('Abandoned Mine', 'Abandoned Mine, Cerberus Room', 0, 1), # Boss - Cerberus
    '15': ('Reverse Colosseum', 'Reverse Colosseum, Arena', 0, 0), # Boss - Trio
    '16': ('Reverse Colosseum', 'Reverse Colosseum, Arena', 0, 1), # Boss - Trio
    '17': ('Necromancy Laboratory', 'Necromancy Laboratory, Slogra and Gaibon Room', 0, 0), # Boss - Beelzebub
    '18': ('Necromancy Laboratory', 'Necromancy Laboratory, Slogra and Gaibon Room', 1, 3), # Boss - Beelzebub
    '19': ('Cave', 'Cave, Cerberus Room', 0, 1), # Boss - Death
    '20': ('Cave', 'Cave, Cerberus Room', 0, 0), # Boss - Death
    '21': ('Anti-Chapel', 'Anti-Chapel, Hippogryph Room', 0, 1), # Boss - Medusa
    '22': ('Anti-Chapel', 'Anti-Chapel, Hippogryph Room', 0, 0), # Boss - Medusa
    '23': ('Reverse Outer Wall', 'Reverse Outer Wall, Doppelganger Room', 0, 1), # Boss - Creature
    '24': ('Reverse Outer Wall', 'Reverse Outer Wall, Doppelganger Room', 0, 0), # Boss - Creature
    '25': ('Reverse Caverns', 'Reverse Caverns, Scylla Wyrm Room', 0, 0), # Boss - Doppelganger 40
    '26': ('Death Wing\'s Lair', 'Death Wing\'s Lair, Olrox\'s Room', 1, 0), # Boss - Akmodan II
    '27': ('Floating Catacombs', 'Floating Catacombs, Granfaloon\'s Lair', 1, 0), # Boss - Galamoth
}

boss_stage_rooms = [
    { # Boss - Cerberus
        'Source Stage': 'Abandoned Mine',
        'Source Room': 'Abandoned Mine, Cerberus Room',
        'Target Stage': 'Boss - Cerberus',
        'Target Rooms': {
            'Boss - Cerberus, Cerberus Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Cerberus, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Cerberus, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Medusa
        'Source Stage': 'Anti-Chapel',
        'Source Room': 'Anti-Chapel, Hippogryph Room',
        'Target Stage': 'Boss - Medusa',
        'Target Rooms': {
            'Boss - Medusa, Hippogryph Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Medusa, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Medusa, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Richter
        'Source Stage': 'Castle Keep',
        'Source Room': 'Castle Keep, Keep Area',
        'Target Stage': 'Boss - Richter',
        'Target Rooms': {
            'Boss - Richter, Throne Room': {
                'Top': 3,
                'Left': 3,
            },
        },
    },
    { # Boss - Granfaloon
        'Source Stage': 'Catacombs',
        'Source Room': 'Catacombs, Granfaloon\'s Lair',
        'Target Stage': 'Boss - Granfaloon',
        'Target Rooms': {
            'Boss - Granfaloon, Granfaloon\'s Lair': {
                'Top': 0,
                'Left': 0
            },
            'Boss - Granfaloon, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': 2,
            },
            'Boss - Granfaloon, Fake Room With Teleporter B': {
                'Top': 1,
                'Left': -1,
            },
        },
    },
    { # Boss - Death
        'Source Stage': 'Cave',
        'Source Room': 'Cave, Cerberus Room',
        'Target Stage': 'Boss - Death',
        'Target Rooms': {
            'Boss - Death, Cerberus Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Death, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Death, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Minotaur and Werewolf
        'Source Stage': 'Colosseum',
        'Source Room': 'Colosseum, Arena',
        'Target Stage': 'Boss - Minotaur and Werewolf',
        'Target Rooms': {
            'Boss - Minotaur and Werewolf, Arena': {
                'Top': 0,
                'Left': 0
            },
            'Boss - Minotaur and Werewolf, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Minotaur and Werewolf, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Akmodan II
        'Source Stage': 'Death Wing\'s Lair',
        'Source Room': 'Death Wing\'s Lair, Olrox\'s Room',
        'Target Stage': 'Boss - Akmodan II',
        'Target Rooms': {
            'Boss - Akmodan II, Olrox\'s Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Akmodan II, Fake Room With Teleporter A': {
                'Top': 1,
                'Left': -1,
            },
            'Boss - Akmodan II, Fake Room With Teleporter B': {
                'Top': 1,
                'Left': 2,
            },
        },
    },
    { # Boss - Galamoth
        'Source Stage': 'Floating Catacombs',
        'Source Room': 'Floating Catacombs, Granfaloon\'s Lair',
        'Target Stage': 'Boss - Galamoth',
        'Target Rooms': {
            'Boss - Galamoth, Granfaloon\'s Lair': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Galamoth, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': 2,
            },
            'Boss - Galamoth, Fake Room With Teleporter B': {
                'Top': 1,
                'Left': -1,
            },
        },
    },
    { # Cutscene - Meeting Maria in Clock Room
        'Source Stage': 'Marble Gallery',
        'Source Room': 'Marble Gallery, Clock Room',
        'Target Stage': 'Cutscene - Meeting Maria in Clock Room',
        'Target Rooms': {
            'Cutscene - Meeting Maria in Clock Room, Clock Room': {
                'Top': 0,
                'Left': 0
            },
            'Cutscene - Meeting Maria in Clock Room, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Cutscene - Meeting Maria in Clock Room, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 1,
            },
        },
    },
    { # Boss - Beelzebub
        'Source Stage': 'Necromancy Laboratory',
        'Source Room': 'Necromancy Laboratory, Slogra and Gaibon Room',
        'Target Stage': 'Boss - Beelzebub',
        'Target Rooms': {
            'Boss - Beelzebub, Slogra and Gaibon Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Beelzebub, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Beelzebub, Fake Room With Teleporter B': {
                'Top': 1,
                'Left': -1,
            },
            'Boss - Beelzebub, Fake Room With Teleporter C': {
                'Top': 1,
                'Left': 4,
            },
        },
    },
    { # Boss - Olrox
        'Source Stage': 'Olrox\'s Quarters',
        'Source Room': 'Olrox\'s Quarters, Olrox\'s Room',
        'Target Stage': 'Boss - Olrox',
        'Target Rooms': {
            'Boss - Olrox, Olrox\'s Room': {
                'Top': 0,
                'Left': 0
            },
            'Boss - Olrox, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Olrox, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Doppelganger 10
        'Source Stage': 'Outer Wall',
        'Source Room': 'Outer Wall, Doppelganger Room',
        'Target Stage': 'Boss - Doppelganger 10',
        'Target Rooms': {
            'Boss - Doppelganger 10, Doppelganger Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Doppelganger 10, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Doppelganger 10, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Doppelganger 40
        'Source Stage': 'Reverse Caverns',
        'Source Room': 'Reverse Caverns, Scylla Wyrm Room',
        'Target Stage': 'Boss - Doppelganger 40',
        'Target Rooms': {
            'Boss - Doppelganger 40, Scylla Wyrm Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Doppelganger 40, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Doppelganger 40, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 1,
            },
        },
    },
    { # Boss - Trio
        'Source Stage': 'Reverse Colosseum',
        'Source Room': 'Reverse Colosseum, Arena',
        'Target Stage': 'Boss - Trio',
        'Target Rooms': {
            'Boss - Trio, Arena': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Trio, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Trio, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Creature
        'Source Stage': 'Reverse Outer Wall',
        'Source Room': 'Reverse Outer Wall, Doppelganger Room',
        'Target Stage': 'Boss - Creature',
        'Target Rooms': {
            'Boss - Creature, Doppelganger Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Creature, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Creature, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Hippogryph
        'Source Stage': 'Royal Chapel',
        'Source Room': 'Royal Chapel, Hippogryph Room',
        'Target Stage': 'Boss - Hippogryph',
        'Target Rooms': {
            'Boss - Hippogryph, Hippogryph Room': {
                'Top': 0,
                'Left': 0,
            },
            'Boss - Hippogryph, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Hippogryph, Fake Room With Teleporter B': {
                'Top': 0,
                'Left': 2,
            },
        },
    },
    { # Boss - Scylla
        'Source Stage': 'Underground Caverns',
        'Source Room': 'Underground Caverns, Scylla Wyrm Room',
        'Target Stage': 'Boss - Scylla',
        'Target Rooms': {
            'Boss - Scylla, Scylla Wyrm Room': {
                'Top': 0,
                'Left': 0
            },
            'Boss - Scylla, Fake Room With Teleporter A': {
                'Top': 0,
                'Left': -1,
            },
            'Boss - Scylla, Rising Water Room': {
                'Top': 0,
                'Left': 1,
            },
            'Boss - Scylla, Scylla Room': {
                'Top': -1,
                'Left': 1,
            },
            'Boss - Scylla, Crystal Cloak Room': {
                'Top': -1,
                'Left': 0,
            },
        },
    },
]

familiar_events = {
    # Catacombs, Pitch Black Spike Maze (y=50, x=41)
    '1': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '2': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '7': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '12': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '15': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '28': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '31': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '44': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    '47': ('Catacombs', 'Catacombs, Pitch Black Spike Maze', False),
    # Long Library, Shop (y=20, x=49)
    '3': ('Long Library', 'Long Library, Shop', False),
    '8': ('Long Library', 'Long Library, Shop', False),
    '13': ('Long Library', 'Long Library, Shop', False),
    '29': ('Long Library', 'Long Library, Shop', False),
    '45': ('Long Library', 'Long Library, Shop', False),
    # Abandoned Mine, Crumbling Stairwells With Demon Switch (y=40, x=32)
    '4': ('Abandoned Mine', 'Abandoned Mine, Crumbling Stairwells With Demon Switch', False),
    '9': ('Abandoned Mine', 'Abandoned Mine, Crumbling Stairwells With Demon Switch', False),
    # Royal Chapel, Confessional Booth (y=21, x=16)
    '5': ('Royal Chapel', 'Royal Chapel, Confessional Booth', False),
    '10': ('Royal Chapel', 'Royal Chapel, Confessional Booth', False),
    '14': ('Royal Chapel', 'Royal Chapel, Confessional Booth', False),
    '30': ('Royal Chapel', 'Royal Chapel, Confessional Booth', False),
    '46': ('Royal Chapel', 'Royal Chapel, Confessional Booth', False),
    # Cave, Crumbling Stairwells With Demon Switch (y=20, x=-31)
    '6': ('Cave', 'Cave, Crumbling Stairwells With Demon Switch', True),
    '11': ('Cave', 'Cave, Crumbling Stairwells With Demon Switch', True),
    # Colosseum, Top of Elevator Shaft (y=22, x=21)
    '16': ('Colosseum', 'Colosseum, Top of Elevator Shaft', False),
    '32': ('Colosseum', 'Colosseum, Top of Elevator Shaft', False),
    # Outer Wall, Lower Medusa Room (y=26, x=60)
    '17': ('Outer Wall', 'Outer Wall, Lower Medusa Room', False),
    '33': ('Outer Wall', 'Outer Wall, Lower Medusa Room', False),
    # Long Library, Lesser Demon Area (y=18, x=44)
    '18': ('Long Library', 'Long Library, Lesser Demon Area', False),
    '34': ('Long Library', 'Long Library, Lesser Demon Area', False),
    # Royal Chapel, Spike Hallway (y=15, x=10)
    '19': ('Royal Chapel', 'Royal Chapel, Spike Hallway', False),
    '35': ('Royal Chapel', 'Royal Chapel, Spike Hallway', False),
    # Underground Caverns, Hidden Crystal Entrance (y=37, x=39)
    '20': ('Underground Caverns', 'Underground Caverns, Hidden Crystal Entrance', False),
    '36': ('Underground Caverns', 'Underground Caverns, Hidden Crystal Entrance', False),
    # Underground Caverns, Plaque Room With Breakable Wall (y=27, x=36)
    '21': ('Underground Caverns', 'Underground Caverns, Plaque Room With Breakable Wall', False),
    '37': ('Underground Caverns', 'Underground Caverns, Plaque Room With Breakable Wall', False),
    # Alchemy Laboratory, Tall Zig Zag Room (y=32, x=12)
    '22': ('Alchemy Laboratory', 'Alchemy Laboratory, Tall Zig Zag Room', False),
    '23': ('Alchemy Laboratory', 'Alchemy Laboratory, Tall Zig Zag Room', False),
    '38': ('Alchemy Laboratory', 'Alchemy Laboratory, Tall Zig Zag Room', False),
    '39': ('Alchemy Laboratory', 'Alchemy Laboratory, Tall Zig Zag Room', False),
    # Olrox's Quarters, Grand Staircase (y=21, x=27)
    '24': ('Olrox\'s Quarters', 'Olrox\'s Quarters, Grand Staircase', False),
    '40': ('Olrox\'s Quarters', 'Olrox\'s Quarters, Grand Staircase', False),
    # Long Library, Secret Bookcase Room (y=18, x=49)
    '25': ('Long Library', 'Long Library, Secret Bookcase Room', False),
    '41': ('Long Library', 'Long Library, Secret Bookcase Room', False),
    # Clock Tower, Left Gear Room (y=11, x=50)
    '26': ('Clock Tower', 'Clock Tower, Left Gear Room', False),
    '42': ('Clock Tower', 'Clock Tower, Left Gear Room', False),
    # Clock Tower, Pendulum Room (y=10, x=43)
    '27': ('Clock Tower', 'Clock Tower, Pendulum Room', False),
    '43': ('Clock Tower', 'Clock Tower, Pendulum Room', False),
}

def shuffle_teleporters(teleporters) -> dict:
    print('shuffle_teleporters')
    MAX_LAYER = 5
    print('*** Shuffle teleporters ***')
    exclusions = (
        'Castle Center, Fake Room with Teleporter to Marble Gallery',
        'Castle Entrance Revisited, Fake Room with Teleporter to Alchemy Laboratory',
        'Castle Entrance Revisited, Fake Room with Teleporter to Marble Gallery',
        'Castle Entrance Revisited, Fake Room with Teleporter to Warp Rooms',
        'Castle Entrance Revisited, Fake Room with Teleporter to Underground Caverns',
        'Marble Gallery, Fake Room with Teleporter to Castle Center',
        'Special, Succubus Defeated',
        'Underground Caverns, Fake Room with Teleporter to Boss - Succubus',
    )
    layers = {
        'Alchemy Laboratory': 0,
        'Castle Entrance': 0,
        'Castle Keep': 0,
        'Colosseum': 0,
        'Long Library': 0,
        'Outer Wall': 0,
        'Warp Rooms': 0,
        'Abandoned Mine': 1,
        'Marble Gallery': 1,
        'Royal Chapel': 1,
        'Underground Caverns': 1,
        'Catacombs': 2,
        'Clock Tower': 2,
        'Olrox\'s Quarters': 2,
    }
    connections = set()
    while True:
        sources = {}
        targets = {}
        for (source_key, source) in teleporters['Sources'].items():
            if source_key in exclusions:
                continue
            source_stage = source['Stage']
            target_key = source['Target']
            target_stage = teleporters['Targets'][target_key]['Stage']
            source_direction = 'Right'
            target_direction = 'Left'
            if 'Right Red Door' in target_key:
                source_direction = 'Left'
                target_direction = 'Right'
            sources[source_key] = {
                'Stage': source_stage,
                'Direction': source_direction,
            }
            targets[target_key] = {
                'Stage': target_stage,
                'Direction': target_direction,
            }
        current_layer = 0
        stages = {}
        connections = set()
        work = set()
        work.add('Castle Entrance, Fake Room with Teleporter to Alchemy Laboratory')
        while len(work) > 0:
            possible_choices = set(work)
            for choice in work:
                choice_stage = choice.split(', ')[0]
                if layers[choice_stage] > current_layer:
                    possible_choices.remove(choice)
            if len(possible_choices) < 1:
                current_layer += 1
                if current_layer > MAX_LAYER:
                    break
                else:
                    pass
                continue
            source_a_key = random.choice(list(sorted(possible_choices)))
            work.remove(source_a_key)
            source_a = sources[source_a_key]
            if source_a['Stage'] not in stages:
                stages[source_a['Stage']] = set()
            source_b_candidates = set()
            for (candidate_source_b_key, candidate_source_b) in sources.items():
                if source_a_key == 'Castle Entrance, Fake Room with Teleporter to Alchemy Laboratory':
                    if candidate_source_b_key == 'Warp Rooms, Fake Room with Teleporter to Castle Entrance':
                        # First stage connection in the game is not allowed to connect to the root Warp Room
                        continue
                if candidate_source_b['Stage'] == source_a['Stage']:
                    # A stage may not connect to itself
                    continue
                if candidate_source_b['Direction'] == source_a['Direction']:
                    # A Left Passage must connect to a Right Passage, and vice versa
                    continue
                if candidate_source_b['Stage'] in stages[source_a['Stage']]:
                    # A stage may not connect to the same stage more than once
                    continue
                candidate_stage = candidate_source_b_key.split(', ')[0]
                if layers[candidate_stage] > current_layer:
                    # A stage may not connect to a stage beyond the current layer
                    continue
                source_b_candidates.add(candidate_source_b_key)
            if len(source_b_candidates) < 1:
                current_layer += 1
                if current_layer > MAX_LAYER:
                    break
                continue
            source_b_key = random.choice(list(sorted(source_b_candidates)))
            source_b = sources[source_b_key]
            if source_b['Stage'] not in stages:
                stages[source_b['Stage']] = set()
            stages[source_a['Stage']].add(source_b['Stage'])
            stages[source_b['Stage']].add(source_a['Stage'])
            sources.pop(source_a_key)
            sources.pop(source_b_key)
            # print('  - ', 'source A:', source_a_key)
            # print('  - ', 'source B:', source_b_key)
            if source_b_key in work:
                work.remove(source_b_key)
            connections.add((source_a_key, source_b_key))
            connections.add((source_b_key, source_a_key))
            for (next_source_key, next_source) in sources.items():
                if next_source['Stage'] in source_b['Stage']:
                    # print('    ', 'add to work:', next_source_key)
                    work.add(next_source_key)
        # print(len(sources))
        if len(sources) < 1:
            break
    for (source_a_key, source_b_key) in connections:
        print((source_a_key, source_b_key))
        teleporters['Sources'][source_a_key]['Target'] = teleporters['Sources'][source_b_key]['Return']
        teleporters['Sources'][source_b_key]['Target'] = teleporters['Sources'][source_a_key]['Return']
        if source_a_key.startswith('Castle Entrance, '):
            alt_source_key = 'Castle Entrance Revisited' + source_a_key[len('Castle Entrance'):]
            teleporters['Sources'][alt_source_key]['Target'] = teleporters['Sources'][source_b_key]['Return']
        if source_b_key.startswith('Castle Entrance, '):
            alt_source_key = 'Castle Entrance Revisited' + source_b_key[len('Castle Entrance'):]
            teleporters['Sources'][alt_source_key]['Target'] = teleporters['Sources'][source_a_key]['Return']
    print('*** Teleporter arrangement found! ***')

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('stage_validations', help='Input a filepath to the stage validations YAML file', type=str)
    stage_validations = {}
    validation_results = {}
    validation_results_filepath = os.path.join('build', 'shuffler', 'validation_results.json')
    args = parser.parse_args()
    with (
        open(validation_results_filepath) as validation_results_json,
        open(args.stage_validations) as stage_validations_file,
    ):
        stage_validations = yaml.safe_load(stage_validations_file)
        validation_results = json.load(validation_results_json)
    SHUFFLE_STAGE_CONNECTIONS = True
    MIN_MAP_ROW = 5
    MAX_MAP_ROW = 55
    MIN_MAP_COL = 0
    MAX_MAP_COL = 63
    # Keep randomizing until a solution is found
    initial_seed = random.randint(0, 2 ** 64)
    global_rng = random.Random(initial_seed)
    shuffler = {
        'Initial Seed': initial_seed,
        'Start Time': datetime.datetime.now(datetime.timezone.utc),
        'Stages': {},
    }
    invalid_stage_files = set()
    while True:
        print('')
        shuffler['Stages'] = {}
        # Randomize
        stages = {
            'Abandoned Mine': {},
            'Alchemy Laboratory': {},
            'Castle Center': {},
            'Castle Keep': {},
            'Castle Entrance': {},
            'Catacombs': {},
            'Clock Tower': {},
            'Colosseum': {},
            'Long Library': {},
            'Marble Gallery': {},
            'Olrox\'s Quarters': {},
            'Outer Wall': {},
            'Royal Chapel': {},
            'Underground Caverns': {},
            'Warp Rooms': {},
        }
        mapper_core = mapper.MapperData().get_core()
        # Calculate teleporter changes
        teleporters = None
        if SHUFFLE_STAGE_CONNECTIONS:
            teleporters = {}
            shuffle_teleporters(mapper_core['Teleporters'])
            for (source_name, source) in mapper_core['Teleporters']['Sources'].items():
                if source_name in (
                    'Castle Center, Fake Room with Teleporter to Marble Gallery',
                    'Marble Gallery, Fake Room with Teleporter to Castle Center',
                    'Special, Succubus Defeated',
                    'Underground Caverns, Fake Room with Teleporter to Boss - Succubus',
                ):
                    continue
                target_name = source['Target']
                target = mapper_core['Teleporters']['Targets'][target_name]
                teleporters[source['Index']] = {
                    'Player X': target['Player X'],
                    'Player Y': target['Player Y'],
                    'Room': target['Stage'] + ', ' + target['Room'],
                    'Stage': target['Stage'],
                }
        print('Set starting seeds for each stage')
        for stage_name in sorted(stages.keys()):
            stages[stage_name]['Initial Seed'] = global_rng.randint(0, 2 ** 64)
            stages[stage_name]['RNG'] = random.Random(stages[stage_name]['Initial Seed'])
            print('', stage_name, stages[stage_name]['Initial Seed'])
        print('Randomize stages with starting seeds')
        for stage_name in sorted(stages.keys()):
            # TODO(sestren): Add SKIP and ONLY to tests
            directory_listing = os.listdir(os.path.join('build', 'shuffler', stage_name))
            file_listing = list(
                name for name in directory_listing if
                name.endswith('.json') and
                (stage_name, name[:-len('.json')]) not in invalid_stage_files
            )
            print('', stage_name, len(file_listing), stages[stage_name]['Initial Seed'])
            assert len(file_listing) > 0
            # Keep randomly choosing a shuffled stage until one that passes all its validation checks is found
            # TODO(sestren): Allow validation of secondary stages like Castle Entrance Revisited or Reverse Keep
            max_unique_pass_count = 0
            while True:
                all_valid_ind = True
                chosen_file_name = stages[stage_name]['RNG'].choice(file_listing)
                with open(os.path.join('build', 'shuffler', stage_name, chosen_file_name)) as mapper_data_json:
                    mapper_data = json.load(mapper_data_json)
                    mapper_data_json.close()
                stages[stage_name]['Mapper'] = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
                stages[stage_name]['Mapper'].generate()
                stages[stage_name]['Mapper'].stage.normalize()
                stage_changes = stages[stage_name]['Mapper'].stage.get_changes()
                assert stages[stage_name]['Mapper'].validate()
                hash_of_rooms = hashlib.sha256(json.dumps(stage_changes['Rooms'], sort_keys=True).encode()).hexdigest()
                assert hash_of_rooms == mapper_data['Hash of Rooms']
                print(' ', 'hash:', hash_of_rooms)
                print('   ', stage_name, len(file_listing), max_unique_pass_count)
                changes = {
                    'Stages': {
                        stage_name: stage_changes,
                    },
                }
                unique_passes = set()
                for (validation_name, validation) in stage_validations[stage_name].items():
                    logic_core = mapper.LogicCore(mapper_core, changes).get_core()
                    for (state_key, state_value) in validation['State'].items():
                        logic_core['State'][state_key] = state_value
                    logic_core['Goals'] = validation['Goals']
                    # Validate
                    cached_ind = True
                    if stage_name not in validation_results:
                        validation_results[stage_name] = {}
                        cached_ind = False
                    if hash_of_rooms not in validation_results[stage_name]:
                        validation_results[stage_name][hash_of_rooms] = {}
                        cached_ind = False
                    hash_of_validation = hashlib.sha256(
                        json.dumps(validation, sort_keys=True).encode()
                    ).hexdigest()
                    if hash_of_validation not in validation_results[stage_name][hash_of_rooms]:
                        cached_ind = False
                    validation_result = True
                    if not cached_ind:
                        validation_results[stage_name][hash_of_rooms][hash_of_validation] = validator.validate(
                            mapper_core,
                            mapper_data,
                            stage_name,
                            validation
                        )
                    validation_result = validation_results[stage_name][hash_of_rooms][hash_of_validation]
                    if validation_result:
                        print('   ', '✅ ...', validation_name)
                        unique_passes.add(validation_name)
                        max_unique_pass_count = max(max_unique_pass_count, len(unique_passes))
                    else:
                        print('   ', '❌ ...', validation_name)
                        all_valid_ind = False
                        break
                if all_valid_ind:
                    break
                else:
                    invalid_stage_files.add((stage_name, chosen_file_name[:-len('.json')]))
            shuffler['Stages'][stage_name] = {
                'Note': 'Prebaked',
                'Attempts': stages[stage_name]['Mapper'].attempts,
                'Generation Start Date': stages[stage_name]['Mapper'].start_time.isoformat(),
                'Generation End Date': stages[stage_name]['Mapper'].end_time.isoformat(),
                # 'Generation Version': GENERATION_VERSION,
                'Hash of Rooms': hashlib.sha256(json.dumps(stage_changes['Rooms'], sort_keys=True).encode()).hexdigest(),
                'Seed': stages[stage_name]['Mapper'].current_seed,
                'Stage': stage_name,
            }
        # Randomly place down stages one at a time
        stage_names = list(stages.keys() - {'Warp Rooms'})
        global_rng.shuffle(stage_names)
        valid_ind = False
        for (index, stage_name) in enumerate(stage_names):
            current_stage = stages[stage_name]['Mapper'].stage
            prev_cells = set()
            for prev_stage_name in stage_names[:index]:
                cells = stages[prev_stage_name]['Mapper'].stage.get_cells(
                    stages[prev_stage_name]['Stage Top'],
                    stages[prev_stage_name]['Stage Left']
                )
                prev_cells = prev_cells.union(cells)
            (top, left, bottom, right) = current_stage.get_bounds()
            best_area = float('inf')
            best_stage_offsets = []
            (min_map_row, max_map_row) = (MIN_MAP_ROW, MAX_MAP_ROW - bottom)
            (min_map_col, max_map_col) = (MIN_MAP_COL, MAX_MAP_COL - right)
            if stage_name == 'Castle Entrance':
                # Castle Entrance is being restricted by where 'Unknown Room 20' and 'After Drawbridge' can be
                min_map_row = 38 - current_stage.rooms['Castle Entrance, After Drawbridge'].top
                max_map_row = min_map_row + 1
                min_map_col = max(min_map_col, 1 - current_stage.rooms['Castle Entrance, Unknown Room 20'].left)
            for stage_top in range(min_map_row, max_map_row):
                for stage_left in range(min_map_col, max_map_col):
                    # Reject if it overlaps another stage
                    current_cells = current_stage.get_cells(stage_top, stage_left)
                    if len(current_cells.intersection(prev_cells)) > 0:
                        continue
                    all_cells = current_cells.union(prev_cells)
                    min_row = min((row for (row, col) in all_cells))
                    max_row = max((row for (row, col) in all_cells))
                    min_col = min((col for (row, col) in all_cells))
                    max_col = max((col for (row, col) in all_cells))
                    area = (1 + max_row - min_row) * (1 + max_col - min_col)
                    # Keep track of whichever offset minimizes the overall area
                    if area < best_area:
                        best_stage_offsets = []
                        best_area = area
                    if area == best_area:
                        best_stage_offsets.append((stage_top, stage_left))
            if best_area >= float('inf'):
                print('******')
                print('Could not find a suitable spot on the map for', stage_name)
                print('******')
                break
            (stage_top, stage_left) = global_rng.choice(best_stage_offsets)
            # cells = current_stage.get_cells(stage_top, stage_left)
            # prev_cells.union(cells)
            (top, left, bottom, right) = current_stage.get_bounds()
            if not (
                MIN_MAP_ROW <= stage_top + top < MAX_MAP_ROW and
                MIN_MAP_ROW <= stage_top + bottom < MAX_MAP_ROW and
                MIN_MAP_COL <= stage_left + left < MAX_MAP_COL and
                MIN_MAP_COL <= stage_left + right < MAX_MAP_COL
            ):
                print('******')
                print(stage_name, 'could not be placed within the bounds of the map')
                print('******')
                break
            current_cells = current_stage.get_cells(stage_top, stage_left)
            if len(current_cells.intersection(prev_cells)) > 0:
                print('******')
                print(stage_name, 'could not be placed without overlapping with another stage')
                print('******')
                break
            stages[stage_name]['Stage Top'] = stage_top
            stages[stage_name]['Stage Left'] = stage_left
            print('>>>', stage_name, (stage_top, stage_left))
        else:
            valid_ind = True
        if not valid_ind:
            print('******')
            print('Gave up trying to find a valid arrangement of the stages; starting over from scratch')
            print('******')
            continue
        changes = {
            'Boss Teleporters': {},
            'Castle Map': [],
            'Constants': {},
            'Familiar Events': {},
            'Reverse Warp Room Coordinates': {},
            'Stages': {},
            'Teleporters': teleporters,
            'Warp Room Coordinates': {},
        }
        stages['Warp Rooms']['Stage Top'] = 0
        stages['Warp Rooms']['Stage Left'] = 0
        # Initialize the castle map drawing grid
        castle_map = [['0' for col in range(256)] for row in range(256)]
        # Process each stage, with Warp Rooms being processed last
        stage_names = list(stages.keys() - {'Warp Rooms'})
        stage_names += ['Warp Rooms']
        overrides = {}
        for (index, stage_name) in enumerate(stage_names):
            stage = stages[stage_name]
            (stage_top, stage_left) = (stage['Stage Top'], stage['Stage Left'])
            changes['Stages'][stage_name] = {
                'Rooms': {},
            }
            stage_changes = stage['Mapper'].stage.get_changes()
            if stage_name == 'Castle Entrance':
                # NOTE(sestren): These rooms are being placed out of the way to provide more room on the map
                changes['Stages'][stage_name]['Rooms']['Castle Entrance, Forest Cutscene'] = {
                    'Top': 63,
                    'Left': 0,
                }
                changes['Stages'][stage_name]['Rooms']['Castle Entrance, Unknown Room 19'] = {
                    'Top': 63,
                    'Left': 18,
                }
                # Make a space for cloning Castle Entrance later
                changes['Stages']['Castle Entrance Revisited'] = {
                    'Rooms': {},
                }
            elif stage_name == 'Warp Rooms':
                for (warp_room_name, warp_room_id) in (
                    ('Castle Keep', 3),
                    ('Olrox\'s Quarters', 4),
                    ('Abandoned Mine', 1),
                ):
                    warp__fake_room_name = 'Warp Rooms, Fake Room with Teleporter to ' + warp_room_name
                    return_name = mapper_core['Teleporters']['Sources'][warp__fake_room_name]['Return']
                    for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                        if source_room['Target'] == return_name:
                            source_room = changes['Stages'][source_room['Stage']]['Rooms'][source_room_name]
                            overrides[warp__fake_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] - 2,
                            }
                            overrides['Warp Rooms, Loading Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] - 1,
                            }
                            overrides['Warp Rooms, Warp Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'],
                            }
                            changes['Warp Room Coordinates'][warp_room_id] = {
                                'Room Y': source_room['Top'],
                                'Room X': source_room['Left'],
                            }
                            changes['Reverse Warp Room Coordinates'][warp_room_id] = {
                                'Room Y': 63 - source_room['Top'],
                                'Room X': 63 - source_room['Left'],
                            }
                            break
                for (warp_room_name, warp_room_id) in (
                    ('Outer Wall', 2),
                    ('Castle Entrance', 0),
                ):
                    warp__fake_room_name = 'Warp Rooms, Fake Room with Teleporter to ' + warp_room_name
                    return_name = mapper_core['Teleporters']['Sources'][warp__fake_room_name]['Return']
                    for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                        if source_room['Target'] == return_name:
                            source_room = changes['Stages'][source_room['Stage']]['Rooms'][source_room_name]
                            overrides['Warp Rooms, Warp Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'],
                            }
                            overrides['Warp Rooms, Loading Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] + 1,
                            }
                            overrides[warp__fake_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] + 2,
                            }
                            changes['Warp Room Coordinates'][warp_room_id] = {
                                'Room Y': source_room['Top'],
                                'Room X': source_room['Left'],
                            }
                            changes['Reverse Warp Room Coordinates'][warp_room_id] = {
                                'Room Y': 63 - source_room['Top'],
                                'Room X': 63 - source_room['Left'],
                            }
                            break
            for room_name in stage_changes['Rooms']:
                room_top = stage_top + stage_changes['Rooms'][room_name]['Top']
                room_left = stage_left + stage_changes['Rooms'][room_name]['Left']
                if room_name in overrides:
                    room_top = overrides[room_name]['Top']
                    room_left = overrides[room_name]['Left']
                changes['Stages'][stage_name]['Rooms'][room_name] = {
                    'Top': room_top,
                    'Left': room_left,
                }
                # Draw room on castle map drawing grid
                room_drawing = None
                use_alt_map = False
                if use_alt_map and 'Alternate Map' in mapper_core['Rooms'][room_name]:
                    room_drawing = mapper_core['Rooms'][room_name]['Alternate Map']
                elif 'Map' in mapper_core['Rooms'][room_name]:
                    room_drawing = mapper_core['Rooms'][room_name]['Map']
                else:
                    room_drawing = get_room_drawing(mapper_core, room_name)
                for (room_row, row_data) in enumerate(room_drawing):
                    row = 4 * room_top + room_row
                    for (room_col, char) in enumerate(row_data):
                        col = 4 * room_left + room_col
                        if char == ' ':
                            continue
                        if (0 <= row < 256) and (0 <= col < 256):
                            castle_map[row][col] = char
                        else:
                            print('Tried to draw pixel out of bounds of map:', room_name, (room_top, room_left), (row, col))
        links = {}
        for (index, stage_name) in enumerate(stage_names):
            if stage_name.startswith('Warp Rooms, '):
                continue
            print('***', '', stage_name)
            stage = stages[stage_name]
            stage_changes = stage['Mapper'].stage.get_changes()
            for room_name in stage_changes['Rooms']:
                if 'Loading Room' in room_name:
                    print('***', '  -', 'LOADING:', room_name)
                    fake_room_name = stage_name + ', Fake Room with Teleporter to ' + room_name[room_name.find('Loading Room to ') + len('Loading Room to '):]
                    print('***', '  -', 'fake_room_name:', fake_room_name)
                    return_name = mapper_core['Teleporters']['Sources'][fake_room_name]['Return']
                    print('***', '  -', 'return_name:', return_name)
                    for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                        if source_room['Target'] == return_name:
                            source_room_stage = source_room['Stage']
                            if source_room_stage == 'Warp Rooms':
                                continue
                            # if source_room_name in changes['Stages'][source_room_stage]['Rooms']:
                            #     source_room = changes['Stages'][source_room_stage]['Rooms'][source_room_name]
                            # TODO(sestren): Figure out why this throws KeyErrors on 'Castle Entrance Revisited, Fake Room with Teleporter to Underground Caverns'
                            source_loading_room = source_room_name.replace('Fake Room with Teleporter', 'Loading Room').replace('Castle Entrance Revisited', 'Castle Entrance')
                            # print('***', '  -', 'source_room_name:', source_room_name)
                            code = 'CDHIJKLNOSTUVXYZ147+-|###'[len(links)]
                            rooms = tuple(sorted((room_name, source_loading_room)))
                            if rooms in links:
                                continue
                            print(len(links), code, rooms)
                            drawing = [
                                '444 44d 4d4 444 444 4d4 4dd 444 444 d44 444 4d4 4d4 4d4 4d4 44d d4d 4d4 444 d4d ddd d4d 444 444 444 ',
                                '4dd 4d4 444 d4d d4d 44d 4dd 4d4 4d4 d4d d4d 4d4 4d4 d4d d4d d4d d4d 444 dd4 444 444 d4d 444 444 444 ',
                                '444 44d 4d4 444 44d 4d4 444 4d4 444 44d d4d 444 d4d 4d4 d4d d44 d4d dd4 dd4 d4d ddd d4d 444 444 444 ',
                            ]
                            room_a = changes['Stages'][stage_name]['Rooms'][room_name]
                            room_b = changes['Stages'][source_room_stage]['Rooms'][source_loading_room]
                            for room_pos in (
                                room_a,
                                room_b,
                            ):
                                top = 4 * room_pos['Top'] + 1
                                left = 4 * room_pos['Left'] + 1
                                for row in range(3):
                                    for col in range(3):
                                        if drawing[row][col] != ' ':
                                            castle_map[top + row][left + col] = drawing[row][4 * len(links) + col]
                            links[rooms] = code
                            break
        # Calculate which cells on the map buying the Castle Map in the Shop will reveal
        cells_to_reveal = set()
        for (row, row_data) in enumerate(castle_map):
            for (col, char) in enumerate(row_data):
                if char == '0':
                    continue
                cell_row = row // 4
                cell_col = col // 4
                cells_to_reveal.add((cell_row, cell_col))
        castle_map_reveal_top = min(row for (row, col) in cells_to_reveal)
        castle_map_reveal_grid = []
        for row in range(38):
            row_data = []
            for col in range(64):
                char = ' '
                if (castle_map_reveal_top + row, col) in cells_to_reveal:
                    char = '#'
                row_data.append(char)
            castle_map_reveal_grid.append(''.join(row_data))
        changes['Castle Map Reveals'] = [
            {
                'Bytes Per Row': 8,
                'Grid': castle_map_reveal_grid,
                'Left': 0,
                'Rows': 38,
                'Top': castle_map_reveal_top,
            },
        ]
        # Apply Castle Entrance room positions to Castle Entrance Revisited
        changes['Stages']['Castle Entrance Revisited'] = {
            'Rooms': {},
        }
        for room_name in changes['Stages']['Castle Entrance']['Rooms']:
            if room_name in (
                'Castle Entrance, Forest Cutscene',
                'Castle Entrance, Unknown Room 19',
                'Castle Entrance, Unknown Room 20',
            ):
                continue
            source_top = changes['Stages']['Castle Entrance']['Rooms'][room_name]['Top']
            source_left = changes['Stages']['Castle Entrance']['Rooms'][room_name]['Left']
            revisited_room_name = 'Castle Entrance Revisited, ' + room_name[len('Castle Entrance, '):]
            changes['Stages']['Castle Entrance Revisited']['Rooms'][revisited_room_name] = {
                'Top': source_top,
                'Left': source_left,
            }
        # Flip normal castle changes and apply them to inverted castle
        reversible_stages = {
            'Abandoned Mine': 'Cave',
            'Alchemy Laboratory': 'Necromancy Laboratory',
            'Castle Center': 'Reverse Castle Center',
            'Castle Entrance': 'Reverse Entrance',
            'Castle Keep': 'Reverse Keep',
            'Catacombs': 'Floating Catacombs',
            'Clock Tower': 'Reverse Clock Tower',
            'Colosseum': 'Reverse Colosseum',
            'Long Library': 'Forbidden Library',
            'Marble Gallery': 'Black Marble Gallery',
            'Olrox\'s Quarters': 'Death Wing\'s Lair',
            'Outer Wall': 'Reverse Outer Wall',
            'Royal Chapel': 'Anti-Chapel',
            'Underground Caverns': 'Reverse Caverns',
            'Warp Rooms': 'Reverse Warp Rooms',
        }
        for (stage_name, reversed_stage_name) in reversible_stages.items():
            changes['Stages'][reversed_stage_name] = {
                'Rooms': {},
            }
            for room_name in changes['Stages'][stage_name]['Rooms']:
                reversed_room_name = reversed_stage_name + ', ' + room_name[(len(stage_name) + 2):]
                source_top = changes['Stages'][stage_name]['Rooms'][room_name]['Top']
                source_left = changes['Stages'][stage_name]['Rooms'][room_name]['Left']
                source_rows = 1
                source_cols = 1
                if room_name in mapper_core['Rooms']:
                    source_rows = mapper_core['Rooms'][room_name]['Rows']
                    source_cols = mapper_core['Rooms'][room_name]['Columns']
                else:
                    print('room_name not found:', room_name)
                changes['Stages'][reversed_stage_name]['Rooms'][reversed_room_name] = {
                    'Top': 63 - source_top - (source_rows - 1),
                    'Left': 63 - source_left - (source_cols - 1),
                }
        # Move Boss and Cutscene stages to the match their respective rooms
        for element in boss_stage_rooms:
            source_stage_name = element['Source Stage']
            source_room_name = element['Source Room']
            target_stage_name = element['Target Stage']
            if target_stage_name not in changes['Stages']:
                changes['Stages'][target_stage_name] = {
                    'Rooms': {},
                }
            for (target_room_name, target_room) in element['Target Rooms'].items():
                source_room = changes['Stages'][source_stage_name]['Rooms'][source_room_name]
                changes['Stages'][target_stage_name]['Rooms'][target_room_name] = {
                    'Top': source_room['Top'] + target_room['Top'],
                    'Left': source_room['Left'] + target_room['Left'],
                }
        # Assign boss teleporter locations to their counterparts in the castle
        for (boss_teleporter_id, (stage_name, room_name, offset_top, offset_left)) in boss_teleporters.items():
            source_room = changes['Stages'][stage_name]['Rooms'][room_name]
            changes['Boss Teleporters'][boss_teleporter_id] = {
                'Room Y': source_room['Top'] + offset_top,
                'Room X': source_room['Left'] + offset_left,
            }
        # Assign familiar event locations to their counterparts in the castle
        for (familiar_event_id, (stage_name, room_name, inverted)) in familiar_events.items():
            source_room = changes['Stages'][stage_name]['Rooms'][room_name]
            sign = -1 if inverted else 1
            changes['Familiar Events'][familiar_event_id] = {
                'Room Y': source_room['Top'],
                'Room X': sign * source_room['Left'],
            }
        # Adjust the target point for the Castle Teleporter locations
        # The target points relative to their respective rooms is (y=847, x=320) in TOP and (y=1351, x=1728) in RTOP
        source_room = changes['Stages']['Castle Keep']['Rooms']['Castle Keep, Keep Area']
        changes['Constants']['Castle Keep Teleporter, Y Offset'] = -1 * (256 * source_room['Top'] + 847)
        changes['Constants']['Castle Keep Teleporter, X Offset'] = -1 * (256 * source_room['Left'] + 320)
        source_room = changes['Stages']['Reverse Keep']['Rooms']['Reverse Keep, Keep Area']
        changes['Constants']['Reverse Keep Teleporter, Y Offset'] = -1 * (256 * source_room['Top'] + 1351)
        changes['Constants']['Reverse Keep Teleporter, X Offset'] = -1 * (256 * source_room['Left'] + 1728)
        # Adjust the False Save Room trigger, solved by @MottZilla
        # See https://github.com/Xeeynamo/sotn-decomp/blob/ffce97b0022ab5d4118ad35c93dea86bb18b25cc/src/dra/5087C.c#L1012
        source_room = changes['Stages']['Underground Caverns']['Rooms']['Underground Caverns, False Save Room']
        changes['Constants']['False Save Room, Room Y'] = source_room['Top']
        changes['Constants']['False Save Room, Room X'] = source_room['Left']
        source_room = changes['Stages']['Reverse Caverns']['Rooms']['Reverse Caverns, False Save Room']
        changes['Constants']['Reverse False Save Room, Room Y'] = source_room['Top']
        changes['Constants']['Reverse False Save Room, Room X'] = source_room['Left']
        # Disable NOCLIP checker; this will allow NOCLIP to always be on
        changes['Constants']['Set initial NOCLIP value'] = 0xAC258850
        # Apply castle map drawing grid to changes
        changes['Castle Map'] = []
        for row in range(len(castle_map)):
            row_data = ''.join(castle_map[row])
            changes['Castle Map'].append(row_data)
        # Show softlock warning and build number on file select screen
        changes['Strings'] = {
            '10': 'Press L2 if softlocked.     ',
            '11': 'Alpha Build 73      ',
        }
        # Patch - Skip Maria cutscene in Alchemy Laboratory to prevent softlocks when approaching from the left side
        changes['Constants']['Should skip Maria Alchemy Laboratory'] = 0x0806E296
        # Patch - Assign Power of Wolf Relic its own ID (was previously duplicating the trap door's ID)
        # https://github.com/SestrenExsis/SOTN-Shuffler/issues/36
        room = changes['Stages']['Castle Entrance Revisited']['Rooms']['Castle Entrance Revisited, After Drawbridge']
        room['Object Layout - Horizontal'] = {
            '12': {
                'Entity Room Index': 18,
            },
        }
        room['Object Layout - Vertical'] = {
            '1': {
                'Entity Room Index': 18,
            },
        }
        room = changes['Stages']['Castle Entrance']['Rooms']['Castle Entrance, After Drawbridge']
        room['Object Layout - Horizontal'] = {
            '10': {
                'Entity Room Index': 18,
            },
        }
        room['Object Layout - Vertical'] = {
            '1': {
                'Entity Room Index': 18,
            },
        }
        # ...
        shuffler['End Time'] = datetime.datetime.now(datetime.timezone.utc)
        current_seed = {
            'Changes': changes,
            'Data Core': mapper_core,
            # 'Logic Core': logic_core,
            'Shuffler': shuffler,
            # 'Solver': solution,
        }
        print(' '.join((
            shuffler['End Time'].strftime('%Y-%m-%d %H-%M-%S'),
            'SOTN Shuffler',
            changes['Strings']['11'].strip(),
            '(' + str(shuffler['Initial Seed']) + ')',
        )))
        with open(os.path.join('build', 'shuffler', 'current-seed.json'), 'w') as current_seed_json:
            json.dump(current_seed, current_seed_json, indent='    ', sort_keys=True, default=str)
        # while True:
        #     winning_game.play()
        break
    with (
        open(validation_results_filepath, 'w') as validation_results_json,
    ):
        json.dump(validation_results, validation_results_json, indent='    ', sort_keys=True, default=str)
