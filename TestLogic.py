import json

class Game:
    def __init__(self, logic, starting_location: str='Name Entry Screen'):
        self.logic = logic
        self.starting_location = starting_location
        self.player = {
            'Location': self.starting_location,
        }
        self.commands = []
    
    def validate(self, requirements):
        result = False
        for requirement in requirements.values():
            # All checks within a requirement list must pass
            valid_ind = True
            for key, value in requirement.items():
                target_value = None
                if key not in self.player:
                    if type(value) == str:
                        target_value = 'NONE'
                    elif type(value) == bool:
                        target_value = False
                    elif type(value) in (int, dict):
                        target_value = 0
                else:
                    target_value = self.player[key]
                if type(value) == dict:
                    if 'Minimum' in value:
                        if target_value < value['Minimum']:
                            valid_ind = False
                            break
                    if 'Maximum' in value:
                        if target_value > value['Maximum']:
                            valid_ind = False
                            break
                elif target_value != value:
                    valid_ind = False
                    break
            # Satisfying even one requirement list is sufficient
            if valid_ind:
                result = True
                break
        return result

    def process_outcomes(self, outcomes):
        for key, value in outcomes.items():
            if type(value) in (str, bool):
                if key not in self.player or self.player[key] != value:
                    print('  +', key, ': ', value)
                self.player[key] = value
            elif type(value) in (int, float):
                if key not in self.player:
                    self.player[key] = 0
                print('  +', key, ': ', value)
                self.player[key] += value

    def play(self):
        print('@', self.player['Location'])
        valid_command_names = set()
        # Add choices for valid commands the player can issue
        for command_key, command_info in self.logic.items():
            if self.validate(command_info['Requirements']):
                valid_command_names.add(command_key)
        valid_command_names = list(reversed(sorted(valid_command_names)))
        command_map = {}
        codes = '1234567890abcdefghijklmnopqrstuvwxyz'
        for i, command_name in enumerate(valid_command_names):
            command_key = codes[i]
            command_map[command_key] = command_name
            print(command_key + ':', command_name)
        # Ask player for next command
        command_input = input('> ').strip()
        if command_input in command_map.keys():
            command = command_map[command_input]
            self.process_outcomes(self.logic[command]['Outcomes'])
        elif command_input in command_map.values():
            command = command_input
            self.process_outcomes(self.logic[command]['Outcomes'])
        else:
            print('command not valid:', command_input)
            raise Exception()
        print('')

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open('logic/logic.json') as open_file:
        logic = json.load(open_file)
        game = Game(logic)
        game.player['Knowledge - How to Acquire Neutron Bomb in Prologue'] = True
        game.player['Knowledge - How to Acquire Heart Refresh in Prologue'] = True
        game.player['Knowledge - How to Perform Neutron Bomb Death Skip'] = True
        # game.perform_check('Knowledge - Any Percent NSC')
        while True:
            game.play()