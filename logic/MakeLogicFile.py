import json
import os
import yaml

# Commands in the logic file have the following restrictions:
# - Requirements are interchangeable; any one of them can be used to satisfy the conditions for the command
# - Requirements may not alter state
# - Outcomes are the only way to alter state

presets = {
    'Skillset - Casual': {
    },
    'Skillset - Standard': {
        'Technique - Diagonal Gravity Jump': True,
        'Technique - Multiple Gravity Jumps': True,
        'Knowledge - How to Open Secret Wall in Merman Room': True,
        'Technique - Precise Corner Mist': True,
    },
    'Skillset - Advanced': {
        'Technique - Pixel-Perfect Diagonal Gravity Jump Through Narrow Gap': True,
        'Technique - Wolf-Mist Rise': True,
    },
    'Skillset - Beyond': {
        'Technique - Extended Wolf-Mist Rise': True,
    },
    'Ruleset - Alucard Glitchless': {
    },
    'Ruleset - Alucard No Major Glitches': {
        'Rule - Big Toss Death Skip Allowed': True,
    },
    'Ruleset - Alucard Any%': {
        'Rule - Big Toss Death Skip Allowed': True,
        'Rule - Forward Shift Line Allowed': True,
        'Rule - Reverse Shift Line Allowed': True,
        'Rule - Shop Glitch Allowed': True,
    },
}

class DataCore:
    def __init__(self):
        self.rooms = {}
        self.teleporters = {}
        for stage_folder in (
            'castle-entrance',
            # 'castle-entrance-revisited',
            # 'alchemy-laboratory',
        ):
            folder_path = os.path.join('data', 'rooms', stage_folder)
            for file_name in os.listdir(folder_path):
                if file_name[-5:] != '.yaml':
                    continue
                file_path = os.path.join(folder_path, file_name)
                with open(file_path) as open_file:
                    yaml_obj = yaml.safe_load(open_file)
                    room_name = yaml_obj['Stage'] + ', ' + yaml_obj['Room']
                    self.rooms[room_name] = yaml_obj
        with open(os.path.join('data', 'Teleporters.yaml')) as open_file:
            yaml_obj = yaml.safe_load(open_file)
            self.teleporters = yaml_obj
    
    def get_core(self) -> dict:
        result = {
            'Rooms': self.rooms,
            'Teleporters': self.teleporters,
        }
        return result

if __name__ == '__main__':
    data = DataCore()
    with open(os.path.join('build', 'sandbox', 'data-core.json'), 'w') as open_file:
        json_string = json.dumps(
            data.get_core(),
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)