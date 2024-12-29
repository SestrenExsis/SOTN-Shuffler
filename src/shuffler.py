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
    try:
        with open(os.path.join('build', 'mapper', 'mapper-metadata.json'), 'r') as mapper_metadata_json:
            mapper_metadata = json.load(mapper_metadata_json)
    except:
        mapper_metadata = {
            'Castle Entrance': [],
            'Alchemy Laboratory': [],
            'Marble Gallery': [],
            'Outer Wall': [],
            'Olrox\'s Quarters': [],
            'Colosseum': [],
            'Long Library': [],
            'Clock Tower': [],
        }
    with (
        open(os.path.join('build', 'sandbox', 'rules.json')) as rules_json,
        open(os.path.join('build', 'sandbox', 'skills.json')) as skills_json,
    ):
        mapper_data = mapper.MapperData().get_core()
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
            )
            print('Randomize with seeds')
            for (stage_name, stage_seed) in stages_to_process:
                stage_rng = random.Random(stage_seed)
                print(stage_name, stage_seed, end=' ')
                if stage_name in mapper_metadata and len(mapper_metadata[stage_name]) > 0:
                    prebaked_stage = stage_rng.choice(mapper_metadata[stage_name])
                    stage_map = mapper.Mapper(mapper_data, stage_name, prebaked_stage['Seed'])
                    stage_map.generate()
                    changes = stage_map.stage.get_changes()
                    assert stage_map.validate()
                    hash_of_rooms = hashlib.sha256(json.dumps(changes['Rooms'], sort_keys=True).encode()).hexdigest()
                    assert hash_of_rooms == prebaked_stage['Hash of Rooms']
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
                else:
                    raise Exception('No prebaked stages found for ' + stage_name)
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
            # with open(os.path.join('build', 'sandbox', 'debug-changes.json'), 'w') as debug_changes_json:
            #     json.dump(changes, debug_changes_json, indent='    ', sort_keys=True, default=str)
            print('Require that reaching all shuffled stages in a reasonable amount of steps is possible')
            logic_core = mapper.LogicCore(mapper_data, changes).get_core()
            logic_core['Goals'] = {
                'Reach All Shuffled Stages': {
                    'Progression - Castle Entrance Stage Reached': True,
                    'Progression - Castle Entrance Revisited Stage Reached': True,
                    'Progression - Alchemy Laboratory Stage Reached': True,
                    'Progression - Marble Gallery Stage Reached': True,
                    'Progression - Outer Wall Stage Reached': True,
                    'Progression - Olrox\'s Quarters Stage Reached': True,
                    'Progression - Colosseum Stage Reached': True,
                    'Progression - Long Library Stage Reached': True,
                    'Progression - Clock Tower Stage Reached': True,
                },
            }
            # with open(os.path.join('build', 'debug', 'logic-core.json'), 'w') as debug_logic_core_json:
            #     json.dump(logic_core, debug_logic_core_json, indent='    ', sort_keys=True, default=str)
            map_solver = solver.Solver(logic_core, skills)
            # map_solver.debug = True
            map_solver.solve_via_steps((24, 7, 80))
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
                }
                shuffler['End Time'] = datetime.datetime.now(datetime.timezone.utc)
                current_seed = {
                    'Data Core': mapper_data,
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
