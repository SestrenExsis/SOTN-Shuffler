import json
import yaml

# Commands in the logic file have the following restrictions:
# - Outcomes are equivalent across all requirements within the command
# - Outcomes are the only way to alter state
# - Requirements may not alter state

if __name__ == '__main__':
    logic = {}
    for room_name in (
        'Bat Card Room',
        'Bloody Zombie Hallway',
        'Blue Door Hallway',
        'Box Puzzle Room',
        'Cannon Room',
        'Cloth Cape Room',
        'Corridor to Elevator',
        'Elevator Shaft',
        'Empty Zig Zag Room',
        'Entryway',
        'Exit to Holy Chapel',
        'Exit to Marble Gallery',
        'Fake Castle Entrance Room',
        'Fake Marble Gallery Room',
        'Fake Royal Chapel Room',
        'Glass Vats',
        'Heart Max-Up Room',
        'Loading Room A',
        'Loading Room B',
        'Loading Room C',
        'Red Skeleton Lift Room',
        'Save Room A',
        'Save Room B',
        'Save Room C',
        'Secret Life Max-Up Room',
        'Short Zig Zag Room',
        'Skill of Wolf Room',
        'Slogra and Gaibon Boss Room',
        'Sunglasses Room',
        'Tall Spittlebone Room',
        'Tall Zig Zag Room',
        'Tetromino Room',
    ):
        file_name = 'data/rooms/alchemy-laboratory/' + room_name + '.yaml'
        with open(file_name) as open_file:
            yaml_obj = yaml.safe_load(open_file)
            logic[room_name] = {}
            logic[room_name] = yaml_obj
    with open('build/logic.json', 'w') as open_file:
        json_string = json.dumps(
            logic,
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)