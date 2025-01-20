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
                directory_listing = os.listdir(os.path.join('build', 'mapper-vetted', stage_name))
                file_listing = list(name for name in directory_listing if name.endswith('.json'))
                chosen_file_name = stage_rng.choice(file_listing)
                with open(os.path.join('build', 'mapper-vetted', stage_name, chosen_file_name)) as mapper_data_json:
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
            stage_offsets = {}
            # NOTE(sestren): Place Castle Entrance
            current_stage = stages['Castle Entrance'].stage
            # NOTE(sestren): For now, the position of the Castle Entrance stage is restricted by where 'Unknown Room 20' and 'After Drawbridge' can be
            stage_top = 38 - current_stage.rooms['Castle Entrance, After Drawbridge'].top
            stage_left = max(0, 1 - current_stage.rooms['Castle Entrance, Unknown Room 20'].left)
            stage_offsets['Castle Entrance'] = (stage_top, stage_left)
            print('Castle Entrance', (stage_top, stage_left))
            # NOTE(sestren): Place Warp Rooms
            current_stage = stages['Warp Rooms'].stage
            # NOTE(sestren): For now, the position of the Warp Rooms stage must be in its vanilla location
            stage_top = 12 - current_stage.rooms['Warp Rooms, Warp Room A'].top
            stage_left = max(0, 40 - current_stage.rooms['Warp Rooms, Warp Room A'].left)
            stage_offsets['Warp Rooms'] = (stage_top, stage_left)
            print('Warp Rooms', (stage_top, stage_left))
            # TODO(sestren): Then randomly place down other stages one at a time
            stage_names = [
                'Abandoned Mine',
                'Alchemy Laboratory',
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
            ]
            valid_ind = False
            global_rng.shuffle(stage_names)
            for (i, stage_name) in enumerate(stage_names):
                current_stage = stages[stage_name].stage
                prev_cells = set()
                for (prev_stage_name, (stage_top, stage_left)) in stage_offsets.items():
                    cells = stages[prev_stage_name].stage.get_cells(stage_top, stage_left)
                    prev_cells = prev_cells.union(cells)
                print('')
                print(i, len(prev_cells))
                for row in range(64):
                    row_data = []
                    for col in range(64):
                        cell = '.'
                        if (row, col) in prev_cells:
                            cell = '#'
                        row_data.append(cell)
                    print(''.join(row_data))
                print('')
                (top, left, bottom, right) = current_stage.get_bounds()
                best_area = float('inf')
                best_stage_offsets = []
                for stage_top in range(5, 56 - bottom):
                    for stage_left in range(0, 63 - right):
                        # NOTE(sestren): Reject if it overlaps another stage
                        current_cells = current_stage.get_cells(stage_top, stage_left)
                        if len(current_cells.intersection(prev_cells)) > 0:
                            continue
                        all_cells = current_cells.union(prev_cells) - stages['Warp Rooms'].stage.get_cells(stage_offsets['Warp Rooms'][0], stage_offsets['Warp Rooms'][1])
                        min_row = min((row for (row, col) in all_cells))
                        max_row = max((row for (row, col) in all_cells))
                        min_col = min((col for (row, col) in all_cells))
                        max_col = max((col for (row, col) in all_cells))
                        area = (1 + max_row - min_row) * (1 + max_col - min_col)
                        # NOTE(sestren): Keep track of whichever offset minimizes the overall area
                        if area < best_area:
                            best_stage_offsets = []
                            best_area = area
                        if area == best_area:
                            best_stage_offsets.append((stage_top, stage_left))
                if best_area >= float('inf'):
                    print(f'ERROR: {stage_name} stage could not be placed successfully')
                    break
                (stage_top, stage_left) = global_rng.choice(best_stage_offsets)
                cells = current_stage.get_cells(stage_top, stage_left)
                prev_cells.union(cells)
                stage_offsets[stage_name] = (stage_top, stage_left)
                print(stage_name, (stage_top, stage_left))
            else:
                valid_ind = True
            if not valid_ind:
                continue
            print('')
            print(len(prev_cells))
            for row in range(64):
                row_data = []
                for col in range(64):
                    cell = '.'
                    if (row, col) in prev_cells:
                        cell = '#'
                    row_data.append(cell)
                print(''.join(row_data))
            print('')
            changes = {
                'Boss Teleporters': {},
                'Castle Map': [],
                'Constants': {},
                'Stages': {},
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
                    room_drawing = None
                    if 'Alternate Map' in mapper_core['Rooms'][room_name]:
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
                # TODO(sestren): Handle rotating boss stages for Inverted Castle
                # TODO(sestren): Add Boss - Doppelganger 40 to Inverted Castle (Scylla Worm Room)
                # TODO(sestren): Add Boss - Beelzebub to Inverted Castle (Slogra and Gaibon Room)
                'Abandoned Mine': 'Cave',
                'Alchemy Laboratory': 'Necromancy Laboratory',
                # 'Boss - Cerberus': 'Boss - Death',
                # 'Boss - Doppelganger 10': 'Boss - Creature',
                # 'Boss - Granfaloon': 'Boss - Galamoth',
                # 'Boss - Hippogryph': 'Boss - Medusa',
                # 'Boss - Minotaur and Werewolf': 'Boss - Trio',
                # 'Boss - Olrox': 'Boss - Akmodon II',
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
                # break
                # TODO(sestren): Figure out how to get room transitions in Inverted Castle to work
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
            # Move the Minotaur and Werewolf Boss stage to match Colosseum, Arena
            source_top = changes['Stages']['Colosseum']['Rooms']['Colosseum, Arena']['Top']
            source_left = changes['Stages']['Colosseum']['Rooms']['Colosseum, Arena']['Left']
            changes['Stages']['Boss - Minotaur and Werewolf'] = {
                'Rooms': {
                    'Boss - Minotaur and Werewolf, Arena': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Minotaur and Werewolf, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Boss - Minotaur and Werewolf, Fake Room With Teleporter B': {
                        'Top': source_top,
                        'Left': source_left + 2,
                    },
                },
            }
            changes['Boss Teleporters']['5'] = {
                'Room Y': source_top,
                'Room X': source_left,
            }
            changes['Boss Teleporters']['6'] = {
                'Room Y': source_top,
                'Room X': source_left + 1,
            }
            # Move the Cerberus Boss stage to match Abandoned Mine, Cerberus Room
            source_top = changes['Stages']['Abandoned Mine']['Rooms']['Abandoned Mine, Cerberus Room']['Top']
            source_left = changes['Stages']['Abandoned Mine']['Rooms']['Abandoned Mine, Cerberus Room']['Left']
            changes['Stages']['Boss - Cerberus'] = {
                'Rooms': {
                    'Boss - Cerberus, Cerberus Room': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Cerberus, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Boss - Cerberus, Fake Room With Teleporter B': {
                        'Top': source_top,
                        'Left': source_left + 2,
                    },
                },
            }
            changes['Boss Teleporters']['13'] = {
                'Room Y': source_top,
                'Room X': source_left,
            }
            changes['Boss Teleporters']['14'] = {
                'Room Y': source_top,
                'Room X': source_left + 1,
            }
            # Move the Doppelganger 10 Boss stage to match Outer Wall, Doppelganger Room
            source_top = changes['Stages']['Outer Wall']['Rooms']['Outer Wall, Doppelganger Room']['Top']
            source_left = changes['Stages']['Outer Wall']['Rooms']['Outer Wall, Doppelganger Room']['Left']
            changes['Stages']['Boss - Doppelganger 10'] = {
                'Rooms': {
                    'Boss - Doppelganger 10, Doppelganger Room': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Doppelganger 10, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Boss - Doppelganger 10, Fake Room With Teleporter B': {
                        'Top': source_top,
                        'Left': source_left + 2,
                    },
                },
            }
            changes['Boss Teleporters']['8'] = {
                'Room Y': source_top,
                'Room X': source_left,
            }
            changes['Boss Teleporters']['9'] = {
                'Room Y': source_top,
                'Room X': source_left + 1,
            }
            # Move the Hippogryph Boss stage to match Royal Chapel, Hippogryph Room
            source_top = changes['Stages']['Royal Chapel']['Rooms']['Royal Chapel, Hippogryph Room']['Top']
            source_left = changes['Stages']['Royal Chapel']['Rooms']['Royal Chapel, Hippogryph Room']['Left']
            changes['Stages']['Boss - Hippogryph'] = {
                'Rooms': {
                    'Boss - Hippogryph, Hippogryph Room': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Hippogryph, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Boss - Hippogryph, Fake Room With Teleporter B': {
                        'Top': source_top,
                        'Left': source_left + 2,
                    },
                },
            }
            changes['Boss Teleporters']['10'] = {
                'Room Y': source_top,
                'Room X': source_left,
            }
            changes['Boss Teleporters']['11'] = {
                'Room Y': source_top,
                'Room X': source_left + 1,
            }
            # Move the Olrox Boss stage to match Olrox's Quarters, Olrox's Room
            source_top = changes['Stages']['Olrox\'s Quarters']['Rooms']['Olrox\'s Quarters, Olrox\'s Room']['Top']
            source_left = changes['Stages']['Olrox\'s Quarters']['Rooms']['Olrox\'s Quarters, Olrox\'s Room']['Left']
            changes['Stages']['Boss - Olrox'] = {
                'Rooms': {
                    'Boss - Olrox, Olrox\'s Room': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Olrox, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Boss - Olrox, Fake Room With Teleporter B': {
                        'Top': source_top,
                        'Left': source_left + 2,
                    },
                },
            }
            # NOTE(sestren): There is only one boss teleporter in the game data for Olrox, despite there being two entrances, so one of the entrances will not be covered
            # changes['Boss Teleporters']['XXX'] = {
            #     'Room Y': source_top,
            #     'Room X': source_left,
            # }
            changes['Boss Teleporters']['3'] = {
                'Room Y': source_top,
                'Room X': source_left + 1,
            }
            # Move the Granfaloon Boss stage to match Catacombs, Granfaloon's Lair
            source_top = changes['Stages']['Catacombs']['Rooms']['Catacombs, Granfaloon\'s Lair']['Top']
            source_left = changes['Stages']['Catacombs']['Rooms']['Catacombs, Granfaloon\'s Lair']['Left']
            changes['Stages']['Boss - Granfaloon'] = {
                'Rooms': {
                    'Boss - Granfaloon, Granfaloon\'s Lair': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Granfaloon, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left + 2,
                    },
                    'Boss - Granfaloon, Fake Room With Teleporter B': {
                        'Top': source_top + 1,
                        'Left': source_left - 1,
                    },
                },
            }
            changes['Boss Teleporters']['4'] = {
                'Room Y': source_top,
                'Room X': source_left + 1,
            }
            # NOTE(sestren): There is only one boss teleporter in the game data for Granfaloon, despite there being two entrances, so one of the entrances will not be covered
            # changes['Boss Teleporters']['XXX'] = {
            #     'Room Y': source_top + 1,
            #     'Room X': source_left,
            # }
            # Move the Scylla Boss stage to match Underground Caverns, Scylla Wyrm Room
            source_top = changes['Stages']['Underground Caverns']['Rooms']['Underground Caverns, Scylla Wyrm Room']['Top']
            source_left = changes['Stages']['Underground Caverns']['Rooms']['Underground Caverns, Scylla Wyrm Room']['Left']
            changes['Stages']['Boss - Scylla'] = {
                'Rooms': {
                    'Boss - Scylla, Scylla Wyrm Room': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Boss - Scylla, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Boss - Scylla, Rising Water Room': {
                        'Top': source_top,
                        'Left': source_left + 1,
                    },
                    'Boss - Scylla, Scylla Room': {
                        'Top': source_top - 1,
                        'Left': source_left + 1,
                    },
                    'Boss - Scylla, Crystal Cloak Room': {
                        'Top': source_top - 1,
                        'Left': source_left,
                    },
                },
            }
            changes['Boss Teleporters']['7'] = {
                'Room Y': source_top,
                'Room X': source_left,
            }
            # Move both the Richter Boss stage and castle teleporter to match Castle Keep, Keep Area
            source_top = changes['Stages']['Castle Keep']['Rooms']['Castle Keep, Keep Area']['Top']
            source_left = changes['Stages']['Castle Keep']['Rooms']['Castle Keep, Keep Area']['Left']
            changes['Stages']['Boss - Richter'] = {
                'Rooms': {
                    'Boss - Richter, Throne Room': {
                        'Top': source_top + 3,
                        'Left': source_left + 3,
                    },
                },
            }
            changes['Boss Teleporters']['12'] = {
                'Room Y': source_top + 3,
                'Room X': source_left + 3,
            }
            changes['Constants']['Castle Teleporter, Y Offset'] = -1 * (source_top * 256 + 847)
            changes['Constants']['Castle Teleporter, X Offset'] = -1 * (source_left * 256 + 320)
            # Move the Meeting Maria in Clock Room Cutscene stage to match Marble Gallery, Clock Room
            source_top = changes['Stages']['Marble Gallery']['Rooms']['Marble Gallery, Clock Room']['Top']
            source_left = changes['Stages']['Marble Gallery']['Rooms']['Marble Gallery, Clock Room']['Left']
            changes['Stages']['Cutscene - Meeting Maria in Clock Room'] = {
                'Rooms': {
                    'Cutscene - Meeting Maria in Clock Room, Clock Room': {
                        'Top': source_top,
                        'Left': source_left,
                    },
                    'Cutscene - Meeting Maria in Clock Room, Fake Room With Teleporter A': {
                        'Top': source_top,
                        'Left': source_left - 1,
                    },
                    'Cutscene - Meeting Maria in Clock Room, Fake Room With Teleporter B': {
                        'Top': source_top,
                        'Left': source_left + 1,
                    },
                },
            }
            changes['Boss Teleporters']['0'] = {
                'Room Y': source_top,
                'Room X': source_left,
            }
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
