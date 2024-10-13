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

class Logic:
    def __init__(self):
        self.state = {
            'Character': 'Alucard',
            'Location': 'Castle Entrance, After Drawbridge',
            'Section': 'Ground',
            'Item - Alucard Sword': 1,
            'Item - Alucard Shield': 1,
            'Item - Dragon Helm': 1,
            'Item - Alucard Mail': 1,
            'Item - Twilight Cloak': 1,
            'Item - Necklace of J': 1,
            'Item - Neutron Bomb': 1,
            'Item - Heart Refresh': 1,
        }
        self.goals = {
            'Debug - Reach Fake Room With Teleporter A': {
                'Location': 'Castle Entrance, Fake Room With Teleporter A',
            },
            'Debug - Reach Fake Room With Teleporter B': {
                'Location': 'Castle Entrance, Fake Room With Teleporter B',
            },
            'Debug - Reach Fake Room With Teleporter C': {
                'Location': 'Castle Entrance, Fake Room With Teleporter C',
            },
            'Debug - Reach Fake Room With Teleporter D': {
                'Location': 'Castle Entrance, Fake Room With Teleporter D',
            },
        }
        self.commands = {}
        self.teleporters = {}
        for stage_folder in (
            'castle-entrance',
            # ('castle-entrance-revisited', 'Castle Entrance Revisited'),
            # ('alchemy-laboratory', 'Alchemy Laboratory'),
        ):
            folder_path = os.path.join('data', 'rooms', stage_folder)
            nodes = {}
            for file_name in os.listdir(folder_path):
                if file_name[-5:] != '.yaml':
                    continue
                file_path = os.path.join(folder_path, file_name)
                with open(file_path) as open_file:
                    yaml_obj = yaml.safe_load(open_file)
                    location_name = yaml_obj['Stage'] + ', ' + yaml_obj['Room']
                    self.commands[location_name] = yaml_obj['Commands']
                    for (node_name, node) in yaml_obj['Nodes'].items():
                        row = yaml_obj['Top'] + node['Row']
                        column = yaml_obj['Left'] + node['Column']
                        edge = node['Edge']
                        nodes[(row, column, edge)] = (location_name, node_name, node['Entry Section'])
                        exit = {
                            'Outcomes': {
                                'Location': None,
                                'Section': None,
                            },
                            'Requirements': {
                                'Default': {
                                    'Location': location_name,
                                    'Section': node['Exit Section']
                                },
                            },
                        }
                        self.commands[location_name]['Exit - ' + node_name] = exit
            for (row, column, edge), (location_name, node_name, section_name) in nodes.items():
                matching_row = row
                matching_column = column
                matching_edge = edge
                if edge == 'Top':
                    matching_edge = 'Bottom'
                    matching_row -= 1
                elif edge == 'Left':
                    matching_edge = 'Right'
                    matching_column -= 1
                elif edge == 'Bottom':
                    matching_edge = 'Top'
                    matching_row += 1
                elif edge == 'Right':
                    matching_edge = 'Left'
                    matching_column += 1
                (matching_location_name, matching_node_name, matching_section) = (None, 'Unknown', None)
                if (matching_row, matching_column, matching_edge) in nodes:
                    (matching_location_name, matching_node_name, matching_section) = nodes[(matching_row, matching_column, matching_edge)]
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Location'] = matching_location_name
                self.commands[location_name]['Exit - ' + node_name]['Outcomes']['Section'] = matching_section
        # with open(os.path.join('data', 'Teleporters.yaml')) as open_file:
        #     yaml_obj = yaml.safe_load(open_file)
        #     self.teleporters = yaml_obj
    
    def get_structure(self) -> dict:
        result = {
            'Commands': self.commands,
            'Goals': self.goals,
            'State': self.state,
        }
        return result

if __name__ == '__main__':
    logic = Logic()
    with open(os.path.join('build', 'logic', 'vanilla-logic.json'), 'w') as open_file:
        json_string = json.dumps(
            logic.get_structure(),
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)