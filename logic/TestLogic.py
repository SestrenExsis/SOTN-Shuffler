import json
import os

class Game:
    def __init__(self,
        logic_core,
        starting_location: str='Name Entry Screen',
        starting_section: str='Primary'
    ):
        self.logic_core = logic_core
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
                if key not in self.logic_core['State']:
                    if type(value) == str:
                        target_value = 'NONE'
                    elif type(value) == bool:
                        target_value = False
                    elif type(value) in (int, dict):
                        target_value = 0
                else:
                    target_value = self.logic_core['State'][key]
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

    def process_command(self, command_name: str):
        self.commands.append(command_name)
        location_name = self.logic_core['State']['Location']
        command_data = {}
        if 'Commands' in self.logic_core and location_name in self.logic_core['Commands']:
            command_data = self.logic_core['Commands'][location_name]
        # Apply outcomes from the command
        for (key, value) in command_data[command_name]['Outcomes'].items():
            if type(value) in (str, bool):
                if key not in self.logic_core['State'] or self.logic_core['State'][key] != value:
                    print('  +', key, ': ', value)
                self.logic_core['State'][key] = value
            elif type(value) in (int, float):
                if key not in self.logic_core['State']:
                    self.logic_core['State'][key] = 0
                print('  +', key, ': ', value)
                self.logic_core['State'][key] += value

    def get_valid_command_names(self) -> list:
        result = set()
        # Add choices for valid commands the player can issue
        location_name = self.logic_core['State']['Location']
        command_data = {}
        if 'Commands' in self.logic_core and location_name in self.logic_core['Commands']:
            command_data = self.logic_core['Commands'][location_name]
        for (command_name, command_info) in command_data.items():
            if self.validate(command_info['Requirements']):
                result.add(command_name)
        result = list(reversed(sorted(result)))
        return result

    def play(self):
        print('@', self.logic_core['State']['Location'], '-', self.logic_core['State']['Section'])
        command_map = {}
        codes = '1234567890abcdefghijklmnopqrstuvwxyz'
        valid_command_names = self.get_valid_command_names()
        for (i, command_name) in enumerate(valid_command_names):
            command_code = codes[i]
            command_map[command_code] = command_name
            print(command_code + ':', command_name)
        # Ask player for next command
        command_input = input('> ').strip()
        if command_input in command_map.keys():
            command_name = command_map[command_input]
            self.process_command(command_name)
        elif command_input in command_map.values():
            command_name = command_input
            self.process_command(command_name)
        else:
            print('command not valid:', command_input)
            raise Exception()
        print('')

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open(os.path.join('build', 'sandbox', 'logic-core.json')) as logic_core_json:
        logic_core = json.load(logic_core_json)
        game = Game(logic_core, 'Castle Entrance, After Drawbridge', 'Ground')
        # game.player['Progression - Bat Transformation'] = True
        while True:
            game.play()