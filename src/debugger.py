# External libraries
import hashlib
import json
import os

# Local libraries
import mapper
import normalizer

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py SETTINGS STAGE_VALIDATIONS --seed SEED
    '''
    stage_name = 'Underground Caverns'
    hash_of_rooms = 'f47b26205006f1f03680c8cd447a496e5b28321f214f2e570ef678f1e5f903f1'
    # f47b26205006f1f03680c8cd447a496e5b28321f214f2e570ef678f1e5f903f1
    with open(os.path.join('build', 'shuffler', stage_name, hash_of_rooms + '.json')) as mapper_data_json:
        mapper_data = json.load(mapper_data_json)
        mapper_data_json.close()
    mapper_core = mapper.MapperData().get_core()
    stage_mapper = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
    stage_mapper.generate(mapper.stages[stage_name])
    stage_mapper.stage.normalize_bounds()
    stage_mapper.debug = True
    print('Validate before normalization')
    print(stage_mapper.validate_connections(False))
    print(stage_mapper.validate_connections(True))
    print('Normalize room connections')
    for room_name in normalizer.stages.get(stage_name, {}):
        for node_name in stage_mapper.stage.rooms[room_name].nodes.keys():
            if (room_name, node_name) in normalizer.nodes:
                print('', (room_name, node_name))
                stage_mapper.stage.rooms[room_name].nodes[node_name].type = normalizer.nodes[(room_name, node_name)]
    print('Validate after normalization')
    print(stage_mapper.validate_connections(False))
    print(stage_mapper.validate_connections(True))
    stage_changes = stage_mapper.stage.get_changes()
    hash_of_rooms = hashlib.sha256(json.dumps(stage_changes['Rooms'], sort_keys=True).encode()).hexdigest()
