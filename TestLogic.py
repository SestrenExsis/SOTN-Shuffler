
def get_paths_from_yaml(open_file):
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
            target = option = requirement = None
        elif line[4] != ' ':
            target = line.lstrip().replace(':', '')
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

class Game:
    def __init__(self, paths, checks):
        self.paths = paths
        self.checks = checks
        self.executions = {}
        self.progression = {
            'None',
        }
        self.location = 'Prologue'
    
    def play(self):
        print('@', self.location)
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
                        requirement not in self.progression
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

if __name__ == '__main__':
    with open('paths.yaml') as open_file:
        paths = get_paths_from_yaml(open_file)
    with open('checks.yaml') as open_file:
        checks = get_checks_from_yaml(open_file)
    game = Game(paths, checks)
    # game.progression.add('Progression - Bat Transformation')
    while True:
        game.play()