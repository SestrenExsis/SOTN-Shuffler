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
            # Randomize
            stages = {}
            stages_to_process = (
                ('Castle Entrance', random.randint(0, 2 ** 64)),
                ('Alchemy Laboratory', random.randint(0, 2 ** 64)),
                ('Marble Gallery', random.randint(0, 2 ** 64)),
                ('Outer Wall', random.randint(0, 2 ** 64)),
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
            # Current stage
            # stage_name = 'Outer Wall'
            # print(stage_name)
            # stage_map = mapper.Mapper(data_core, stage_name, random.randint(0, 2 ** 64))
            # while True:
            #     stage_map.generate()
            #     rooms_found = set(stage_map.stage.rooms)
            #     if len(rooms_found) >= 23:
            #         print(stage_name, len(rooms_found), stage_map.current_seed)
            #         # for row_data in stage_map.stage.get_stage_spoiler(data_core):
            #         #     print(row_data)
            #         # for row_data in stage_map.stage.get_room_spoiler(data_core):
            #         #     print(row_data)
            #         for room_name in sorted(data_core['Rooms']):
            #             if room_name.startswith('Outer Wall, ') and room_name not in rooms_found:
            #                 print(' ' , room_name)
            #     if stage_map.validate():
            #         break
            # stages[stage_name] = stage_map
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
                'Debug - Collect Soul of Wolf': {
                    'Relic - Soul of Wolf': True,
                    'Location': 'Outer Wall, Exit to Marble Gallery',
                },
            }
            map_solver = solver.Solver(logic_core, skills)
            map_solver.solve(3, 7)
            if len(map_solver.results['Wins']) > 0:
                with open(os.path.join('build', 'sandbox', 'changes.json'), 'w') as changes_json:
                    json.dump(changes, changes_json, indent='    ', sort_keys=True)
                with open(os.path.join('build', 'sandbox', 'logic-core.json'), 'w') as logic_core_json:
                    json.dump(logic_core, logic_core_json, indent='    ', sort_keys=True)
                (winning_layers, winning_game) = map_solver.results['Wins'][-1]
                solution = {
                    'Final Layer': winning_layers,
                    'State': winning_game.state,
                    'History': winning_game.history,
                }
                with open(os.path.join('build', 'sandbox', 'solution.json'), 'w') as solution_json:
                    json.dump(solution, solution_json, indent='    ', sort_keys=True)
