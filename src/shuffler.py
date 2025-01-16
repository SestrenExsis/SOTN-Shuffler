# External libraries
import datetime
import hashlib
import json
import os
import random

# Local libraries
import mapper
import solver

def get_room_drawing(mapper_core, room_name) -> list[str]:
    room = mapper_core['Rooms'][room_name]
    rows = room['Rows']
    cols = room['Columns']
    char = '1'
    if room_name.startswith('Warp Room '):
        char = '5'
    elif 'Save Room' in room_name:
        char = '4'
    elif 'Loading Room' in room_name:
        char = 'c'
    elif 'Fake Room With Teleporter' in room_name:
        char = 'a'
    grid = [['0' for col in range(1 + 4 * cols)] for row in range(1 + 4 * rows)]
    for row in range(rows):
        row_span = 4 if row < (rows - 1) else 3
        for col in range(cols):
            if (row, col) in room['Empty Cells']:
                continue
            col_span = 4 if col < (cols - 1) else 3
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

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py
    '''
    with (
        open(os.path.join('build', 'sandbox', 'rules.json')) as rules_json,
        open(os.path.join('build', 'sandbox', 'skills.json')) as skills_json,
    ):
        mapper_core = mapper.MapperData().get_core()
        rules = json.load(rules_json)
        skills = json.load(skills_json)
        # Keep randomizing until a solution is found
        initial_seed = random.randint(0, 2 ** 64)
        global_rng = random.Random(initial_seed)
        shuffler = {
            'Initial Seed': initial_seed,
            'Start Time': datetime.datetime.now(datetime.timezone.utc),
            'Stages': {},
        }
        while True:
            print('')
            shuffler['Stages'] = {}
            # Randomize
            stages = {}
            stages_to_process = (
                ('Abandoned Mine', global_rng.randint(0, 2 ** 64)),
                ('Alchemy Laboratory', global_rng.randint(0, 2 ** 64)),
                ('Castle Center', global_rng.randint(0, 2 ** 64)),
                ('Castle Keep', global_rng.randint(0, 2 ** 64)),
                ('Castle Entrance', global_rng.randint(0, 2 ** 64)),
                ('Catacombs', global_rng.randint(0, 2 ** 64)),
                ('Clock Tower', global_rng.randint(0, 2 ** 64)),
                ('Colosseum', global_rng.randint(0, 2 ** 64)),
                ('Long Library', global_rng.randint(0, 2 ** 64)),
                ('Marble Gallery', global_rng.randint(0, 2 ** 64)),
                ('Olrox\'s Quarters', global_rng.randint(0, 2 ** 64)),
                ('Outer Wall', global_rng.randint(0, 2 ** 64)),
                ('Royal Chapel', global_rng.randint(0, 2 ** 64)),
                ('Underground Caverns', global_rng.randint(0, 2 ** 64)),
                ('Warp Rooms', global_rng.randint(0, 2 ** 64)),
            )
            print('Randomize with seeds')
            for (stage_name, stage_seed) in stages_to_process:
                stage_rng = random.Random(stage_seed)
                print(stage_name, stage_seed, end=' ')
                directory_listing = os.listdir(os.path.join('build', 'mapper', stage_name))
                file_listing = list(name for name in directory_listing if name.endswith('.json'))
                chosen_file_name = stage_rng.choice(file_listing)
                with open(os.path.join('build', 'mapper', stage_name, chosen_file_name)) as mapper_data_json:
                    mapper_data = json.load(mapper_data_json)
                    mapper_data_json.close()
                stage_map = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
                stage_map.generate()
                stage_map.stage.normalize()
                changes = stage_map.stage.get_changes()
                # print(stage_name, stage_seed)
                assert stage_map.validate()
                hash_of_rooms = hashlib.sha256(json.dumps(changes['Rooms'], sort_keys=True).encode()).hexdigest()
                assert hash_of_rooms == mapper_data['Hash of Rooms']
                stages[stage_name] = stage_map
                print('Prebaked', hash_of_rooms, stage_map.current_seed)
                shuffler['Stages'][stage_name] = {
                    'Note': 'Prebaked',
                    'Attempts': stage_map.attempts,
                    'Generation Start Date': stage_map.start_time.isoformat(),
                    'Generation End Date': stage_map.end_time.isoformat(),
                    # 'Generation Version': GENERATION_VERSION,
                    'Hash of Rooms': hashlib.sha256(json.dumps(changes['Rooms'], sort_keys=True).encode()).hexdigest(),
                    'Seed': stage_map.current_seed,
                    'Stage': stage_name,
                }
            # ...
            # NOTE(sestren): Place Castle Entrance
            current_stage = stages['Castle Entrance'].stage
            # NOTE(sestren): For now, the position of the Castle Entrance stage is restricted by where 'Unknown Room 20' and 'After Drawbridge' can be
            stage_top = 38 - current_stage.rooms['Castle Entrance, After Drawbridge'].top
            stage_left = max(0, 1 - current_stage.rooms['Castle Entrance, Unknown Room 20'].left)
            stage_offsets = {}
            stage_offsets['Castle Entrance'] = (stage_top, stage_left)
            print('Castle Entrance', (stage_top, stage_left))
            # TODO(sestren): Then randomly place down other stages one at a time
            for stage_name in (
                'Alchemy Laboratory',
                'Abandoned Mine',
                'Castle Center',
                'Castle Keep',
                'Catacombs',
                'Clock Tower',
                'Colosseum',
                'Long Library',
                'Marble Gallery',
                'Olrox\'s Quarters',
                'Outer Wall',
                'Royal Chapel',
                'Underground Caverns',
                'Warp Rooms',
            ):
                current_stage = stages[stage_name].stage
                prev_cells = set()
                for (prev_stage_name, (stage_top, stage_left)) in stage_offsets.items():
                    cells = stages[prev_stage_name].stage.get_cells(stage_top, stage_left)
                    prev_cells.union(cells)
                (top, left, bottom, right) = current_stage.get_bounds()
                best_offset = (0, 0, float('inf'))
                for _ in range(1_000):
                    # NOTE(sestren): Randomly pick a stage_top and stage_left that won't put the stage out-of-bounds
                    stage_top = global_rng.randint(0, 57 - bottom)
                    stage_left = global_rng.randint(0, 63 - right)
                    # NOTE(sestren): Reject if it overlaps another stage
                    current_cells = current_stage.get_cells(stage_top, stage_left)
                    if len(current_cells.intersection(prev_cells)) > 0:
                        continue
                    # NOTE(sestren): Keep track of whichever offset minimizes the overall boundary
                    all_cells = current_cells.union(prev_cells)
                    min_row = min((row for (row, col) in all_cells))
                    max_row = max((row for (row, col) in all_cells))
                    min_col = min((col for (row, col) in all_cells))
                    max_col = max((col for (row, col) in all_cells))
                    area = (1 + max_row - min_row) * (1 + max_col - min_col)
                    if area < best_offset[2]:
                        best_offset = (stage_top, stage_left, area)
                stage_top = best_offset[0]
                stage_left = best_offset[1]
                if best_offset[2] >= float('inf'):
                    # NOTE(sestren): All choices above overlapped, so default to assigning randomly instead
                    print(f'{stage_name} stage could not be placed successfully, defaulting to random location')
                    stage_top = global_rng.randint(0, 57 - bottom)
                    stage_left = global_rng.randint(0, 63 - right)
                cells = current_stage.get_cells(stage_top, stage_left)
                prev_cells.union(cells)
                stage_offsets[stage_name] = (stage_top, stage_left)
                print(stage_name, (stage_top, stage_left))
            min_row = min((row for (row, col) in all_cells))
            max_row = max((row for (row, col) in all_cells))
            min_col = min((col for (row, col) in all_cells))
            max_col = max((col for (row, col) in all_cells))
            changes = {
                'Stages': {},
                'Boss Teleporters': {},
                'Castle Map': [],
            }
            # Initialize the castle map drawing grid
            castle_map = [['0' for col in range(256)] for row in range(256)]
            # Process each stage
            for (stage_name, stage_map) in stages.items():
                (stage_top, stage_left) = stage_offsets[stage_name]
                # print()
                # print('stage_name:', stage_name)
                changes['Stages'][stage_name] = {
                    'Rooms': {},
                }
                stage_changes = stage_map.stage.get_changes()
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
                for room_name in stage_changes['Rooms']:
                    room_top = stage_top + stage_changes['Rooms'][room_name]['Top']
                    room_left = stage_left + stage_changes['Rooms'][room_name]['Left']
                    changes['Stages'][stage_name]['Rooms'][room_name] = {
                        'Top': room_top,
                        'Left': room_left,
                    }
                    # Draw room on castle map drawing grid
                    room_drawing = get_room_drawing(mapper_core, room_name)
                    for (room_row, row_data) in enumerate(room_drawing):
                        row = 4 * room_top + room_row
                        for (room_col, char) in enumerate(row_data):
                            col = 4 * room_left + room_col
                            if row >= 256 or col >= 256:
                                print(room_name, (room_top, room_left), (row, col))
                            # if char == '0' and castle_map[row][col] != '0':
                            #     print((row, col), castle_map[row][col])
                            castle_map[row][col] = char
                    # Apply Castle Entrance room positions to Castle Entrance Revisited
                    if stage_name == 'Castle Entrance' and room_name not in (
                        'Castle Entrance, Forest Cutscene',
                        'Castle Entrance, Unknown Room 19',
                        'Castle Entrance, Unknown Room 20',
                    ):
                        revisited_room_name = 'Castle Entrance Revisited, ' + room_name[17:]
                        changes['Stages']['Castle Entrance Revisited']['Rooms'][revisited_room_name] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                    if room_name == 'Colosseum, Arena':
                        # TODO(sestren): Find out why Boss Teleporter to Minotaur and Werewolf does not work
                        changes['Stages']['Boss - Minotaur and Werewolf'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Minotaur and Werewolf']['Rooms']['Boss - Minotaur and Werewolf, Arena'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Minotaur and Werewolf']['Rooms']['Boss - Minotaur and Werewolf, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Minotaur and Werewolf']['Rooms']['Boss - Minotaur and Werewolf, Fake Room With Teleporter B'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        changes['Boss Teleporters']['5'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Boss Teleporters']['6'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                    elif room_name == 'Abandoned Mine, Cerberus Room':
                        changes['Stages']['Boss - Cerberus'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Cerberus']['Rooms']['Boss - Cerberus, Cerberus Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Cerberus']['Rooms']['Boss - Cerberus, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Cerberus']['Rooms']['Boss - Cerberus, Fake Room With Teleporter B'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        changes['Boss Teleporters']['13'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Boss Teleporters']['14'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                    elif room_name == 'Outer Wall, Doppelganger Room':
                        # TODO(sestren): Find out why Boss Teleporter to Doppelganger 10 does not work
                        changes['Stages']['Boss - Doppelganger 10'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Doppelganger 10']['Rooms']['Boss - Doppelganger 10, Doppelganger Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Doppelganger 10']['Rooms']['Boss - Doppelganger 10, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Doppelganger 10']['Rooms']['Boss - Doppelganger 10, Fake Room With Teleporter B'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        changes['Boss Teleporters']['8'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Boss Teleporters']['9'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                    elif room_name == 'Royal Chapel, Hippogryph Room':
                        changes['Stages']['Boss - Hippogryph'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Hippogryph']['Rooms']['Boss - Hippogryph, Hippogryph Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Hippogryph']['Rooms']['Boss - Hippogryph, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Hippogryph']['Rooms']['Boss - Hippogryph, Fake Room With Teleporter B'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        changes['Boss Teleporters']['10'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Boss Teleporters']['11'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                    elif room_name == 'Olrox\'s Quarters, Olrox\'s Room':
                        changes['Stages']['Boss - Olrox'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Olrox']['Rooms']['Boss - Olrox, Olrox\'s Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Olrox']['Rooms']['Boss - Olrox, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Olrox']['Rooms']['Boss - Olrox, Fake Room With Teleporter B'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        # NOTE(sestren): There is only one boss teleporter in the game data for Olrox, despite there being two entrances, so one of the entrances will not be covered
                        changes['Boss Teleporters']['3'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                    elif room_name == 'Catacombs, Granfaloon\'s Lair':
                        changes['Stages']['Boss - Granfaloon'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Granfaloon']['Rooms']['Boss - Granfaloon, Granfaloon\'s Lair'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Granfaloon']['Rooms']['Boss - Granfaloon, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Granfaloon']['Rooms']['Boss - Granfaloon, Fake Room With Teleporter B'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        # NOTE(sestren): There is only one boss teleporter in the game data for Olrox, despite there being two entrances, so one of the entrances will not be covered
                        changes['Boss Teleporters']['4'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                    elif room_name == 'Underground Caverns, Scylla Wyrm Room':
                        changes['Stages']['Boss - Scylla'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Scylla']['Rooms']['Boss - Scylla, Scylla Wyrm Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Scylla']['Rooms']['Boss - Scylla, Fake Room With Teleporter A'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Scylla']['Rooms']['Boss - Scylla, Rising Water Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                        changes['Stages']['Boss - Scylla']['Rooms']['Boss - Scylla, Scylla Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'] - 1,
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 1,
                        }
                        changes['Stages']['Boss - Scylla']['Rooms']['Boss - Scylla, Crystal Cloak Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'] - 1,
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Boss Teleporters']['7'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'],
                        }
                    elif room_name == 'Castle Keep, Keep Area':
                        changes['Stages']['Boss - Richter'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Richter']['Rooms']['Boss - Richter, Throne Room'] = {
                            'Top': stage_top + stage_changes['Rooms'][room_name]['Top'] + 3,
                            'Left': stage_left + stage_changes['Rooms'][room_name]['Left'] + 3,
                        }
                        changes['Boss Teleporters']['12'] = {
                            'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'] + 3,
                            'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'] + 3,
                        }
                    # TODO(sestren): Find where the MAR overlay is and patch the Maria Cutscene
                    # elif room_name == 'Marble Gallery, Clock Room':
                    #     changes['Stages']['Cutscene - Maria'] = {
                    #         'Rooms': {},
                    #     }
                    #     changes['Stages']['Cutscene - Maria']['Rooms']['Cutscene - Maria, Clock Room'] = {
                    #         'Top': stage_top + stage_changes['Rooms'][room_name]['Top'],
                    #         'Left': stage_left + stage_changes['Rooms'][room_name]['Left'],
                    #     }
                    #     changes['Boss Teleporters']['0'] = {
                    #         'Room Y': stage_top + stage_changes['Rooms'][room_name]['Top'],
                    #         'Room X': stage_left + stage_changes['Rooms'][room_name]['Left'],
                    #     }
            # Apply castle map drawing grid to changes
            changes['Castle Map'] = []
            for row in range(len(castle_map)):
                row_data = ''.join(castle_map[row])
                changes['Castle Map'].append(row_data)
            # with open(os.path.join('build', 'sandbox', 'debug-changes.json'), 'w') as debug_changes_json:
            #     json.dump(changes, debug_changes_json, indent='    ', sort_keys=True, default=str)
            print('Require that reaching all shuffled stages in a reasonable amount of steps is possible')
            # TODO(sestren): Add all vanilla stages to logic
            logic_core = mapper.LogicCore(mapper_core, changes).get_core()
            logic_core['Goals'] = {
                # 'Debug': {
                #     'Location': 'Castle Entrance, After Drawbridge',
                # },
                'Exploration': {
                    'Stages Visited': {
                        'All': {
                            'Abandoned Mine': True,
                            'Alchemy Laboratory': True,
                            'Castle Center': True,
                            'Castle Entrance': True,
                            'Castle Entrance Revisited': True,
                            'Castle Keep': True,
                            'Catacombs': True,
                            'Clock Tower': True,
                            'Colosseum': True,
                            'Long Library': True,
                            'Marble Gallery': True,
                            'Olrox\'s Quarters': True,
                            'Outer Wall': True,
                            'Royal Chapel': True,
                            'Underground Caverns': True,
                            'Warp Rooms': True,
                        }
                    },
                },
                'Bad Ending': {
                    'Status - Richter Defeated': True,
                },
                'WIP: Good Ending': {
                    'Relic - Jewel of Open': True,
                    'Relic - Leap Stone': True,
                    'Relic - Form of Mist': True,
                    'Relic - Soul of Bat': True,
                    'Relic - Echo of Bat': True,
                    'Item - Spike Breaker': {
                        'Minimum': 1,
                    },
                    'Item - Silver Ring': {
                        'Minimum': 1,
                    },
                    'Item - Gold Ring': {
                        'Minimum': 1,
                    },
                    'Item - Holy Glasses': {
                        'Minimum': 1,
                    },
                    'Status - Richter Saved': True,
                    # 'Relic - Ring of Vlad': True,
                    # 'Relic - Heart of Vlad': True,
                    # 'Relic - Tooth of Vlad': True,
                    # 'Relic - Rib of Vlad': True,
                    # 'Relic - Eye of Vlad': True,
                    # 'Status - Dracula Defeated': True,
                },
            }
            # with open(os.path.join('build', 'debug', 'logic-core.json'), 'w') as debug_logic_core_json:
            #     json.dump(logic_core, debug_logic_core_json, indent='    ', sort_keys=True, default=str)
            map_solver = solver.Solver(logic_core, skills)
            map_solver.debug = True
            # map_solver.solve_via_steps(4999, 9999)
            map_solver.solve_via_random_exploration(1, 29_999)
            if len(map_solver.results['Wins']) > 0:
                (winning_layers, winning_game) = map_solver.results['Wins'][-1]
                print('-------------')
                print('GOAL REACHED: Layer', winning_layers)
                # print('History')
                # for (layer, location, command_name) in winning_game.history:
                #     print('-', layer, location, ':', command_name)
                # print('State')
                # for (key, value) in winning_game.current_state.items():
                #     print('-', key, ':', value)
                print('-------------')
                solution = {
                    'History': winning_game.history,
                    'Final Layer': winning_layers,
                    'Final State': winning_game.current_state,
                    'Cycles': map_solver.cycle_count,
                    'Goals Achieved': winning_game.goals_achieved,
                }
                shuffler['End Time'] = datetime.datetime.now(datetime.timezone.utc)
                current_seed = {
                    'Data Core': mapper_core,
                    'Logic Core': logic_core,
                    'Shuffler': shuffler,
                    'Solver': solution,
                    'Changes': changes,
                }
                with open(os.path.join('build', 'shuffler', 'current-seed.json'), 'w') as current_seed_json:
                    json.dump(current_seed, current_seed_json, indent='    ', sort_keys=True, default=str)
                # while True:
                #     winning_game.play()
                break
