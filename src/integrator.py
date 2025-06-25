# External libraries
import copy
import heapq
import hashlib
import itertools
import json
import os
import yaml

# Local libraries
import mapper
import solver

entry_points = {
    'Enter - Alchemy Laboratory': {
        'Room': 'Marble Gallery, Loading Room to Alchemy Laboratory',
        'Section': 'Main',
    },
    'Enter - Castle Center': {
        'Room': 'Marble Gallery, Elevator Room',
        'Section': 'Elevator',
    },
    'Enter - Castle Entrance': {
        'Room': 'Marble Gallery, Loading Room to Castle Entrance',
        'Section': 'Main',
    },
    "Enter - Olrox's Quarters": {
        'Room': "Marble Gallery, Loading Room to Olrox's Quarters",
        'Section': 'Main',
    },
    'Enter - Outer Wall': {
        'Room': 'Marble Gallery, Loading Room to Outer Wall',
        'Section': 'Main',
    },
    'Enter - Underground Caverns': {
        'Room': 'Marble Gallery, Loading Room to Underground Caverns',
        'Section': 'Main',
    },
}

goals = {
    'Location - Blue Door Room': {
        'Room': 'Marble Gallery, Blue Door Room',
        'Section': 'Right Side',
    },
    'Location - Stopwatch Room': {
        'Room': 'Marble Gallery, Stopwatch Room',
        'Section': 'Main',
    },
    'Location - Gravity Boots': {
        'Room': 'Marble Gallery, Gravity Boots Room',
        'Section': 'Main',
    },
    'Location - Spirit Orb': {
        'Room': 'Marble Gallery, Spirit Orb Room',
        'Section': 'Main',
    },
}

requirements = {
    'Marble Gallery Pressure Plate': {
        'Status - Pressure Plate in Marble Gallery Activated': True,
    },
    'Clock Room Floor': {
        'Status - Floor in Clock Room Opened Up': True,
    },
    'Cube of Zoe': {
        'Subweapon': 'Stopwatch',
    },
    # 'Cube of Zoe': {
    #     'Progression - Item Materialization': True,
    #     'Relic - Cube of Zoe': True,
    # },
    # 'Demon Card': {
    #     'Progression - Summon Demon Familiar': True,
    #     'Relic - Demon Card': True,
    # },
    # 'Echo of Bat': {
    #     'Progression - Echolocation': True,
    #     'Relic - Echo of Bat': True,
    # },
    'Form of Mist': {
        'Progression - Mid-Air Reset': True,
        'Progression - Mist Transformation': True,
        'Relic - Form of Mist': True,
    },
    'Gold Ring + Silver Ring': {
        'Item - Gold Ring': 1,
        'Item - Silver Ring': 1,
    },
    'Gravity Boots': {
        'Progression - Gravity Jump': True,
        'Relic - Gravity Boots': True,
    },
    'Jewel of Open': {
        'Progression - Unlock Blue Doors': True,
        'Relic - Jewel of Open': True,
    },
    'Leap Stone': {
        'Progression - Double Jump': True,
        'Progression - Mid-Air Reset': True,
        'Relic - Leap Stone': True,
    },
    # 'Merman Statue': {
    #     'Progression - Summon Ferryman': True,
    #     'Relic - Merman Statue': True,
    # },
    'Power of Mist': {
        'Progression - Longer Mist Duration': True,
        'Relic - Power of Mist': True,
    },
    'Soul of Bat': {
        'Progression - Bat Transformation': True,
        'Progression - Mid-Air Reset': True,
        'Relic - Soul of Bat': True,
    },
    'Soul of Wolf': {
        'Progression - Mid-Air Reset': True,
        'Progression - Wolf Transformation': True,
        'Relic - Soul of Wolf': True,
    },
    # 'Spike Breaker': {
    #     'Item - Spike Breaker': 1,
    # },
}

def validate(mapper_core, changes, skills, validation):
    logic_core = mapper.LogicCore(mapper_core, changes).get_core()
    for (state_key, state_value) in validation['State'].items():
        logic_core['State'][state_key] = state_value
    logic_core['Goals'] = validation['Goals']
    map_solver = solver.Solver(logic_core, skills)
    solver_config = validation['Solver']
    map_solver.initial_seed = solver_config.get('Initial Seed', 0)
    map_solver.debug = solver_config.get('Debug', False)
    validation_passed = True
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

