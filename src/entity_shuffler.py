# External libraries
import argparse
import copy
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

class EntityShuffler:
    def __init__(self, extraction: dict, changes: dict, aliases: dict, seed:str='0'):
        self.changes = changes
        self.current_seed = self.next_seed = seed
        self.rng = random.Random(self.current_seed)
        self.object_layouts = {}
        for stage_name in sorted(changes['Stages'].keys()):
            self.object_layouts[stage_name] = {}
            for room_name in sorted(changes['Stages'][stage_name]['Rooms'].keys()):
                room_id = str(getID(aliases, ('Rooms', room_name)))
                room_extract = extraction['Stages'][stage_name]['Rooms'][room_id]
                if 'Object Layout - Horizontal' not in room_extract:
                    continue
                self.object_layouts[stage_name][room_name] = copy.deepcopy(room_extract['Object Layout - Horizontal']['Data'][1:-1])
    
    def shuffle(self, pool_type: int):
        pooled_entities = []
        # Extract entities in pool type from their original positions and add them to the pool
        for stage_name in sorted(self.object_layouts.keys()):
            for room_name in sorted(self.object_layouts[stage_name].keys()):
                for base_entity in self.object_layouts[stage_name][room_name]:
                    if base_entity['Entity Type ID'] == pool_type:
                        pooled_entity = {
                            'Entity Room Index': base_entity.pop('Entity Room Index'),
                            'Entity Type ID': base_entity.pop('Entity Type ID'),
                            'Params': base_entity.pop('Params'),
                        }
                        pooled_entities.append(pooled_entity)
        # Shuffle the pool of entities around
        self.rng.shuffle(pooled_entities)
        # Reassign the now-shuffled pool of entities in order
        for stage_name in sorted(self.object_layouts.keys()):
            for room_name in sorted(self.object_layouts[stage_name].keys()):
                for base_entity in self.object_layouts[stage_name][room_name]:
                    if 'Entity Type ID' not in base_entity:
                        pooled_entity = pooled_entities.pop()
                        base_entity['Entity Room Index'] = pooled_entity['Entity Room Index']
                        base_entity['Entity Type ID'] = pooled_entity['Entity Type ID']
                        base_entity['Params'] = pooled_entity['Params']
        assert len(pooled_entities) < 1
    
    def apply_changes(self):
        # Sort the new entity lists by X and Y and add them to the horizontal and vertical lists, respectively
        # NOTE(sestren): The lists may not technically need to be sorted, since they were extracted in order, but it's being done anyway, to be safe
        for stage_name in sorted(self.object_layouts.keys()):
            for room_name in sorted(self.object_layouts[stage_name].keys()):
                room_object_layouts = {
                    'Object Layout - Horizontal': {},
                    'Object Layout - Vertical': {},
                }
                horizontal_object_layout = list(sorted(
                    self.object_layouts[stage_name][room_name],
                    key=lambda x: (x['X'], x['Y'], x['Entity Room Index'], x['Entity Type ID'], x['Params'])
                ))
                vertical_object_layout = list(sorted(
                    self.object_layouts[stage_name][room_name],
                    key=lambda x: (x['Y'], x['X'], x['Entity Room Index'], x['Entity Type ID'], x['Params'])
                ))
                assert len(horizontal_object_layout) == len(vertical_object_layout)
                for i in range(len(horizontal_object_layout)):
                    # NOTE(sestren): Add +1 to the changes key to account for the sentinel entity at the start of every entity list
                    room_object_layouts['Object Layout - Horizontal'][str(i + 1)] = horizontal_object_layout[i]
                    room_object_layouts['Object Layout - Vertical'][str(i + 1)] = vertical_object_layout[i]
                self.changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Horizontal'] = room_object_layouts['Object Layout - Horizontal']
                self.changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Vertical'] = room_object_layouts['Object Layout - Vertical']

if __name__ == '__main__':
    '''
    Usage
    python entity_shuffler.py EXTRACTION CHANGES ALIASES --seed SEED

    - Shuffle all Relic Orbs across both castles
    - Shuffle all Unique Item Drops across both castles
    shuffler = EntityShuffler(extraction, changes, aliases, seed)
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    ENTITY_TYPE__RELIC_ORB = 11
    ENTITY_TYPE__ITEM_DROP = 12
    ENTITY_TYPE__CANDLE = 40961
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
    global_rng = random.Random(initial_seed)
    seed = global_rng.randint(MIN_SEED, MAX_SEED)
    shuffler = EntityShuffler(extraction, changes, aliases, seed)
    shuffler.shuffle(ENTITY_TYPE__RELIC_ORB)
    shuffler.shuffle(ENTITY_TYPE__ITEM_DROP)
    shuffler.apply_changes()
    with open(os.path.join('build', 'shuffler', 'april-fools.json'), 'w') as changes_json:
        json.dump(changes, changes_json, indent='    ', sort_keys=True, default=str)
