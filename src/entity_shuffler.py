# External libraries
import argparse
import json
import os
import random
import yaml

def getID(aliases: dict, path: tuple):
    result = path[-1]
    scope = aliases
    for token in path:
        if token not in scope:
            break
        scope = scope[token]
    else:
        result = scope
    if type(result) == str:
        result = int(result)
    return result


def shuffle_entities(object_layout, seed: int) -> dict:
    if len(object_layout) < 1:
        return None
    rng = random.Random(seed)
    # Split each entity into two parts:
    A = []
    B = []
    for entity in object_layout:
        A.append({
            'Entity Room Index': entity['Entity Room Index'],
            'Entity Type ID': entity['Entity Type ID'],
            'Params': entity['Params'],
        })
        B.append({
            'X': entity['X'],
            'Y': entity['Y'],
        })
    # Create a new entity list by shuffling part As and Bs around
    shuffled_object_layout = []
    rng.shuffle(A)
    assert len(A) == len(B)
    for i in range(len(A)):
        (a, b) = (A[i], B[i])
        shuffled_object_layout.append({
            'Entity Room Index': a['Entity Room Index'],
            'Entity Type ID': a['Entity Type ID'],
            'Params': a['Params'],
            'X': b['X'],
            'Y': b['Y'],
        })
    # Sort the new entity list by X and assign part A to the original order of the horizontal list
    # Sort the new entity list by Y and assign part A to the original order of the vertical list
    result = {
        'Object Layout - Horizontal': {},
        'Object Layout - Vertical': {},
    }
    horizontal_object_layout = list(sorted(shuffled_object_layout, key=lambda element: element['X']))
    vertical_object_layout = list(sorted(shuffled_object_layout, key=lambda element: element['Y']))
    assert len(horizontal_object_layout) == len(vertical_object_layout)
    for i in range(len(horizontal_object_layout)):
        # NOTE(sestren): The key for the changes file is going to need +1 added to it to account for the sentinel entity at the start of every entity list
        result['Object Layout - Horizontal'][str(i + 1)] = horizontal_object_layout[i]
        result['Object Layout - Vertical'][str(i + 1)] = vertical_object_layout[i]
    return result

if __name__ == '__main__':
    '''
    Usage
    python entity_shuffler.py SETTINGS STAGE_VALIDATIONS --seed SEED
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    parser = argparse.ArgumentParser()
    parser.add_argument('extraction', help='Input a filepath to the extraction JSON file', type=str)
    parser.add_argument('changes', help='Input a filepath to the changes JSON file to modify', type=str)
    parser.add_argument('aliases', help='Input a filepath to the aliases YAML file to modify', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    args = parser.parse_args()
    with (
        open(args.extraction) as extraction_file,
        open(args.changes) as changes_file,
        open(args.aliases) as aliases_file,
    ):
        extraction = json.load(extraction_file)
        changes = json.load(changes_file)
        if 'Changes' in changes:
            changes = changes['Changes']
        aliases = yaml.safe_load(aliases_file)
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(MIN_SEED, MAX_SEED))
    # For each stage, shuffle entities within each room
    global_rng = random.Random(initial_seed)
    for stage_name in sorted(changes['Stages'].keys()):
        print('', stage_name)
        stage_seed = global_rng.randint(MIN_SEED, MAX_SEED)
        stage_rng = random.Random(stage_seed)
        for room_name in sorted(changes['Stages'][stage_name]['Rooms'].keys()):
            print('  ', room_name)
            room_id = str(getID(aliases, ('Rooms', room_name)))
            room_extract = extraction['Stages'][stage_name]['Rooms'][room_id]
            room_seed = stage_rng.randint(MIN_SEED, MAX_SEED)
            if 'Object Layout - Horizontal' not in room_extract:
                continue
            object_layouts = shuffle_entities(room_extract['Object Layout - Horizontal']['Data'][1:-1], room_seed)
            if object_layouts is not None:
                changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Horizontal'] = object_layouts['Object Layout - Horizontal']
                changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Vertical'] = object_layouts['Object Layout - Vertical']
    with open(os.path.join('build', 'shuffler', 'april-fools.json'), 'w') as changes_json:
        json.dump(changes, changes_json, indent='    ', sort_keys=True, default=str)
