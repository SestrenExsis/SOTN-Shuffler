# External libraries
import datetime
import hashlib
import json
import os
import random

# Local libraries
import mapper
import solver

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
                ('Castle Entrance', global_rng.randint(0, 2 ** 64)),
                ('Alchemy Laboratory', global_rng.randint(0, 2 ** 64)),
                ('Marble Gallery', global_rng.randint(0, 2 ** 64)),
                ('Outer Wall', global_rng.randint(0, 2 ** 64)),
                ('Olrox\'s Quarters', global_rng.randint(0, 2 ** 64)),
                ('Colosseum', global_rng.randint(0, 2 ** 64)),
                ('Long Library', global_rng.randint(0, 2 ** 64)),
                ('Clock Tower', global_rng.randint(0, 2 ** 64)),
                ('Warp Rooms', global_rng.randint(0, 2 ** 64)),
                ('Castle Keep', global_rng.randint(0, 2 ** 64)),
                ('Royal Chapel', global_rng.randint(0, 2 ** 64)),
                ('Underground Caverns', global_rng.randint(0, 2 ** 64)),
                ('Abandoned Mine', global_rng.randint(0, 2 ** 64)),
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
                changes = stage_map.stage.get_changes()
                # print(stage_name, stage_seed)
                assert stage_map.validate()
                hash_of_rooms = hashlib.sha256(json.dumps(changes['Rooms'], sort_keys=True).encode()).hexdigest()
                assert hash_of_rooms == mapper_data['Hash of Rooms']
                assert stage_map.validate()
                stages[stage_name] = stage_map
                print('Prebaked', stage_map.current_seed)
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
            changes = {
                'Stages': {}
            }
            for (stage_name, stage_map) in stages.items():
                # print('stage_name:', stage_name)
                changes['Stages'][stage_name] = {
                    'Rooms': {},
                }
                if stage_name == 'Castle Entrance':
                    changes['Stages']['Castle Entrance Revisited'] = {
                        'Rooms': {},
                    }
                stage_changes = stage_map.stage.get_changes()
                for room_name in stage_changes['Rooms']:
                    changes['Stages'][stage_name]['Rooms'][room_name] = {
                        'Top': stage_changes['Rooms'][room_name]['Top'],
                        'Left': stage_changes['Rooms'][room_name]['Left'],
                    }
                    # Apply Castle Entrance room positions to Castle Entrance Revisited
                    if stage_name == 'Castle Entrance' and room_name not in (
                        'Castle Entrance, Forest Cutscene',
                        'Castle Entrance, Unknown Room 19',
                        'Castle Entrance, Unknown Room 20',
                    ):
                        revisited_room_name = 'Castle Entrance Revisited, ' + room_name[17:]
                        changes['Stages']['Castle Entrance Revisited']['Rooms'][revisited_room_name] = {
                            'Top': stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_changes['Rooms'][room_name]['Left'],
                        }
                    if room_name == 'Colosseum, Arena':
                        changes['Stages']['Boss - Minotaur and Werewolf'] = {
                            'Rooms': {},
                        }
                        changes['Stages']['Boss - Minotaur and Werewolf']['Rooms']['Boss - Minotaur and Werewolf, Arena'] = {
                            'Top': stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_changes['Rooms'][room_name]['Left'],
                        }
                        changes['Stages']['Boss - Minotaur and Werewolf']['Rooms']['Boss - Minotaur and Werewolf, Fake Room With Teleporter A'] = {
                            'Top': stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_changes['Rooms'][room_name]['Left'] - 1,
                        }
                        changes['Stages']['Boss - Minotaur and Werewolf']['Rooms']['Boss - Minotaur and Werewolf, Fake Room With Teleporter B'] = {
                            'Top': stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_changes['Rooms'][room_name]['Left'] + 2,
                        }
                        changes['Boss Teleporters'] = {
                            '5': {
                                'Room X': stage_changes['Rooms'][room_name]['Left'],
                                'Room Y': stage_changes['Rooms'][room_name]['Top'],
                            },
                            '6': {
                                'Room X': stage_changes['Rooms'][room_name]['Left'] + 1,
                                'Room Y': stage_changes['Rooms'][room_name]['Top'],
                            },
                        }
            # with open(os.path.join('build', 'sandbox', 'debug-changes.json'), 'w') as debug_changes_json:
            #     json.dump(changes, debug_changes_json, indent='    ', sort_keys=True, default=str)
            print('Require that reaching all shuffled stages in a reasonable amount of steps is possible')
            # TODO(sestren): Add all vanilla stages to logic
            logic_core = mapper.LogicCore(mapper_core, changes).get_core()
            logic_core['Goals'] = {
                'Reach All Shuffled Stages': {
                    # 'Progression - Abandoned Mine Stage Reached': True,
                    # 'Progression - Alchemy Laboratory Stage Reached': True,
                    # 'Progression - Castle Entrance Stage Reached': True,
                    # 'Progression - Castle Entrance Revisited Stage Reached': True,
                    # 'Progression - Castle Keep Stage Reached': True,
                    # 'Progression - Clock Tower Stage Reached': True,
                    'Progression - Colosseum Stage Reached': True,
                    # 'Progression - Long Library Stage Reached': True,
                    # 'Progression - Marble Gallery Stage Reached': True,
                    # 'Progression - Outer Wall Stage Reached': True,
                    # 'Progression - Olrox\'s Quarters Stage Reached': True,
                    # 'Progression - Royal Chapel Stage Reached': True,
                    # 'Progression - Underground Caverns Stage Reached': True,
                    # 'Progression - Warp Rooms Stage Reached': True,
                    'Location': 'Colosseum, Arena',
                },
            }
            # with open(os.path.join('build', 'debug', 'logic-core.json'), 'w') as debug_logic_core_json:
            #     json.dump(logic_core, debug_logic_core_json, indent='    ', sort_keys=True, default=str)
            map_solver = solver.Solver(logic_core, skills)
            map_solver.debug = True
            map_solver.solve_via_steps(4999, 9999)
            if len(map_solver.results['Wins']) > 0:
                (winning_layers, winning_game) = map_solver.results['Wins'][-1]
                print('-------------')
                print('GOAL REACHED: Layer', winning_layers)
                print('History')
                for (layer, location, command_name) in winning_game.history:
                    print('-', layer, location, ':', command_name)
                print('State')
                for (key, value) in winning_game.current_state.items():
                    print('-', key, ':', value)
                print('-------------')
                solution = {
                    'History': winning_game.history,
                    'Final Layer': winning_layers,
                    'Final State': winning_game.current_state,
                    'Cycles': map_solver.cycle_count,
                }
                shuffler['End Time'] = datetime.datetime.now(datetime.timezone.utc)
                current_seed = {
                    'Data Core': mapper_core,
                    'Logic Core': logic_core,
                    'Shuffler': shuffler,
                    'Solver': solution,
                    'Changes': changes,
                }
                with open(os.path.join('build', 'sandbox', 'current-seed.json'), 'w') as current_seed_json:
                    json.dump(current_seed, current_seed_json, indent='    ', sort_keys=True, default=str)
                # while True:
                #     winning_game.play()
                break
