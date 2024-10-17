import json
import os

class Game:
    def __init__(self,
        logic,
        starting_location: str='Name Entry Screen',
        starting_section: str='Primary'
    ):
        self.logic = logic
        self.starting_location = starting_location
        self.starting_section = starting_section
        self.commands = []
    
    def validate(self, requirements):
        result = False
        for requirement in requirements.values():
            # All checks within a requirement list must pass
            valid_ind = True
            for (key, value) in requirement.items():
                target_value = None
                if key not in self.logic['State']:
                    if type(value) == str:
                        target_value = 'NONE'
                    elif type(value) == bool:
                        target_value = False
                    elif type(value) in (int, dict):
                        target_value = 0
                else:
                    target_value = self.logic['State'][key]
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
        for (key, value) in outcomes.items():
            if type(value) in (str, bool):
                if key not in self.logic['State'] or self.logic['State'][key] != value:
                    print('  +', key, ': ', value)
                self.logic['State'][key] = value
            elif type(value) in (int, float):
                if key not in self.logic['State']:
                    self.logic['State'][key] = 0
                print('  +', key, ': ', value)
                self.logic['State'][key] += value

    def play(self):
        print('@', self.logic['State']['Location'], '-', self.logic['State']['Section'])
        valid_command_names = set()
        # Add choices for valid commands the player can issue
        location_name = self.logic['State']['Location']
        commands = {}
        if 'Commands' in self.logic and location_name in self.logic['Commands']:
            commands = self.logic['Commands'][location_name]
        for command_name, command_info in commands.items():
            if self.validate(command_info['Requirements']):
                valid_command_names.add(command_name)
        valid_command_names = list(reversed(sorted(valid_command_names)))
        command_map = {}
        codes = '1234567890abcdefghijklmnopqrstuvwxyz'
        for (i, command_name) in enumerate(valid_command_names):
            command_code = codes[i]
            command_map[command_code] = command_name
            print(command_code + ':', command_name)
        # Ask player for next command
        command_input = input('> ').strip()
        if command_input in command_map.keys():
            command_name = command_map[command_input]
            self.process_outcomes(commands[command_name]['Outcomes'])
        elif command_input in command_map.values():
            command_name = command_input
            self.process_outcomes(commands[command_name]['Outcomes'])
        else:
            print('command not valid:', command_input)
            raise Exception()
        print('')

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open(os.path.join('build', 'sandbox', 'logic-core.json')) as open_file:
        logic = json.load(open_file)
        game = Game(logic, 'Castle Entrance, After Drawbridge', 'Ground')
        # game.player['Progression - Bat Transformation'] = True
        while True:
            game.play()