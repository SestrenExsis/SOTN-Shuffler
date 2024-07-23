
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

class Game:
    def __init__(self, paths, checks, progressions):
        self.paths = paths
        self.checks = checks
        self.progressions = progressions
        self.executions = {}
        self.checks_made = {
            'None',
        }
        self.progressions_made = {
            'None',
        }
        self.location = 'Prologue'
    
    def play(self):
        print('@', self.location)
        if self.location in self.checks:
            for check in self.checks[self.location]:
                self.perform_check(check)
        id = 1
        valid_targets = {}
        for target in sorted(self.paths[self.location]):
            options = self.paths[self.location][target]
            valid_options = set()
            for option, requirements in options.items():
                valid_option_ind = True
                for requirement in requirements:
                    if (
                        requirement not in self.executions and
                        requirement not in self.progressions_made
                    ):
                        valid_option_ind = False
                        break
                if valid_option_ind:
                    valid_options.add(option)
            if len(valid_options) > 0:
                print(' ', str(id) + ':', target)
                valid_targets[id] = target
                id += 1
        command = input()
        self.location = valid_targets[int(command)]
    
    def perform_check(self, check):
        print('   +', check)
        self.checks_made.add(check)
        if check in self.progressions:
            for progression in self.progressions[check]:
                self.progressions_made.add(progression)

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

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

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
        ['marble-gallery', 'Marble Gallery'],
    ):
        with open('paths/' + zone_id + '.yaml') as open_file:
            zone_paths = get_paths_from_yaml(open_file, zone_prefix)
            dict_merge(paths, zone_paths)
    with open('checks.yaml') as open_file:
        checks = get_checks_from_yaml(open_file)
    with open('progressions.yaml') as open_file:
        progressions = get_checks_from_yaml(open_file)
    game = Game(paths, checks, progressions)
    game.perform_check('Knowledge - Level 1')
    game.perform_check('Knowledge - Level 2')
    game.perform_check('Knowledge - Level 3')
    while True:
        game.play()