def analyze_stage(stage_name, hash_of_rooms, skills):
    mapper_core = mapper.MapperData().get_core()
    with open(os.path.join('build', 'shuffler', stage_name, hash_of_rooms + '.json')) as mapper_data_json:
        mapper_data = json.load(mapper_data_json)
        mapper_data_json.close()
    current_mapper = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
    current_mapper.generate(mapper.stages[stage_name])
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
    validation_template = {
        'Solver': {
            'Approach': 'Steps',
            'Attempts': 1,
            'Limit': 99,
            'Initial Seed': 1,
            'Debug': False,
            'Wins': {
                'Minimum': 1,
            },
        },
        'State': {},
        'Goals': {},
    }
    analysis = {}
    work = []
    for entry_point_id in sorted(entry_points.keys()):
        for exit_point_id in sorted(entry_points.keys()):
            work.append((entry_point_id, exit_point_id))
    for entry_point_id in sorted(entry_points.keys()):
        for goal_id in sorted(goals.keys()):
            work.append((entry_point_id, goal_id))
    for goal_id in sorted(goals.keys()):
        for exit_point_id in sorted(entry_points.keys()):
            work.append((goal_id, exit_point_id))
    for goal_id in sorted(goals.keys()):
        for other_goal_id in sorted(goals.keys()):
            work.append((goal_id, other_goal_id))
    requirement_ids = list(sorted(requirements.keys()))
    while len(work) > 0:
        (entry_point_id, exit_point_id) = work.pop()
        if entry_point_id == exit_point_id:
            continue
        entry_point = entry_points.get(entry_point_id, {}) if entry_point_id in entry_points else goals.get(entry_point_id, {})
        exit_point = entry_points.get(exit_point_id, {}) if exit_point_id in entry_points else goals.get(exit_point_id, {})
        all_requirements = set()
        print('', (entry_point_id, exit_point_id))
        for requirement_count in range(10): # len(requirement_ids) + 1):
            skip_count = 0
            check_count = 0
            empty_hand_count = 0
            if requirement_count == 0:
                check_count += 1
                validation = copy.deepcopy(validation_template)
                for (key, value) in entry_point.items():
                    validation['State'][key] = value
                goal = {}
                for (key, value) in exit_point.items():
                    goal[key] = value
                validation['Goals']['Goal'] = goal
                result = validate(mapper_core, changes, skills, validation)
                if result:
                    all_requirements.add(('Empty Hand', ))
            else:
                for curr_requirements in itertools.combinations(requirement_ids, requirement_count):
                    check_count += 1
                    if ('Empty Hand', ) in all_requirements:
                        empty_hand_count += 1
                        continue
                    subset_found = False
                    set_of_curr_requirements = set(curr_requirements)
                    for prev_requirements in all_requirements:
                        if set_of_curr_requirements.issuperset(set(prev_requirements)):
                            subset_found = True
                            break
                    if subset_found:
                        skip_count += 1
                        continue
                    validation = copy.deepcopy(validation_template)
                    for (key, value) in entry_point.items():
                        validation['State'][key] = value
                    for requirement_id in curr_requirements:
                        for (key, value) in requirements[requirement_id].items():
                            validation['State'][key] = value
                    goal = {}
                    for (key, value) in exit_point.items():
                        goal[key] = value
                    validation['Goals']['Goal'] = goal
                    result = validate(mapper_core, changes, skills, validation)
                    if result:
                        if (entry_point_id, exit_point_id) not in analysis:
                            analysis[(entry_point_id, exit_point_id)] = set()
                        all_requirements.add(curr_requirements)
            print('  ', requirement_count, check_count, skip_count, empty_hand_count)
        analysis[(entry_point_id, exit_point_id)] = all_requirements
    for (entry_point_id, exit_point_id) in sorted(analysis.keys()):
        print('', (entry_point_id, exit_point_id))
        for requirements_key in sorted(analysis[(entry_point_id, exit_point_id)]):
            print('  - ', requirements_key)
    return result

if __name__ == '__main__':
    '''
    Usage
    python integrator.py
    '''
    skills = {}
    with (
        open(os.path.join('examples', 'skillsets.yaml')) as skillsets_file,
    ):
        skillsets = yaml.safe_load(skillsets_file)
        for skill in skillsets['Integration']:
            skills[skill] = True
    stage_name = 'Marble Gallery'
    hash_of_rooms = '09df8ef7d08b7c25d174908c20ed8b6368f1f973dde8e17bbe4e8fd1bfe1dc3f'
    result = analyze_stage(stage_name, hash_of_rooms, skills)
    print(result)