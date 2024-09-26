import json
import yaml

# Commands in the logic file have the following restrictions:
# - Outcomes are equivalent across all requirements within the command
# - Outcomes are the only way to alter state
# - Requirements may not alter state

if __name__ == '__main__':
    logic = {
        'Rooms': {},
        'Teleporters': {},
    }
    for (stage_path, stage_name, room_name) in (
        # ('castle-entrance', 'Castle Entrance', 'Fake Room With Teleporter A'),
        # ('castle-entrance-revisited', 'Castle Entrance Revisited', 'Fake Room With Teleporter A'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Bat Card Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Bloody Zombie Hallway'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Blue Door Hallway'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Box Puzzle Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Cannon Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Cloth Cape Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Corridor to Elevator'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Elevator Shaft'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Empty Zig Zag Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Entryway'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Exit to Holy Chapel'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Exit to Marble Gallery'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Fake Room With Teleporter A'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Fake Room With Teleporter B'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Fake Room With Teleporter C'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Glass Vats'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Heart Max-Up Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Loading Room A'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Loading Room B'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Loading Room C'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Red Skeleton Lift Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Save Room A'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Save Room B'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Save Room C'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Secret Life Max-Up Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Short Zig Zag Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Skill of Wolf Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Slogra and Gaibon Boss Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Sunglasses Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Tall Spittlebone Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Tall Zig Zag Room'),
        ('alchemy-laboratory', 'Alchemy Laboratory', 'Tetromino Room'),
    ):
        file_name = 'data/rooms/' + stage_path + '/' + room_name + '.yaml'
        with open(file_name) as open_file:
            yaml_obj = yaml.safe_load(open_file)
            logic['Rooms'][stage_name + ', ' + room_name] = yaml_obj
    file_name = 'data/Teleporters.yaml'
    with open(file_name) as open_file:
        yaml_obj = yaml.safe_load(open_file)
        logic['Teleporters'] = yaml_obj
    with open('build/logic.json', 'w') as open_file:
        json_string = json.dumps(
            logic,
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)