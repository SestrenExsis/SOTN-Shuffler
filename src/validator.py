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

def validate_logic(mapper_core, changes) -> bool:
    SOFTLOCK_CHECK__CYCLE_LIMIT = 199
    SOFTLOCK_CHECK__MAX_SOFTLOCKS = 0
    SOFTLOCK_CHECK__ATTEMPT_COUNT = 10
    PROGRESSION_CHECK__STEP_LIMIT = 96 # 46 highest observed successful, 49 lowest observed failed
    logic_core = mapper.LogicCore(mapper_core, changes).get_core()
    map_solver = solver.Solver(logic_core, skills)
    map_solver.debug = True
    map_solver.initial_seed = 1
    map_solver.decay_start = 49_999
    map_solver.cycle_limit = 199_999
    valid_ind = True
    final_goal_ind = False
    print('')
    while True:
        print(len(map_solver.current_game.goals_remaining), map_solver.current_game.current_state['Room'], map_solver.current_game.progression, map_solver.current_game.get_progression())
        prev_game = map_solver.current_game.clone()
        # Guard against softlocks
        map_solver.debug = False
        for attempt_id in range(SOFTLOCK_CHECK__ATTEMPT_COUNT):
            map_solver.solve_via_random_exploration(SOFTLOCK_CHECK__CYCLE_LIMIT)
        if len(map_solver.results['Losses']) > SOFTLOCK_CHECK__MAX_SOFTLOCKS:
            valid_ind = False
            print(' ', '❌ ... Guard against softlocks [', map_solver.results['Losses'][-1][1].location, ']')
            break
        print(' ', '✅ ... Guard against softlocks')
        # Require some form of nearby progression
        map_solver.debug = True
        map_solver.clear()
        map_solver.current_game = prev_game
        map_solver.solve_via_strict_steps(PROGRESSION_CHECK__STEP_LIMIT - len(map_solver.current_game.goals_remaining))
        if len(map_solver.results['Wins']) < 1:
            valid_ind = False
            print(' ', '❌ ... Require some form of nearby progression')
            break
        print(' ', '✅ ... Require some form of nearby progression')
        (step__solver, game__solver) = map_solver.results['Wins'][-1]
        while len(game__solver.goals_achieved) > 0:
            goal_achieved = game__solver.goals_achieved.pop()
            if goal_achieved == 'END':
                final_goal_ind = True
            # print(goal_achieved)
            game__solver.goals_remaining.pop(goal_achieved)
            game__solver.progression.append(goal_achieved)
        map_solver.current_game = game__solver
        map_solver.clear()
        if final_goal_ind:
            break
    result = valid_ind
    if 0 < len(map_solver.current_game.goals_remaining) < 16:
        print('Goals not obtained')
        for goal in sorted(map_solver.current_game.goals_remaining.keys()):
            print(' -', goal)
        if 'END' in map_solver.current_game.goals_remaining.keys():
            print('debug-state Location:', map_solver.current_game.location)
            with (
                open(os.path.join('build', 'shuffler', 'debug-state.json'), 'w') as debug_json,
            ):
                debug_state = map_solver.current_game.current_state
                json.dump(debug_state, debug_json, indent='    ', sort_keys=True, default=str)
    return result

def validate_stage(mapper_core, mapper_data, stage_name, validation) -> bool:
    current_mapper = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
    current_mapper.generate()
    current_mapper.stage.normalize_bounds()
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
    if validation['State'].get('Room', None) == 'Elsewhere':
        elsewhere = {}
        for room_name in logic_core['Commands']:
            if ', Loading Room to ' not in room_name:
                continue
            for command_name in logic_core['Commands'][room_name]:
                target_room_name = logic_core['Commands'][room_name][command_name]['Outcomes']['Room']
                if target_room_name.startswith(stage_name + ', '):
                    continue
                elsewhere['Exit - ' + room_name] = {
                    'Outcomes': {
                        'Room': room_name,
                        'Section': 'Main',
                    },
                    'Requirements': {
                        'Default': {
                            'Room': 'Elsewhere',
                            'Section': 'Elsewhere',
                        },
                    },
                }
                logic_core['Commands'][room_name][command_name]['Outcomes']['Room'] = 'Elsewhere'
                logic_core['Commands'][room_name][command_name]['Outcomes']['Section'] = 'Elsewhere'
        logic_core['Commands']['Elsewhere'] = elsewhere
    for (state_key, state_value) in validation['State'].items():
        logic_core['State'][state_key] = state_value
    logic_core['Goals'] = validation['Goals']
    # Validate
    map_solver = solver.Solver(logic_core, skills)
    validation_passed = True
    if 'Solver' not in validation: # Backwards compatibility for the old method of validating
        map_solver.solve_via_relaxed_steps(100 * validation['Solver Effort'], stage_name)
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
                map_solver.solve_via_relaxed_steps(step_limit, stage_name)
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
    fully_validated_stages = {}
    for stage_name in stage_validations:
        if stage_name == 'Template':
            continue
        fully_validated_stages[stage_name] = set()
        should_validate_ind = False
        directory_listing = os.listdir(os.path.join('build', 'shuffler', stage_name))
        file_listing = list(
            name for name in directory_listing if
            name.endswith('.json')
        )
        for current_file_name in file_listing:
            with open(os.path.join('build', 'shuffler', stage_name, current_file_name)) as mapper_data_json:
                mapper_data = json.load(mapper_data_json)
                mapper_data_json.close()
            current_mapper = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
            current_mapper.generate()
            current_mapper.stage.normalize_bounds()
            current_mapper__stage_changes = current_mapper.stage.get_changes()
            hash_of_rooms = hashlib.sha256(
                json.dumps(current_mapper__stage_changes['Rooms'], sort_keys=True).encode()
            ).hexdigest()
            assert hash_of_rooms == mapper_data['Hash of Rooms']
            fully_validated_stages[stage_name].add(hash_of_rooms)
            for (validation_name, validation) in stage_validations[stage_name].items():
                if validation_name.startswith('SKIP '):
                    continue
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
                    valid_ind = validate_stage(mapper_core, mapper_data, stage_name, validation)
                    results[stage_name][hash_of_rooms][hash_of_validation] = valid_ind
                    if stage_name != prev_stage:
                        print('', stage_name)
                    prev_stage = stage_name
                    if current_file_name != prev_file_name:
                        print('  ', current_file_name[:-5])
                    prev_file_name = current_file_name
                    if valid_ind:
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
                else:
                    valid_ind = results[stage_name][hash_of_rooms][hash_of_validation]
                if not valid_ind and hash_of_rooms in fully_validated_stages[stage_name]:
                    fully_validated_stages[stage_name].remove(hash_of_rooms)
    with (
        open(results_filepath, 'w') as results_json,
    ):
        json.dump(results, results_json, indent='    ', sort_keys=True, default=str)
    print('Validation summary')
    for stage_name in fully_validated_stages:
        print(f'{stage_name}: {len(fully_validated_stages[stage_name])}')
