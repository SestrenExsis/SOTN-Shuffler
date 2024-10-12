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
        nodes = {}
        for file_name in os.listdir(folder_path):
            if file_name[-5:] != '.yaml':
                continue
            file_path = os.path.join(folder_path, file_name)
            with open(file_path) as open_file:
                yaml_obj = yaml.safe_load(open_file)
                location_name = yaml_obj['Stage'] + ', ' + yaml_obj['Room']
                logic['Commands'][location_name] = yaml_obj['Commands']
                for (node_name, node) in yaml_obj['Nodes'].items():
                    row = yaml_obj['Top'] + node['Row']
                    column = yaml_obj['Left'] + node['Column']
                    edge = node['Edge']
                    nodes[(row, column, edge)] = (location_name, node_name, node['Section'])
                    exit = {
                        'Outcomes': {
                            'Location': None,
                            'Section': None,
                        },
                        'Requirements': {
                            'Default': {
                                'Location': location_name,
                                'Section': node['Section']
                            },
                        },
                    }
                    logic['Commands'][location_name]['Exit - ' + node_name] = exit
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
            logic['Commands'][location_name]['Exit - ' + node_name]['Outcomes']['Location'] = matching_location_name
            logic['Commands'][location_name]['Exit - ' + node_name]['Outcomes']['Section'] = matching_section
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