# External libraries
import hashlib
import json
import os
import random

# Local libraries
import mapper
import roomrando
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
        data_core = roomrando.DataCore().get_core()
        with open(os.path.join('build', 'sandbox', 'data-core.json'), 'w') as data_core_json:
            json.dump(data_core, data_core_json, indent='    ', sort_keys=True)
        rules = json.load(rules_json)
        skills = json.load(skills_json)
        # Keep randomizing until a solution is found
        while True:
            print('')
            shuffler = {}
            # Randomize
            stages = {}
            stages_to_process = (
                ('Castle Entrance', random.randint(0, 2 ** 64)),
                ('Alchemy Laboratory', random.randint(0, 2 ** 64)),
                ('Marble Gallery', random.randint(0, 2 ** 64)),
                ('Outer Wall', random.randint(0, 2 ** 64)),
                ('Olrox\'s Quarters', random.randint(0, 2 ** 64)),
            )
            print('Randomize with seeds')
            for (stage_name, stage_seed) in stages_to_process:
                print(stage_name, stage_seed, end=' ')
                stage_map = mapper.Mapper(data_core, stage_name, stage_seed)
                while True:
                    stage_map.generate()
                    if stage_map.validate():
                        break
                    if stage_map.attempts > 2000:
                        if stage_name in generated_stages and len(generated_stages[stage_name]) > 0:
                            prebaked_stage = stage_map.rng.choice(generated_stages[stage_name])
                            prebaked_map = mapper.Mapper(data_core, stage_name, prebaked_stage['Seed'])
                            prebaked_map.generate()
                            assert prebaked_map.validate()
                            hash_of_changes = hashlib.sha256(json.dumps(prebaked_map.stage.get_changes(), sort_keys=True).encode()).hexdigest()
                            assert hash_of_changes == prebaked_stage['Hash of Changes']
                            stage_map = prebaked_map
                            if stage_map.validate():
                                break
                stages[stage_name] = stage_map
                print(stage_map.current_seed)
                shuffler[stage_name] = {
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
            stage_map = mapper.Mapper(data_core, stage_name, random.randint(0, 2 ** 64))
            while True:
                stage_map.generate()
                rooms_found = set(stage_map.stage.rooms)
                if stage_map.validate():
                    break
            stages[stage_name] = stage_map
            shuffler[stage_name] = {
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
                        'Index': stage_changes['Rooms'][room_name]['Index'],
                        'Top': stage_changes['Rooms'][room_name]['Top'],
                        'Left': stage_changes['Rooms'][room_name]['Left'],
                    }
            # Build
            logic_core = roomrando.LogicCore(data_core, changes).get_core()
            # Solve
            logic_core['Goals'] = {
                'Debug - Reach Skelerang Room': {
                    'Location': 'Olrox\'s Quarters, Skelerang Room',
                },
            }
            map_solver = solver.Solver(logic_core, skills)
            map_solver.solve(3, 12)
            if len(map_solver.results['Wins']) > 0:
                (winning_layers, winning_game) = map_solver.results['Wins'][-1]
                print('-------------')
                print('GOAL REACHED: Layer', winning_layers)
                print('History')
                for (layer, location, command_name) in winning_game.history:
                    print('-', layer, location, ':', command_name)
                print('State')
                for (key, value) in winning_game.state.items():
                    print('-', key, ':', value)
                print('-------------')
                solution = {
                    'History': winning_game.history,
                    'Final Layer': winning_layers,
                    'Final State': winning_game.state,
                }
                current_seed = {
                    'Data Core': data_core,
                    'Logic Core': logic_core,
                    'Shuffler': shuffler,
                    'Solver': solution,
                    'Changes': changes,
                }
                with open(os.path.join('build', 'sandbox', 'current-seed.json'), 'w') as current_seed_json:
                    json.dump(current_seed, current_seed_json, indent='    ', sort_keys=True)
                break
