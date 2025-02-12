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
                hash_of_rooms = hashlib.sha256(json.dumps(changes['Rooms'], sort_keys=True).encode()).hexdigest()
                print('Prebaked', hash_of_rooms, stage_map.current_seed)
                assert stage_map.validate()
                assert hash_of_rooms == mapper_data['Hash of Rooms']
                stages[stage_name] = stage_map
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
            stage_offsets = {}
            # NOTE(sestren): Place Castle Entrance
            # NOTE(sestren): For now, the position of the Castle Entrance stage is restricted by where 'Unknown Room 20' and 'After Drawbridge' can be
            current_stage = stages['Castle Entrance'].stage
            stage_top = 38 - current_stage.rooms['Castle Entrance, After Drawbridge'].top
            stage_left = max(0, 1 - current_stage.rooms['Castle Entrance, Unknown Room 20'].left)
            stage_offsets['Castle Entrance'] = (stage_top, stage_left)
            # print('Castle Entrance', (stage_top, stage_left))
            # NOTE(sestren): Place Underground Caverns
            # NOTE(sestren): For now, the position of the Underground Caverns stage is restricted by where 'False Save Room' can be
            current_stage = stages['Underground Caverns'].stage
            stage_top = 33 - current_stage.rooms['Underground Caverns, False Save Room'].top
            stage_left = 45 - current_stage.rooms['Underground Caverns, False Save Room'].left
            stage_offsets['Underground Caverns'] = (stage_top, stage_left)
            # print('Underground Caverns', (stage_top, stage_left))
            # NOTE(sestren): Place Warp Rooms
            # NOTE(sestren): For now, the position of the Warp Rooms stage must be in its vanilla location
            current_stage = stages['Warp Rooms'].stage
            stage_top = 12 - current_stage.rooms['Warp Rooms, Warp Room A'].top
            stage_left = max(0, 40 - current_stage.rooms['Warp Rooms, Warp Room A'].left)
            stage_offsets['Warp Rooms'] = (stage_top, stage_left)
            # print('Warp Rooms', (stage_top, stage_left))
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
                # 'Underground Caverns',
            ]
            valid_ind = False
            global_rng.shuffle(stage_names)
            for (i, stage_name) in enumerate(stage_names):
                current_stage = stages[stage_name].stage
                prev_cells = set()
                for (prev_stage_name, (stage_top, stage_left)) in stage_offsets.items():
                    cells = stages[prev_stage_name].stage.get_cells(stage_top, stage_left)
                    prev_cells = prev_cells.union(cells)
                # print('')
                # print(i, len(prev_cells))
                # for row in range(64):
                #     row_data = []
                #     for col in range(64):
                #         cell = '.'
                #         if (row, col) in prev_cells:
                #             cell = '#'
                #         row_data.append(cell)
                #     print(''.join(row_data))
                # print('')
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
                    # print(f'ERROR: {stage_name} stage could not be placed successfully')
                    break
                (stage_top, stage_left) = global_rng.choice(best_stage_offsets)
                cells = current_stage.get_cells(stage_top, stage_left)
                prev_cells.union(cells)
                stage_offsets[stage_name] = (stage_top, stage_left)
                # print(stage_name, (stage_top, stage_left))
            else:
                valid_ind = True
            if not valid_ind:
                continue
            # print('')
            # print(len(prev_cells))
            # for row in range(64):
            #     row_data = []
            #     for col in range(64):
            #         cell = '.'
            #         if (row, col) in prev_cells:
            #             cell = '#'
            #         row_data.append(cell)
            #     print(''.join(row_data))
            # print('')
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
            # Move the Meeting Maria in Clock Room Cutscene stage to match Marble Gallery, Clock Room
            source_room = changes['Stages']['Marble Gallery']['Rooms']['Marble Gallery, Clock Room']
            changes['Stages']['Cutscene - Meeting Maria in Clock Room'] = {
                'Rooms': {
                    'Cutscene - Meeting Maria in Clock Room, Clock Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Cutscene - Meeting Maria in Clock Room, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Cutscene - Meeting Maria in Clock Room, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 1,
                    },
                },
            }
            # Move the Olrox Boss stage to match Olrox's Quarters, Olrox's Room
            source_room = changes['Stages']['Olrox\'s Quarters']['Rooms']['Olrox\'s Quarters, Olrox\'s Room']
            changes['Stages']['Boss - Olrox'] = {
                'Rooms': {
                    'Boss - Olrox, Olrox\'s Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Olrox, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Olrox, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Granfaloon Boss stage to match Catacombs, Granfaloon's Lair
            source_room = changes['Stages']['Catacombs']['Rooms']['Catacombs, Granfaloon\'s Lair']
            changes['Stages']['Boss - Granfaloon'] = {
                'Rooms': {
                    'Boss - Granfaloon, Granfaloon\'s Lair': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Granfaloon, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                    'Boss - Granfaloon, Fake Room With Teleporter B': {
                        'Top': source_room['Top'] + 1,
                        'Left': source_room['Left'] - 1,
                    },
                },
            }
            # Move the Minotaur and Werewolf Boss stage to match Colosseum, Arena
            source_room = changes['Stages']['Colosseum']['Rooms']['Colosseum, Arena']
            changes['Stages']['Boss - Minotaur and Werewolf'] = {
                'Rooms': {
                    'Boss - Minotaur and Werewolf, Arena': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Minotaur and Werewolf, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Minotaur and Werewolf, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Scylla Boss stage to match Underground Caverns, Scylla Wyrm Room
            source_room = changes['Stages']['Underground Caverns']['Rooms']['Underground Caverns, Scylla Wyrm Room']
            changes['Stages']['Boss - Scylla'] = {
                'Rooms': {
                    'Boss - Scylla, Scylla Wyrm Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Scylla, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Scylla, Rising Water Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 1,
                    },
                    'Boss - Scylla, Scylla Room': {
                        'Top': source_room['Top'] - 1,
                        'Left': source_room['Left'] + 1,
                    },
                    'Boss - Scylla, Crystal Cloak Room': {
                        'Top': source_room['Top'] - 1,
                        'Left': source_room['Left'],
                    },
                },
            }
            # Move the Doppelganger 10 Boss stage to match Outer Wall, Doppelganger Room
            source_room = changes['Stages']['Outer Wall']['Rooms']['Outer Wall, Doppelganger Room']
            changes['Stages']['Boss - Doppelganger 10'] = {
                'Rooms': {
                    'Boss - Doppelganger 10, Doppelganger Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Doppelganger 10, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Doppelganger 10, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Hippogryph Boss stage to match Royal Chapel, Hippogryph Room
            source_room = changes['Stages']['Royal Chapel']['Rooms']['Royal Chapel, Hippogryph Room']
            changes['Stages']['Boss - Hippogryph'] = {
                'Rooms': {
                    'Boss - Hippogryph, Hippogryph Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Hippogryph, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Hippogryph, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Richter Boss stage and castle teleporter to match Castle Keep, Keep Area
            source_room = changes['Stages']['Castle Keep']['Rooms']['Castle Keep, Keep Area']
            changes['Stages']['Boss - Richter'] = {
                'Rooms': {
                    'Boss - Richter, Throne Room': {
                        'Top': source_room['Top'] + 3,
                        'Left': source_room['Left'] + 3,
                    },
                },
            }
            changes['Constants']['Castle Teleporter, Y Offset'] = -1 * (256 * source_room['Top'] + 847)
            changes['Constants']['Castle Teleporter, X Offset'] = -1 * (256 * source_room['Left'] + 320)
            # Move the Cerberus Boss stage to match Abandoned Mine, Cerberus Room
            source_room = changes['Stages']['Abandoned Mine']['Rooms']['Abandoned Mine, Cerberus Room']
            changes['Stages']['Boss - Cerberus'] = {
                'Rooms': {
                    'Boss - Cerberus, Cerberus Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Cerberus, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Cerberus, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Trio Boss stage to match Reverse Colosseum, Arena
            source_room = changes['Stages']['Reverse Colosseum']['Rooms']['Reverse Colosseum, Arena']
            changes['Stages']['Boss - Trio'] = {
                'Rooms': {
                    'Boss - Trio, Arena': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Trio, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Trio, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Beelzebub Boss stage to match Necromancy Laboratory, Slogra and Gaibon Room
            source_room = changes['Stages']['Necromancy Laboratory']['Rooms']['Necromancy Laboratory, Slogra and Gaibon Room']
            changes['Stages']['Boss - Beelzebub'] = {
                'Rooms': {
                    'Boss - Beelzebub, Slogra and Gaibon Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Beelzebub, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Beelzebub, Fake Room With Teleporter B': {
                        'Top': source_room['Top'] + 1,
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Beelzebub, Fake Room With Teleporter C': {
                        'Top': source_room['Top'] + 1,
                        'Left': source_room['Left'] + 4,
                    },
                },
            }
            # Move the Death Boss stage to match Cave, Cerberus Room
            source_room = changes['Stages']['Cave']['Rooms']['Cave, Cerberus Room']
            changes['Stages']['Boss - Death'] = {
                'Rooms': {
                    'Boss - Death, Cerberus Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Death, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Death, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Medusa Boss stage to match Anti-Chapel, Hippogryph Room
            source_room = changes['Stages']['Anti-Chapel']['Rooms']['Anti-Chapel, Hippogryph Room']
            changes['Stages']['Boss - Medusa'] = {
                'Rooms': {
                    'Boss - Medusa, Hippogryph Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Medusa, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Medusa, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Creature Boss stage to match Reverse Outer Wall, Doppelganger Room
            source_room = changes['Stages']['Reverse Outer Wall']['Rooms']['Reverse Outer Wall, Doppelganger Room']
            changes['Stages']['Boss - Creature'] = {
                'Rooms': {
                    'Boss - Creature, Doppelganger Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Creature, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Creature, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Doppelganger 40 Boss stage to match Reverse Caverns, Scylla Wyrm Room
            source_room = changes['Stages']['Reverse Caverns']['Rooms']['Reverse Caverns, Scylla Wyrm Room']
            changes['Stages']['Boss - Doppelganger 40'] = {
                'Rooms': {
                    'Boss - Doppelganger 40, Scylla Wyrm Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Doppelganger 40, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Doppelganger 40, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 1,
                    },
                },
            }
            # Move the Akmodan II Boss stage to match Olrox's Quarters, Olrox's Room
            source_room = changes['Stages']['Death Wing\'s Lair']['Rooms']['Death Wing\'s Lair, Olrox\'s Room']
            changes['Stages']['Boss - Akmodan II'] = {
                'Rooms': {
                    'Boss - Akmodan II, Olrox\'s Room': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Akmodan II, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] - 1,
                    },
                    'Boss - Akmodan II, Fake Room With Teleporter B': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                },
            }
            # Move the Galamoth Boss stage to match Floating Catacombs, Granfaloon's Lair
            source_room = changes['Stages']['Floating Catacombs']['Rooms']['Floating Catacombs, Granfaloon\'s Lair']
            changes['Stages']['Boss - Galamoth'] = {
                'Rooms': {
                    'Boss - Galamoth, Granfaloon\'s Lair': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'],
                    },
                    'Boss - Galamoth, Fake Room With Teleporter A': {
                        'Top': source_room['Top'],
                        'Left': source_room['Left'] + 2,
                    },
                    'Boss - Galamoth, Fake Room With Teleporter B': {
                        'Top': source_room['Top'] + 1,
                        'Left': source_room['Left'] - 1,
                    },
                },
            }
            # Assign boss teleporter locations to their counterparts in the castle
            # NOTE(sestren): There is only one boss teleporter in the game data for the following bosses,
            # NOTE(sestren): despite there being multiple entrances, so not all entrances will be covered:
            # NOTE(sestren): - Granfaloon
            # NOTE(sestren): - Akmodan II
            # NOTE(sestren): - Olrox
            # NOTE(sestren): - Galamoth
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
                '26': ('Death Wing\'s Lair', 'Death Wing\'s Lair, Olrox\'s Room', 1, 1), # Boss - Akmodan II
                '27': ('Floating Catacombs', 'Floating Catacombs, Granfaloon\'s Lair', 1, 0), # Boss - Galamoth
            }
            for (boss_teleporter_id, (stage_name, room_name, offset_top, offset_left)) in boss_teleporters.items():
                source_room = changes['Stages'][stage_name]['Rooms'][room_name]
                changes['Boss Teleporters'][boss_teleporter_id] = {
                    'Room Y': source_room['Top'] + offset_top,
                    'Room X': source_room['Left'] + offset_left,
                }
            # Apply castle map drawing grid to changes
            changes['Castle Map'] = []
            for row in range(len(castle_map)):
                row_data = ''.join(castle_map[row])
                changes['Castle Map'].append(row_data)
            print('Require that all goals are met')
            logic_core = mapper.LogicCore(mapper_core, changes).get_core()
            stage_validations = {
                'Abandoned Mine': {
                    'Loading Room C with Soul of Bat -> Loading Room A': {
                        'State': {
                            'Location': 'Abandoned Mine, Loading Room C',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Reach Catacombs': {
                                'Locations Visited': {
                                    'All': {
                                        'Abandoned Mine, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room C with Soul of Bat -> Cerberus Room': {
                        'State': {
                            'Location': 'Abandoned Mine, Loading Room C',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Reach Catacombs': {
                                'Locations Visited': {
                                    'All': {
                                        'Abandoned Mine, Cerberus Room (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Alchemy Laboratory': {
                    'Loading Room A with Jewel of Open -> Loading Room B': {
                        'State': {
                            'Location': 'Alchemy Laboratory, Loading Room A',
                            'Section': 'Main',
                            'Relic - Jewel of Open': True,
                            'Progression - Unlock Blue Doors': True,
                        },
                        'Goals': {
                            'Reach Royal Chapel': {
                                'Locations Visited': {
                                    'All': {
                                        'Alchemy Laboratory, Loading Room B (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room C with Soul of Bat and Jewel of Open -> Slogra and Gaibon Room': {
                        'State': {
                            'Location': 'Alchemy Laboratory, Loading Room C',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                            'Relic - Jewel of Open': True,
                            'Progression - Unlock Blue Doors': True,
                        },
                        'Goals': {
                            'Reach Slogra and Gaibon': {
                                'Locations Visited': {
                                    'All': {
                                        'Alchemy Laboratory, Slogra and Gaibon Room (Ground)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room C -> Loading Room A': {
                        'State': {
                            'Location': 'Alchemy Laboratory, Loading Room C',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Reach Marble Gallery': {
                                'Locations Visited': {
                                    'All': {
                                        'Alchemy Laboratory, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Castle Center': {
                    'Elevator Shaft -> Holy Glasses': {
                        'State': {
                            'Location': 'Castle Center, Elevator Shaft',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Get Holy Glasses': {
                                'Item - Holy Glasses': {
                                    'Minimum': 1,
                                },
                            },
                        },
                    },
                },
                'Castle Entrance': {
                    'Start -> Loading Room C': {
                        'State': {
                            'Location': 'Castle Entrance, After Drawbridge',
                            'Section': 'Ground',
                        },
                        'Goals': {
                            'Reach Alchemy Laboratory': {
                                'Locations Visited': {
                                    'All': {
                                        'Castle Entrance, Loading Room C (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Castle Keep': {
                    'Loading Room A with Soul of Bat and Holy Glasses -> Save Richter': {
                        'State': {
                            'Location': 'Castle Keep, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                            'Item - Holy Glasses': 1,
                        },
                        'Goals': {
                            'Save Richter': {
                                'Status - Richter Saved': True,
                            },
                        },
                    },
                    'Loading Room C -> Leap Stone -> Loading Room C': {
                        'State': {
                            'Location': 'Castle Keep, Loading Room C',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Get Leap Stone and Return to Royal Chapel': {
                                'Relic - Leap Stone': True,
                                'Progression - Double Jump': True,
                                'Locations Visited': {
                                    'All': {
                                        'Castle Keep, Loading Room C (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Catacombs': {
                    'Loading Room A with Soul of Bat and Echo of Bat -> Spike Breaker': {
                        'State': {
                            'Location': 'Catacombs, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                            'Relic - Echo of Bat': True,
                            'Progression - Echolocation': True,
                        },
                        'Goals': {
                            'Get Spike Breaker': {
                                'Item - Spike Breaker': {
                                    'Minimum': 1,
                                },
                            },
                        },
                    },
                },
                'Clock Tower': {
                    'Loading Room A with Double Jump -> Loading Room B': {
                        'State': {
                            'Location': 'Clock Tower, Loading Room A',
                            'Section': 'Main',
                            'Relic - Leap Stone': True,
                            'Progression - Double Jump': True,
                        },
                        'Goals': {
                            'Reach Castle Keep': {
                                'Locations Visited': {
                                    'All': {
                                        'Clock Tower, Loading Room B (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room A with Soul of Bat -> Karasuman\'s Room': {
                        'State': {
                            'Location': 'Clock Tower, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Reach Karasuman\'s Room': {
                                'Locations Visited': {
                                    'All': {
                                        'Clock Tower, Karasuman\'s Room (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Colosseum': {
                    'Loading Room B -> Loading Room A': {
                        'State': {
                            'Location': 'Colosseum, Loading Room B',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Reach Castle Keep': {
                                'Locations Visited': {
                                    'All': {
                                        'Colosseum, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room A with Shortcut Unlocked -> Loading Room B': {
                        'State': {
                            'Location': 'Colosseum, Loading Room A',
                            'Section': 'Main',
                            'Status - Shortcut Between Holy Chapel and Colosseum Unlocked': True,
                        },
                        'Goals': {
                            'Reach Castle Keep': {
                                'Locations Visited': {
                                    'All': {
                                        'Colosseum, Loading Room B (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room B -> Library Card -> Form of Mist': {
                        'State': {
                            'Location': 'Colosseum, Loading Room B',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Get Library Card and Form of Mist': {
                                'Item - Library Card': 1,
                                'Relic - Form of Mist': True,
                                'Progression - Mist Transformation': True,
                            },
                        },
                    },
                },
                'Long Library': {
                    'Loading Room A with Soul of Wolf -> Jewel of Open -> Loading Room A': {
                        'State': {
                            'Location': 'Long Library, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Wolf': True,
                            'Progression - Wolf Transformation': True,
                        },
                        'Goals': {
                            'Get Jewel of Open and Reach Outer Wall': {
                                'Relic - Jewel of Open': True,
                                'Progression - Unlock Blue Doors': True,
                                'Locations Visited': {
                                    'All': {
                                        'Long Library, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room A with Double Jump, Soul of Wolf, and Form of Mist -> Soul of Bat -> Loading Room A': {
                        'State': {
                            'Location': 'Long Library, Loading Room A',
                            'Section': 'Main',
                            'Relic - Leap Stone': True,
                            'Progression - Double Jump': True,
                            'Relic - Soul of Wolf': True,
                            'Progression - Wolf Transformation': True,
                            'Relic - Form of Mist': True,
                            'Progression - Mist Transformation': True,
                        },
                        'Goals': {
                            'Get Soul of Bat and Reach Outer Wall': {
                                'Relic - Soul of Bat': True,
                                'Progression - Bat Transformation': True,
                                'Locations Visited': {
                                    'All': {
                                        'Long Library, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Marble Gallery': {
                    'Loading Room A with Leap Stone -> Loading Room D': {
                        'State': {
                            'Location': 'Marble Gallery, Loading Room A',
                            'Section': 'Main',
                            'Relic - Leap Stone': True,
                            'Progression - Double Jump': True,
                        },
                        'Goals': {
                            'Reach Olrox\'s Quarters': {
                                'Locations Visited': {
                                    'All': {
                                        'Marble Gallery, Loading Room D (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room A with Soul of Bat, Jewel of Open, Gold Ring, and Silver Ring -> Elevator Room': {
                        'State': {
                            'Location': 'Marble Gallery, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                            'Relic - Jewel of Open': True,
                            'Progression - Unlock Blue Doors': True,
                            'Item - Silver Ring': 1,
                            'Item - Gold Ring': 1,
                        },
                        'Goals': {
                            'Reach Castle Center': {
                                'Locations Visited': {
                                    'All': {
                                        'Marble Gallery, Elevator Room (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room A with Jewel of Open -> Loading Room B': {
                        'State': {
                            'Location': 'Marble Gallery, Loading Room A',
                            'Section': 'Main',
                            'Relic - Jewel of Open': True,
                            'Progression - Unlock Blue Doors': True,
                        },
                        'Goals': {
                            'Reach Underground Caverns': {
                                'Locations Visited': {
                                    'All': {
                                        'Marble Gallery, Loading Room B (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room C -> Loading Room A': {
                        'State': {
                            'Location': 'Marble Gallery, Loading Room C',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Reach Outer Wall': {
                                'Locations Visited': {
                                    'All': {
                                        'Marble Gallery, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Olrox\'s Quarters': {
                    'Loading Room A -> Loading Room B': {
                        'State': {
                            'Location': 'Olrox\'s Quarters, Loading Room A',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Reach Colosseum': {
                                'Locations Visited': {
                                    'All': {
                                        'Olrox\'s Quarters, Loading Room B (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room A with Soul of Bat-> Echo of Bat': {
                        'State': {
                            'Location': 'Olrox\'s Quarters, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Get Echo of Bat': {
                                'Relic - Echo of Bat': True,
                                'Progression - Echolocation': True,
                            },
                        },
                    },
                    'Loading Room A with Soul of Bat -> Olrox\'s Room (Ground)': {
                        'State': {
                            'Location': 'Olrox\'s Quarters, Loading Room A',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Reach Catacombs': {
                                'Locations Visited': {
                                    'All': {
                                        'Olrox\'s Quarters, Olrox\'s Room (Ground)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Outer Wall': {
                    'Loading Room D -> Soul of Wolf -> Loading Room A': {
                        'State': {
                            'Location': 'Outer Wall, Loading Room A',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Reach Warp Rooms': {
                                'Relic - Soul of Wolf': True,
                                'Locations Visited': {
                                    'All': {
                                        'Outer Wall, Loading Room A (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room D -> Soul of Wolf -> Loading Room B': {
                        'State': {
                            'Location': 'Outer Wall, Loading Room A',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Get Soul of Wolf and Reach Clock Tower': {
                                'Relic - Soul of Wolf': True,
                                'Locations Visited': {
                                    'All': {
                                        'Outer Wall, Loading Room B (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room D -> Soul of Wolf -> Loading Room C': {
                        'State': {
                            'Location': 'Outer Wall, Loading Room A',
                            'Section': 'Main',
                        },
                        'Goals': {
                            'Get Soul of Wolf and Reach Long Library': {
                                'Relic - Soul of Wolf': True,
                                'Locations Visited': {
                                    'All': {
                                        'Outer Wall, Loading Room C (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room B with Soul of Bat -> Doppelganger Room': {
                        'State': {
                            'Location': 'Outer Wall, Loading Room B',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Reach Catacombs': {
                                'Locations Visited': {
                                    'All': {
                                        'Outer Wall, Doppelganger Room (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Royal Chapel': {
                    'Loading Room B with Jewel of Open -> Loading Room C': {
                        'State': {
                            'Location': 'Royal Chapel, Loading Room B',
                            'Section': 'Main',
                            'Relic - Jewel of Open': True,
                            'Progression - Unlock Blue Doors': True,
                        },
                        'Goals': {
                            'Reach Castle Keep': {
                                'Locations Visited': {
                                    'All': {
                                        'Royal Chapel, Loading Room C (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                    'Loading Room B with Jewel of Open and Spike Breaker -> Silver Ring': {
                        'State': {
                            'Location': 'Royal Chapel, Loading Room B',
                            'Section': 'Main',
                            'Relic - Jewel of Open': True,
                            'Progression - Unlock Blue Doors': True,
                            'Item - Spike Breaker': 1,
                        },
                        'Goals': {
                            'Reach Castle Keep': {
                                'Item - Silver Ring': {
                                    'Minimum': 1,
                                },
                            },
                        },
                    },
                    'Loading Room B with Soul of Bat -> Hippogryph Room': {
                        'State': {
                            'Location': 'Royal Chapel, Loading Room B',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Reach Catacombs': {
                                'Locations Visited': {
                                    'All': {
                                        'Royal Chapel, Hippogryph Room (Main)': True,
                                    },
                                },
                            },
                        },
                    },
                },
                'Underground Caverns': {
                    'Loading Room B with Soul of Bat -> Gold Ring': {
                        'State': {
                            'Location': 'Underground Caverns, Loading Room B',
                            'Section': 'Main',
                            'Relic - Soul of Bat': True,
                            'Progression - Bat Transformation': True,
                        },
                        'Goals': {
                            'Get Gold Ring and Reach Abandoned Mine': {
                                'Item - Gold Ring': 1,
                            },
                        },
                    },
                },
                # 'Warp Rooms': {
                # },
            }
            all_valid_ind = True
            for (stage_name, validations) in stage_validations.items():
                print(stage_name, 'with hash:', shuffler['Stages'][stage_name]['Hash of Rooms'])
                for (validation_name, validation) in validations.items():
                    logic_core = mapper.LogicCore(mapper_core, changes).get_core()
                    for (state_key, state_value) in validation['State'].items():
                        logic_core['State'][state_key] = state_value
                    logic_core['Goals'] = validation['Goals']
                    # Validate
                    map_solver = solver.Solver(logic_core, skills)
                    map_solver.debug = False
                    map_solver.solve_via_random_exploration(19, 3_999, stage_name)
                    # map_solver.decay_start = 2_999
                    # map_solver.cycle_limit = 19_999
                    # map_solver.solve_via_steps(stage_name)
                    if len(map_solver.results['Wins']) < 1:
                        print(' ', validation_name, '*** FAILED')
                        all_valid_ind = False
                    else:
                        print(' ', validation_name, '*** PASSED')
            if not all_valid_ind:
                continue
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
            else:
                nonwinning_game = None
                game_type = 'Unknown'
                if 'Withdrawals' in map_solver.results and len(map_solver.results['Withdrawals']) > 0:
                    game_type = 'Withdrawal'
                    (_, nonwinning_game) = map_solver.results['Withdrawals'][-1]
                elif 'Losses' in map_solver.results and len(map_solver.results['Losses']) > 0:
                    game_type = 'Loss'
                    (_, nonwinning_game) = map_solver.results['Losses'][-1]
                else:
                    continue
                print('-------------')
                print(game_type)
                print('-------------')
                for (key, value) in sorted(nonwinning_game.current_state.items()):
                    if key in logic_core['Goals']['WIP: Good Ending']:
                        if key == 'Locations Visited':
                            for (room_key, room_value) in sorted(value.items()):
                                if room_key in logic_core['Goals']['WIP: Good Ending']['Locations Visited']['All']:
                                    print('-', 'Room Visit - ' + room_key, ':', room_value)
                        elif key == 'Stages Visited':
                            for (stage_key, stage_value) in sorted(value.items()):
                                if stage_key in logic_core['Goals']['WIP: Good Ending']['Stages Visited']['All']:
                                    print('-', 'Stage Visit - ' + stage_key, ':', stage_value)
                        else:
                            print('-', key, ':', value)
                print('-------------')
