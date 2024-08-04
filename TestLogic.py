import json

class Game:
    def __init__(self, logic):
        self.logic = logic
        self.checks_made = {}
        self.progressions_made = {
            'None',
        }
        self.location = 'Start New Game'

    def play(self):
        print('@', self.location)
        # TODO(sestren): Reserve a key (maybe 'z') for 'Use Library Card'
        command_keys = '1234567890abcdefghijklmnopqrstuvwxyz'
        command_index = 0
        valid_commands = {}
        # Add choices for locations currently reachable by the player
        for target in sorted(self.logic['paths'][self.location]):
            options = self.logic['paths'][self.location][target]
            valid_options = set()
            for option, requirements in options.items():
                valid_option_ind = True
                for requirement in requirements:
                    if requirement not in self.progressions_made:
                        valid_option_ind = False
                        break
                if valid_option_ind:
                    valid_options.add(option)
            if len(valid_options) > 0:
                command_key = command_keys[command_index]
                print(' ', command_key + ':', target)
                valid_commands[command_key] = target
                command_index += 1
        # Add choices pertaining to checks the player has not already made
        if self.location in self.logic['checks']:
            for check in self.logic['checks'][self.location]:
                if self.location not in self.checks_made:
                    self.checks_made[self.location] = set()
                if check not in self.checks_made[self.location]:
                    command_key = command_keys[command_index]
                    print(' ', command_key + ': +', check)
                    valid_commands[command_key] = check
                    command_index += 1
        # Ask player for next command
        command = input('> ').strip()
        if command in valid_commands.values():
            self.perform_command(command)
        elif command in valid_commands.keys():
            self.perform_command(valid_commands[command])
        else:
            print('command not valid:', command)
            raise Exception()
        print('')
    
    def perform_command(self, command):
        if command in self.logic['paths'][self.location]:
            self.location = command
        elif self.location in self.logic['checks']:
            if command in self.logic['checks'][self.location]:
                self.perform_check(command, self.location)
            else:
                print('check already made:', command)
        else:
            print('command not understood:', command)
            raise Exception()
    
    def perform_check(self, check, location=None):
        if location is None:
            print('   +', check)
        else:
            if location not in self.checks_made:
                self.checks_made[location] = set()
            if check not in self.checks_made[location]:
                print('   +', check)
            self.checks_made[location].add(check)
        if check in self.logic['progressions']:
            for progression in self.logic['progressions'][check]:
                if progression not in self.progressions_made:
                    print('     +', progression)
                self.progressions_made.add(progression)

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open('logic.json') as open_file:
        logic = json.load(open_file)
        game = Game(logic)
        game.perform_check('Knowledge - Any Percent NSC')
        while True:
            game.play()