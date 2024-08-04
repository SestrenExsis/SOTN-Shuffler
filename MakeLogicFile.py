import json

def get_paths_from_yaml(open_file, zone_prefix=None):
    result = {}
    source = None
    target = None
    option = None
    requirement = None
    while line := open_file.readline():
        line = line.rstrip()
        if len(line) < 1:
            continue
        if line[0] != ' ':
            source = line.lstrip().replace(':', '')
            if zone_prefix is not None:
                source = zone_prefix + ' - ' + source
            target = option = requirement = None
        elif line[4] != ' ':
            target = line.lstrip().replace(':', '')
            if zone_prefix is not None:
                target = zone_prefix + ' - ' + target
            option = requirement = None
        elif line[8] != ' ':
            option = line.lstrip().replace(':', '')
            requirement = None
        elif line[12] != ' ':
            requirement = line.lstrip()[2:]
        if source is not None and source not in result:
            result[source] = {}
        if target is not None and target not in result[source]:
            result[source][target] = {}
        if option is not None and option not in result[source][target]:
            result[source][target][option] = []
        if requirement is not None:
            result[source][target][option].append(requirement)
            result[source][target][option].sort()
    return result

def get_checks_from_yaml(open_file):
    result = {}
    source = None
    check = None
    while line := open_file.readline():
        line = line.rstrip()
        if len(line) < 1:
            continue
        if line[0] != ' ':
            source = line.lstrip().replace(':', '')
            check = None
        elif line[4] != ' ':
            check = line.lstrip()[2:]
        if source is not None and source not in result:
            result[source] = []
        if check is not None:
            result[source].append(check)
            result[source].sort()
    return result

def get_loading_rooms_yaml(open_file):
    result = {}
    loading_room = None
    joining_room = None
    while line := open_file.readline():
        line = line.rstrip()
        if len(line) < 1:
            continue
        if line[0] != ' ':
            loading_room = line.lstrip().replace(':', '')
            joining_room = None
        elif line[4] != ' ':
            joining_room = line.lstrip()[2:]
        if loading_room is not None and loading_room not in result:
            result[loading_room] = []
        if joining_room is not None:
            result[loading_room].append(joining_room)
            result[loading_room].sort()
    return result

def paths_from_loading_rooms(loading_rooms):
    result = {}
    for loading_room, connecting_rooms in loading_rooms.items():
        if loading_room not in result:
            result[loading_room] = {}
        for connecting_room in connecting_rooms:
            if connecting_room not in result:
                result[connecting_room] = {}
            result[loading_room][connecting_room] = {}
            result[loading_room][connecting_room]['Basic Movement'] = ['None']
            result[connecting_room][loading_room] = {}
            result[connecting_room][loading_room]['Basic Movement'] = ['None']
    return result

def library_card_paths(paths):
    result = {}
    for starting_room in paths.keys():
        result[starting_room] = {}
        target_room = 'Teleport to Long Library'
        result[starting_room][target_room] = {}
        result[starting_room][target_room]['Use Library Card'] = [
            'Progression - Library Teleportation'
        ]
    return result

def dict_merge(base_dict: dict, dict_to_merge: dict):
    for key in dict_to_merge:
        if key in base_dict:
            if (
                isinstance(base_dict[key], dict) and
                isinstance(dict_to_merge[key], dict)
            ):
                dict_merge(base_dict[key], dict_to_merge[key])
        else:
            base_dict[key] = dict_to_merge[key]
    result = base_dict
    return result

# TODO(sestren): Figure out how to require Karasuman defeat coming from Loading Room

if __name__ == '__main__':
    paths = {}
    with open('paths/default.yaml') as open_file:
        paths = get_paths_from_yaml(open_file, None)
    with open('paths/loading-rooms.yaml') as open_file:
        loading_rooms = get_loading_rooms_yaml(open_file)
        load_paths = paths_from_loading_rooms(loading_rooms)
        paths = dict_merge(paths, load_paths)
    for zone_id, zone_prefix in (
        ['alchemy-laboratory', 'Alchemy Laboratory'],
        ['castle-entrance', 'Castle Entrance'],
        ['castle-keep', 'Castle Keep'],
        ['clock-tower', 'Clock Tower'],
        ['colosseum', 'Colosseum'],
        ['long-library', 'Long Library'],
        ['marble-gallery', 'Marble Gallery'],
        ['outer-wall', 'Outer Wall'],
        ['reverse-keep', 'Reverse Keep'],
    ):
        with open('paths/' + zone_id + '.yaml') as open_file:
            zone_paths = get_paths_from_yaml(open_file, zone_prefix)
            dict_merge(paths, zone_paths)
    dict_merge(paths, library_card_paths(paths))
    with open('checks.yaml') as open_file:
        checks = get_checks_from_yaml(open_file)
    with open('progressions.yaml') as open_file:
        progressions = get_checks_from_yaml(open_file)
    logic = {
        'paths': paths,
        'checks': checks,
        'progressions': progressions,
    }
    json_string = json.dumps(
        logic,
        indent='    ',
        sort_keys=True,
    )
    with open('logic.json', 'w') as open_file:
        open_file.write(json_string)