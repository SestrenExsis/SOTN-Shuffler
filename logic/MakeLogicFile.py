import json
import os
import yaml

# Commands in the logic file have the following restrictions:
# - Requirements are interchangeable; any one of them can be used to satisfy the conditions for the command
# - Requirements may not alter state
# - Outcomes are the only way to alter state

if __name__ == '__main__':
    logic = {
        'State': {
            'Character': 'Alucard',
            'Location': 'Castle Entrance, Entryway',
            'Section': 'Ground',
            'Item - Alucard Sword': 1,
            'Item - Alucard Shield': 1,
            'Item - Dragon Helm': 1,
            'Item - Alucard Mail': 1,
            'Item - Twilight Cloak': 1,
            'Item - Necklace of J': 1,
            'Item - Neutron Bomb': 1,
            'Item - Heart Refresh': 1,
        },
        'Goals': {
            'Debug - Reach Loading Room A': {
                'Location': 'Castle Entrance, Loading Room A',
            },
            'Debug - Reach Loading Room B': {
                'Location': 'Castle Entrance, Loading Room B',
            },
            'Debug - Reach Loading Room C': {
                'Location': 'Castle Entrance, Loading Room C',
            },
            'Debug - Reach Loading Room D': {
                'Location': 'Castle Entrance, Loading Room D',
            },
        },
        'Commands': {},
        # 'Teleporters': {},
    }
    for stage_folder in (
        'castle-entrance',
        # ('castle-entrance-revisited', 'Castle Entrance Revisited'),
        # ('alchemy-laboratory', 'Alchemy Laboratory'),
    ):
        folder_path = os.path.join('data', 'rooms', stage_folder)
        for file_name in os.listdir(folder_path):
            if file_name[-5:] != '.yaml':
                continue
            file_path = os.path.join(folder_path, file_name)
            with open(file_path) as open_file:
                yaml_obj = yaml.safe_load(open_file)
                location_name = yaml_obj['Stage'] + ', ' + yaml_obj['Room']
                logic['Commands'][location_name] = yaml_obj['Commands']
                for (exit_key, node) in yaml_obj['Nodes'].items():
                    # Exit - Lower-Right Passage:
                    outcomes = {}
                    # TODO(sestren): Match edge based on map position inside the same stage
                    matching_location_name = 'Castle Entrance, Zombie Hallway'
                    matching_section = 'Main'
                    exit = {
                        'Outcomes': {
                            'Location': matching_location_name,
                            'Section': matching_section,
                        },
                        'Requirements': {
                            'Default': {
                                'Location': location_name,
                                'Section': node['Section']
                            },
                        },
                    }
                    logic['Commands'][location_name]['Exit - ' + exit_key] = exit
    # with open(os.path.join('data', 'Teleporters.yaml')) as open_file:
    #     yaml_obj = yaml.safe_load(open_file)
    #     logic['Teleporters'] = yaml_obj
    with open(os.path.join('build', 'logic', 'vanilla-logic.json'), 'w') as open_file:
        json_string = json.dumps(
            logic,
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)