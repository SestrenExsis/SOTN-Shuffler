# External libraries
import argparse
import hashlib
import json
import os
import yaml

# Local libraries
import mapper
import solver

rules = {}
skills = {
    "Technique - Pixel-Perfect Diagonal Gravity Jump Through Narrow Gap": True,
}

def validate(mapper_core, mapper_data, stage_name, validation) -> bool:
    current_mapper = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
    current_mapper.generate()
    current_mapper.stage.normalize()
    current_mapper__stage_changes = current_mapper.stage.get_changes()
    hash_of_rooms = hashlib.sha256(
        json.dumps(current_mapper__stage_changes['Rooms'], sort_keys=True).encode()
    ).hexdigest()
    assert hash_of_rooms == mapper_data['Hash of Rooms']
    changes = {
        'Stages': {
            stage_name: current_mapper__stage_changes,
        },
    }
    logic_core = mapper.LogicCore(mapper_core, changes).get_core()
    for (state_key, state_value) in validation['State'].items():
        logic_core['State'][state_key] = state_value
    logic_core['Goals'] = validation['Goals']
    # Validate
    map_solver = solver.Solver(logic_core, skills)
    validation_passed = True
    if 'Solver' not in validation: # Backwards compatibility for the old method of validating
        map_solver.solve_via_steps(100 * validation['Solver Effort'], stage_name)
        if len(map_solver.results['Wins']) < 1:
            validation_passed = False
        else:
            validation_passed = True
    else:
        solver_config = validation['Solver']
        map_solver.initial_seed = solver_config.get('Initial Seed', 0)
        map_solver.debug = solver_config.get('Debug', False)
        for attempt_id in range(solver_config.get('Attempts', 1)):
            if solver_config['Approach'] == 'Random Exploration':
                cycle_limit = solver_config.get('Limit', 1_999)
                map_solver.solve_via_random_exploration(cycle_limit, stage_name)
            elif solver_config['Approach'] == 'Steps':
                step_limit = solver_config.get('Limit', 100)
                map_solver.solve_via_steps(step_limit, stage_name)
            else:
                raise Exception('Unrecognized approach:', validation['Solver']['Approach'])
        for result_name in ('Wins', 'Losses', 'Withdrawals'):
            if result_name in solver_config:
                minimum = solver_config[result_name].get('Minimum', float('-inf'))
                maximum = solver_config[result_name].get('Maximum', float('inf'))
                result_count = len(map_solver.results[result_name])
                if minimum <= result_count <= maximum:
                    pass
                else:
                    validation_passed = False
                    break
    result = validation_passed
    return result

if __name__ == '__main__':
    '''
    Usage
    python validator.py
    '''
    print('Validate all generated maps')
    parser = argparse.ArgumentParser()
    parser.add_argument('stage_validations', help='Input a filepath to the stage validations YAML file', type=str)
    stage_validations = {}
    args = parser.parse_args()
    with (
        open(args.stage_validations) as stage_validations_file,
    ):
        stage_validations = yaml.safe_load(stage_validations_file)
    results = {}
    results_filepath = os.path.join('build', 'shuffler', 'validation_results.json')
    if os.path.exists(results_filepath):
        with (
            open(results_filepath) as results_json,
        ):
            results = json.load(results_json)
    else:
        results = {}
    mapper_core = mapper.MapperData().get_core()
    file_read_count = 0
    prev_stage = None
    prev_file_name = None
    for stage_name in stage_validations:
        should_validate_ind = False
        directory_listing = os.listdir(os.path.join('build', 'shuffler', stage_name))
        file_listing = list(
            name for name in directory_listing if
            name.endswith('.json')
        )
        for current_file_name in file_listing:
            add_to_pool = False
            with open(os.path.join('build', 'shuffler', stage_name, current_file_name)) as mapper_data_json:
                mapper_data = json.load(mapper_data_json)
                mapper_data_json.close()
            current_mapper = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
            current_mapper.generate()
            current_mapper.stage.normalize()
            current_mapper__stage_changes = current_mapper.stage.get_changes()
            hash_of_rooms = hashlib.sha256(
                json.dumps(current_mapper__stage_changes['Rooms'], sort_keys=True).encode()
            ).hexdigest()
            assert hash_of_rooms == mapper_data['Hash of Rooms']
            if hash_of_rooms not in results.get(stage_name, {}):
                add_to_pool = True
            for (validation_name, validation) in stage_validations[stage_name].items():
                should_validate_ind = False
                if stage_name not in results:
                    results[stage_name] = {}
                    should_validate_ind = True
                if hash_of_rooms not in results[stage_name]:
                    results[stage_name][hash_of_rooms] = {}
                    should_validate_ind = True
                hash_of_validation = hashlib.sha256(
                    json.dumps(validation, sort_keys=True).encode()
                ).hexdigest()
                if hash_of_validation not in results[stage_name][hash_of_rooms]:
                    should_validate_ind = True
                if should_validate_ind:
                    validation_result = validate(
                        mapper_core,
                        mapper_data,
                        stage_name,
                        validation
                    )
                    results[stage_name][hash_of_rooms][hash_of_validation] = validation_result
                    if stage_name != prev_stage:
                        print('', stage_name)
                    prev_stage = stage_name
                    if current_file_name != prev_file_name:
                        print('  ', current_file_name[:-5])
                    prev_file_name = current_file_name
                    if validation_result:
                        print('    ', '✅', '...', validation_name)
                    else:
                        print('    ', '❌', '...', validation_name)
                    file_read_count += 1
                    if file_read_count >= 256:
                        with (
                            open(results_filepath, 'w') as results_json,
                        ):
                            json.dump(results, results_json, indent='    ', sort_keys=True, default=str)
                        file_read_count = 0
    with (
        open(results_filepath, 'w') as results_json,
    ):
        json.dump(results, results_json, indent='    ', sort_keys=True, default=str)
