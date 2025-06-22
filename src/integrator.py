# External libraries
import argparse
import hashlib
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
    'Enter - Castle Center': {
        'Room': 'Marble Gallery, Elevator Room',
        'Section': 'Elevator',
    },
}

goals = {
    'Status - Pressure Plate in Marble Gallery Activated': {
        'Status - Pressure Plate in Marble Gallery Activated': True,
    },
    'Subweapon - Stopwatch': {
        'Subweapon': 'Stopwatch',
    },
    'Location - Gravity Boots': {
        'Check - Gravity Boots Location': True,
    },
    'Location - Spirit Orb': {
        'Check - Spirit Orb Location': True,
    },
}

requirements = {
    'Pressure Plate in Marble Gallery': {
        'Status - Pressure Plate in Marble Gallery Activated': True,
    },
    'Stopwatch': {
        'Subweapon': 'Stopwatch',
    },
    'Cube of Zoe': {
        'Progression - Item Materialization': True,
        'Relic - Cube of Zoe': True,
    },
    'Demon Card': {
        'Progression - Summon Demon Familiar': True,
        'Relic - Demon Card': True,
    },
    'Echo of Bat': {
        'Progression - Echolocation': True,
        'Relic - Echo of Bat': True,
    },
    'Form of Mist': {
        'Progression - Mid-Air Reset': True,
        'Progression - Mist Transformation': True,
        'Relic - Form of Mist': True,
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
    'Merman Statue': {
        'Progression - Summon Ferryman': True,
        'Relic - Merman Statue': True,
    },
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
    'Spike Breaker': {
        'Item - Spike Breaker': 1,
    },
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
    for (entry_point_id, entry_point) in entry_points.items():
        for (exit_point_id, exit_point) in entry_points.items():
            if exit_point_id == entry_point_id:
                continue
            validation = {
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
                'State': {
                    # 'Room': 'Marble Gallery, Loading Room to Alchemy Laboratory',
                    # 'Section': 'Main',
                    # 'Progression - Double Jump': True,
                    # 'Progression - Gravity Jump': True,
                    # 'Status - Pressure Plate in Marble Gallery Activated': True,
                    # 'Subweapon': 'Stopwatch',
                },
                'Goals': {
                    # 'Check - Gravity Boots Location': {
                    #     'Check - Gravity Boots Location': True,
                    # },
                },
            }
            for (key, value) in entry_point.items():
                validation['State'][key] = value
            goal = {}
            for (key, value) in exit_point.items():
                goal[key] = value
            validation['Goals']['Goal'] = goal
            result = validate(mapper_core, changes, skills, validation)
            print((entry_point_id, exit_point_id), '=', result)
            # progression, entry_point, exit_point
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
        for skill in skillsets['Casual']:
            skills[skill] = True
    stage_name = 'Marble Gallery'
    hash_of_rooms = '09df8ef7d08b7c25d174908c20ed8b6368f1f973dde8e17bbe4e8fd1bfe1dc3f'
    result = analyze_stage(stage_name, hash_of_rooms, skills)
    print(result)