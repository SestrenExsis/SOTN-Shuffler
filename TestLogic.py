import json

class Game:
    def __init__(self, logic):
        self.paths = logic['paths']
        self.checks = logic['checks']
        self.progressions = logic['progressions']
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
        if command in valid_targets.values():
            self.location = command
        else:
            self.location = valid_targets[int(command)]
    
    def perform_check(self, check):
        print('   +', check)
        self.checks_made.add(check)
        if check in self.progressions:
            for progression in self.progressions[check]:
                self.progressions_made.add(progression)

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open('logic.json') as open_file:
        logic = json.load(open_file)
        game = Game(logic)
        game.perform_check('Knowledge - Level 1')
        game.perform_check('Knowledge - Level 2')
        game.perform_check('Knowledge - Level 3')
        game.perform_check('Knowledge - Level 4')
        game.perform_check('Knowledge - Any Percent NSC')
        while True:
            game.play()