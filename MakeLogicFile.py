import json
import yaml

# Commands in the logic file have the following restrictions:
# - Outcomes are equivalent across all requirements within the command
# - Outcomes are the only way to alter state
# - Requirements may not alter state

if __name__ == '__main__':
    logic = {}
    for file_name in (
        'logic/default.yaml',
        'logic/castle-entrance.yaml',
    ):
        with open(file_name) as open_file:
            yaml_obj = yaml.safe_load(open_file)
            logic.update(yaml_obj)
    with open('logic/logic.json', 'w') as open_file:
        json_string = json.dumps(
            logic,
            indent='    ',
            sort_keys=True,
        )
        open_file.write(json_string)