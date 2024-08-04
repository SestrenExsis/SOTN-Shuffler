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
            if loading_room in (
                'Clock Tower - Karasuman',
                'Reverse Clock Tower - Darkwing Bat',
            ):
                boss_name = loading_room.split(' - ')[0]
                progression = 'Progression - ' + boss_name + ' Defeated'
                result[connecting_room][loading_room]['Defeat Boss'] = [progression]
            else:
                result[connecting_room][loading_room]['Basic Movement'] = ['None']
    return result

def library_card_paths(paths):
    result = {}
    for starting_room in paths.keys():
        if starting_room not in (
            'Axe Armor Mode',
            'Luck Mode',
            'Normal Mode',
            'Prologue',
            'Richter Mode',
            'Start New Game',
        ):
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

def get_standard_logic():
    result = {}
    paths = {}
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
    with open('paths/default.yaml') as open_file:
        default_paths = get_paths_from_yaml(open_file, None)
        paths = dict_merge(paths, default_paths)
    dict_merge(paths, library_card_paths(paths))
    result['paths'] = paths
    with open('checks.yaml') as open_file:
        checks = get_checks_from_yaml(open_file)
    result['checks'] = checks
    with open('progressions.yaml') as open_file:
        progressions = get_checks_from_yaml(open_file)
    result['progressions'] = progressions
    return result

if __name__ == '__main__':
    logic = get_standard_logic()
    json_string = json.dumps(
        logic,
        indent='    ',
        sort_keys=True,
    )
    with open('logic.json', 'w') as open_file:
        open_file.write(json_string)

# Adjustments for RBO ruleset:
    # Shaft:
    # Galamoth: Progression - Shaft Defeated
    # Beezlebub: Progression - Galamoth Defeated
    # Trio: Progression - Beezlebub Defeated
    # Doppleganger40: Progression - Trio Defeated
    # Death: Progression - Doppleganger40 Defeated
    # Creature: Progression - Death Defeated
    # Medusa: Progression - Creature Defeated
    # Akmodan: Progression - Medusa Defeated
    # Darkwing Bat: Progression - Akmodan Defeated
    # Save Richter: Progression - Darkwing Bat Defeated
    # Granfalloon: Progression - Richter Saved
    # Olrox: Progression - Granfalloon Defeated
    # Cerebus: Progression - Olrox Defeated
    # Succubus: Progression - Cerebus Defeated
    # Karasuman: Progression - Succubus Defeated
    # Minotaur and Werewolf: Progression - Karasuman Defeated
    # Scylla: Progression - Minotaur and Werewolf Defeated
    # Hippogryph: Progression - Scylla Defeated
    # Slogra and Gaibon: Progression - Hippogryph Defeated
    # Dracula: Progression - Slogra and Gaibon Defeated

# TODO(sestren): To handle Pacifist, add the concept of Disqualifiers?
    # Remove all the "Action - Defeat BOSS" should work