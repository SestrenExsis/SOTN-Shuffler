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
        with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'r') as generated_stages_json:
            generated_stages = json.load(generated_stages_json)
    except:
        generated_stages = {
            'Castle Entrance': [],
            'Alchemy Laboratory': [],
            'Marble Gallery': [],
            'Outer Wall': [],
            'Olrox\'s Quarters': [],
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
        rng = random.Random(initial_seed)
        while True:
            print('')
            shuffler = {
                'Initial Seed': initial_seed,
                'Start Time': datetime.datetime.now(datetime.timezone.utc),
                'Stages': {},
            }
            # Randomize
            stages = {}
            stages_to_process = (
                ('Castle Entrance', rng.randint(0, 2 ** 64)),
                ('Alchemy Laboratory', rng.randint(0, 2 ** 64)),
                ('Marble Gallery', rng.randint(0, 2 ** 64)),
                ('Outer Wall', rng.randint(0, 2 ** 64)),
                ('Olrox\'s Quarters', rng.randint(0, 2 ** 64)),
            )
            print('Randomize with seeds')
            for (stage_name, stage_seed) in stages_to_process:
                print(stage_name, stage_seed, end=' ')
                stage_map = mapper.Mapper(mapper_data, stage_name, stage_seed)
                note = 'Random'
                while True:
                    stage_map.generate()
                    if stage_map.validate():
                        break
                    if stage_map.attempts > 2000:
                        if stage_name in generated_stages and len(generated_stages[stage_name]) > 0:
                            prebaked_stage = stage_map.rng.choice(generated_stages[stage_name])
                            prebaked_map = mapper.Mapper(mapper_data, stage_name, prebaked_stage['Seed'])
                            prebaked_map.generate()
                            assert prebaked_map.validate()
                            hash_of_changes = hashlib.sha256(json.dumps(prebaked_map.stage.get_changes(), sort_keys=True).encode()).hexdigest()
                            assert hash_of_changes == prebaked_stage['Hash of Changes']
                            stage_map = prebaked_map
                            if stage_map.validate():
                                note = 'Prebaked'
                                break
                stages[stage_name] = stage_map
                print(stage_map.current_seed)
                shuffler['Stages'][stage_name] = {
                    'Note': note,
                    'Attempts': stage_map.attempts,
                    'Generation Start Date': stage_map.start_time.isoformat(),
                    'Generation End Date': stage_map.end_time.isoformat(),
                    # 'Generation Version': GENERATION_VERSION,
                    'Hash of Changes': hashlib.sha256(json.dumps(stage_map.stage.get_changes(), sort_keys=True).encode()).hexdigest(),
                    'Seed': stage_map.current_seed,
                    'Stage': stage_name,
                }
            # Current stage
            stage_name = 'Olrox\'s Quarters'
            print(stage_name)
            stage_map = mapper.Mapper(mapper_data, stage_name, rng.randint(0, 2 ** 64))
            while True:
                stage_map.generate()
                rooms_found = set(stage_map.stage.rooms)
                if stage_map.validate():
                    break
            stages[stage_name] = stage_map
            shuffler['Stages'][stage_name] = {
                'Note': 'Random',
                'Attempts': stage_map.attempts,
                'Generation Start Date': stage_map.start_time.isoformat(),
                'Generation End Date': stage_map.end_time.isoformat(),
                # 'Generation Version': GENERATION_VERSION,
                'Hash of Changes': hashlib.sha256(json.dumps(stage_map.stage.get_changes(), sort_keys=True).encode()).hexdigest(),
                'Seed': stage_map.current_seed,
                'Stage': stage_name,
            }
            # ...
            changes = {
                'Rooms': {}
            }
            for (stage_name, stage_map) in stages.items():
                stage_changes = stage_map.stage.get_changes()
                for room_name in stage_changes['Rooms']:
                    changes['Rooms'][room_name] = {
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
                        changes['Rooms'][revisited_room_name] = {
                            'Top': stage_changes['Rooms'][room_name]['Top'],
                            'Left': stage_changes['Rooms'][room_name]['Left'],
                        }
            print('Require that leaving Castle Entrance by layer 3 is possible')
            logic_core = mapper.LogicCore(mapper_data, changes).get_core()
            logic_core['Goals'] = {
                'Debug - Reach Castle Entrance, Loading Room A': {
                    'Location': 'Castle Entrance, Loading Room A',
                },
                'Debug - Reach Castle Entrance, Loading Room B': {
                    'Location': 'Castle Entrance, Loading Room B',
                },
                'Debug - Reach Castle Entrance, Loading Room C': {
                    'Location': 'Castle Entrance, Loading Room C',
                },
                'Debug - Reach Castle Entrance, Loading Room D': {
                    'Location': 'Castle Entrance, Loading Room D',
                },
            }
            map_solver = solver.Solver(logic_core, skills)
            map_solver.solve(3, 3)
            if len(map_solver.results['Wins']) < 1:
                continue
            print('Require that reaching Olrox\'s Quarters by layer 3 is possible with full progression')
            logic_core = mapper.LogicCore(mapper_data, changes).get_core()
            for (location_name, command_info) in logic_core['Commands'].items():
                if 'Outcomes' in command_info:
                    for (key, value) in command_info['Outcomes'].items():
                        if key.startswith('Progression - '):
                            logic_core['State'][key] = value
            for progression_name in (
                'Progression - Ability to Strike at Floor',
                'Progression - Bat Transformation',
                'Progression - Double Jump',
                'Progression - Longer Mist Duration',
                'Progression - Mid-Air Reset',
                'Progression - Mist Transformation',
                'Progression - Unlock Blue Doors',
            ):
                logic_core['State'][progression_name] = True
            logic_core['Goals'] = {
                'Debug - Reach Skelerang Room': {
                    'Location': 'Olrox\'s Quarters, Skelerang Room',
                },
            }
            map_solver = solver.Solver(logic_core, skills)
            map_solver.debug = True
            map_solver.solve(3, 3)
            if len(map_solver.results['Wins']) < 1:
                continue
            print('Require that getting a major movement Relic is possible by layer 5')
            logic_core = mapper.LogicCore(mapper_data, changes).get_core()
            logic_core['Goals'] = {
                'Debug - Get Gravity Boots': {
                    'Relic - Gravity Boots': True,
                },
            }
            map_solver = solver.Solver(logic_core, skills)
            map_solver.debug = True
            map_solver.solve(3, 5)
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
                break
