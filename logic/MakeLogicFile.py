import json
import os
import yaml

# Triggers in the logic file have the following restrictions:
# - Requirements are interchangeable; any one of them can be used to satisfy the conditions for the trigger
# - Requirements may not alter state
# - Outcomes are the only way to alter state

if __name__ == '__main__':
    logic = {
        'Rooms': {},
        'Teleporters': {},
    }
    for (stage_folder, stage_name) in (
        ('castle-entrance', 'Castle Entrance'),
        ('castle-entrance-revisited', 'Castle Entrance Revisited'),
        ('alchemy-laboratory', 'Alchemy Laboratory'),
    ):
        folder_path = os.path.join('data', 'rooms', stage_folder)
        for file_name in os.listdir(folder_path):
            if file_name[-5:] != '.yaml':
                continue
            room_name = file_name[:-5]
            file_path = os.path.join(folder_path, file_name)
            with open(file_path) as open_file:
                yaml_obj = yaml.safe_load(open_file)
                logic['Rooms'][stage_name + ', ' + room_name] = yaml_obj
    with open(os.path.join('data', 'Teleporters.yaml')) as open_file:
        yaml_obj = yaml.safe_load(open_file)
        logic['Teleporters'] = yaml_obj
    with open(os.path.join('build', 'logic.json'), 'w') as open_file:
        json_string = json.dumps(
            logic,
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)