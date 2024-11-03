import collections
import copy
import hashlib
import json
import mapper
import os
import random
import mapper
import yaml

class DataCore:
    def __init__(self):
        self.rooms = {}
        self.teleporters = {}
        for stage_folder in (
            'castle-entrance',
            # 'castle-entrance-revisited',
            'alchemy-laboratory',
            'marble-gallery',
            'outer-wall',
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

class LogicCore:
    def __init__(self, data_core, changes):
        print('Build logic core')
        self.commands = {}
        for stage_name in (
            'Castle Entrance',
            'Alchemy Laboratory',
            'Marble Gallery',
            'Outer Wall',
        ):
            nodes = {}
            for (location_name, room_data) in data_core['Rooms'].items():
                # print(stage_name, location_name)
                if data_core['Rooms'][location_name]['Stage'] != stage_name:
                    continue
                room_top = room_data['Top']
                room_left = room_data['Left']
                if 'Rooms' in changes and location_name in changes['Rooms']:
                    if 'Top' in changes['Rooms'][location_name]:
                        room_top = changes['Rooms'][location_name]['Top']
                    if 'Left' in changes['Rooms'][location_name]:
                        room_left = changes['Rooms'][location_name]['Left']
                self.commands[location_name] = room_data['Commands']
                for (node_name, node) in room_data['Nodes'].items():
                    row = room_top + node['Row']
                    column = room_left + node['Column']
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
        # Replace source teleporter locations with their targets
        for (location_name, location_info) in self.commands.items():
            for (command_name, command_info) in location_info.items():
                if 'Outcomes' in command_info and 'Location' in command_info['Outcomes']:
                    old_location_name = command_info['Outcomes']['Location']
                    if old_location_name in data_core['Teleporters']['Sources']:
                        # Castle Entrance, Fake Room With Teleporter A Exit - Left Passage
                        source = data_core['Teleporters']['Sources'][old_location_name]
                        target = data_core['Teleporters']['Targets'][source['Target']]
                        new_location_name = target['Stage'] + ', ' + target['Room']
                        self.commands[location_name][command_name]['Outcomes']['Location'] = new_location_name
                        target_section_name = data_core['Rooms'][new_location_name]['Nodes'][target['Node']]['Entry Section']
                        self.commands[location_name][command_name]['Outcomes']['Section'] = target_section_name
        # Delete fake rooms mentioned as teleporter locations
        for location_name in data_core['Teleporters']['Sources']:
            if 'Fake' in location_name:
                self.commands.pop(location_name, None)
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
            'Debug - Reach Marble Gallery, Long Hallway': {
                'Location': 'Marble Gallery, Long Hallway',
            },
            # 'Debug - Reach Outer Wall, Exit to Marble Gallery': {
            #     'Location': 'Outer Wall, Exit to Marble Gallery',
            # },
            # 'Debug - Reach Outer Wall, Elevator Shaft Room': {
            #     'Location': 'Outer Wall, Elevator Shaft Room',
            # },
            # 'Debug - Reach Outer Wall, Elevator Shaft Room': {
            #     'Location': 'Outer Wall, Elevator Shaft Room',
            #     'Progression - Elevator in Outer Wall Activated': True,
            # },
            # 'Debug - Reach Outer Wall, Elevator Shaft Room': {
            #     'Location': 'Outer Wall, Elevator Shaft Room',
            #     'Section': 'Elevator Shaft',
            # },
            # 'Debug - Get Soul of Wolf': {
            #     'Relic - Soul of Wolf': True,
            # },
        }
    
    def get_core(self) -> dict:
        result = {
            'State': self.state,
            'Goals': self.goals,
            'Commands': self.commands,
        }
        return result

class Game:
    def __init__(self,
        starting_state: dict,
        commands: dict,
        goals: dict,
    ):
        self.state = copy.deepcopy(starting_state)
        self.commands = commands
        self.goals = goals
        self.starting_state = copy.deepcopy(starting_state)
        self.history = []
        self.stages_visited = set()
        self.debug = False
    
    def clone(self):
        result = Game(self.state, self.commands, self.goals)
        result.history = list(self.history)
        return result
    
    def get_key(self) -> int:
        hashed_state = hash(json.dumps(self.state, sort_keys=True))
        result = (self.state['Location'], self.state['Section'], hashed_state)
        return result
    
    def validate(self, requirements):
        result = False
        for requirement in requirements.values():
            # All checks within a requirement list must pass
            valid_ind = True
            for (key, value) in requirement.items():
                target_value = None
                if key not in self.state:
                    if type(value) == str:
                        target_value = 'NONE'
                    elif type(value) == bool:
                        target_value = False
                    elif type(value) in (int, dict):
                        target_value = 0
                else:
                    target_value = self.state[key]
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
        location = self.state['Location']
        self.history.append((command_name, location))
        stage = location[:location.find(',')]
        self.stages_visited.add(stage)
        command_data = {}
        if self.state['Location'] in self.commands:
            command_data = self.commands[self.state['Location']]
        # Apply outcomes from the command
        for (key, value) in command_data[command_name]['Outcomes'].items():
            if type(value) in (str, bool):
                if self.debug and (key not in self.state or self.state[key] != value):
                    print('  +', key, ': ', value)
                self.state[key] = value
            elif type(value) in (int, float):
                if key not in self.state:
                    self.state[key] = 0
                if self.debug:
                    print('  +', key, ': ', value)
                self.state[key] += value

    def get_valid_command_names(self) -> list:
        result = set()
        # Add choices for valid commands the player can issue
        command_data = {}
        if self.state['Location'] in self.commands:
            command_data = self.commands[self.state['Location']]
        for (command_name, command_info) in command_data.items():
            if self.validate(command_info['Requirements']):
                result.add(command_name)
        result = list(reversed(sorted(result)))
        return result

    def play(self):
        print('@', self.state['Location'], '-', self.state['Section'])
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

def solver__solve(logic_core, rules, skills, max_steps=8):
    print('Solve')
    modified_state = logic_core['State']
    for (skill_key, skill_value) in skills.items():
        modified_state[skill_key] = skill_value
    winning_game_count = 0
    winning_games = collections.deque()
    losing_game_count = 0
    losing_games = {}
    memo = {} # (location, section, hashed_state): (distance, game)
    work = collections.deque()
    work.appendleft((0, Game(modified_state, logic_core['Commands'], logic_core['Goals'])))
    while len(work) > 0:
        (distance, game) = work.pop()
        goal_reached = False
        for (goal_name, requirements) in game.goals.items():
            for (key, expected_value) in requirements.items():
                if key not in game.state or game.state[key] != expected_value:
                    break
            else:
                goal_reached = True
                break
        if goal_reached:
            winning_games.append((game.state, game.history))
            while len(winning_games) > 10:
                winning_games.popleft()
            winning_game_count += 1
            break
        if distance > (max_steps * (1 + len(game.stages_visited))):
            location = game.state['Location']
            if location not in losing_games:
                losing_games[location] = 0
            losing_games[location] += 1
            continue
        game_key = game.get_key()
        if game_key in memo and memo[game_key][0] < distance:
            continue
        memo[game_key] = (distance, game)
        commands = game.get_valid_command_names()
        if len(commands) < 1:
            location = game.state['Location']
            if location not in losing_games:
                losing_games[location] = 0
            losing_games[location] += 1
            continue
        random.shuffle(commands) # Randomize the order to prevent favoring commands by alphabetical order
        for command_name in commands:
            next_game = game.clone()
            next_game.process_command(command_name)
            work.appendleft((distance + 1, next_game))
    print('Losing games, last location')
    for (location, count) in losing_games.items():
        print(' ', location, ':', count)
    return {
        'Win Count': winning_game_count,
        'Wins': list(winning_games),
        'Loss Count': losing_game_count,
        'Losses': losing_games,
    }

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py
    '''
    try:
        with open(os.path.join('build', 'sandbox', 'generated-stages.json'), 'r') as generated_stages_json:
            generated_stages = json.load(generated_stages_json)
    except:
        generated_stages = {
            'Castle Entrance': [],
            'Alchemy Laboratory': [],
            'Marble Gallery': [],
            'Outer Wall': [],
        }
    with (
        open(os.path.join('build', 'sandbox', 'rules.json')) as rules_json,
        open(os.path.join('build', 'sandbox', 'skills.json')) as skills_json,
    ):
        print('Build data core')
        data_core = DataCore().get_core()
        with open(os.path.join('build', 'sandbox', 'data-core.json'), 'w') as data_core_json:
            json.dump(data_core, data_core_json, indent='    ', sort_keys=True)
        rules = json.load(rules_json)
        skills = json.load(skills_json)
        # Keep randomizing until a solution is found
        while True:
            print('')
            # Randomize
            stages = {}
            stages_to_process = (
                ('Castle Entrance', random.randint(0, 2 ** 64)),
                ('Alchemy Laboratory', random.randint(0, 2 ** 64)),
                ('Marble Gallery', random.randint(0, 2 ** 64)),
                ('Outer Wall', random.randint(0, 2 ** 64)),
            )
            print('Randomize with seeds')
            for (stage_name, stage_seed) in stages_to_process:
                print(stage_name, stage_seed, end=' ')
                stage_map = mapper.Mapper(data_core, stage_name, stage_seed)
                while True:
                    stage_map.generate()
                    if stage_map.validate():
                        break
                    if stage_map.attempts > 2000:
                        if stage_name in generated_stages and len(generated_stages[stage_name]) > 0:
                            prebaked_stage = stage_map.rng.choice(generated_stages[stage_name])
                            prebaked_map = mapper.Mapper(data_core, stage_name, prebaked_stage['Seed'])
                            prebaked_map.generate()
                            assert prebaked_map.validate()
                            hash_of_changes = hashlib.sha256(json.dumps(prebaked_map.stage.get_changes(), sort_keys=True).encode()).hexdigest()
                            assert hash_of_changes == prebaked_stage['Hash of Changes']
                            stage_map = prebaked_map
                            if stage_map.validate():
                                break
                stages[stage_name] = stage_map
                print(stage_map.current_seed)
            # Current stage
            # stage_name = 'Outer Wall'
            # print(stage_name)
            # stage_map = mapper.Mapper(data_core, stage_name, random.randint(0, 2 ** 64))
            # while True:
            #     stage_map.generate()
            #     rooms_found = set(stage_map.stage.rooms)
            #     if len(rooms_found) >= 23:
            #         print(stage_name, len(rooms_found), stage_map.current_seed)
            #         # for row_data in stage_map.stage.get_stage_spoiler(data_core):
            #         #     print(row_data)
            #         # for row_data in stage_map.stage.get_room_spoiler(data_core):
            #         #     print(row_data)
            #         for room_name in sorted(data_core['Rooms']):
            #             if room_name.startswith('Outer Wall, ') and room_name not in rooms_found:
            #                 print(' ' , room_name)
            #     if stage_map.validate():
            #         break
            # stages[stage_name] = stage_map
            # ...
            changes = {
                'Rooms': {}
            }
            for (stage_name, stage_map) in stages.items():
                stage_changes = stage_map.stage.get_changes()
                for room_name in stage_changes['Rooms']:
                    changes['Rooms'][room_name] = {
                        'Index': stage_changes['Rooms'][room_name]['Index'],
                        'Top': stage_changes['Rooms'][room_name]['Top'],
                        'Left': stage_changes['Rooms'][room_name]['Left'],
                    }
            # Build
            logic_core = LogicCore(data_core, changes).get_core()
            # Solve
            solutions = solver__solve(logic_core, rules, skills, 12)
            # Halt and write files if solution found
            if solutions['Win Count'] > 0:
                with open(os.path.join('build', 'sandbox', 'changes.json'), 'w') as changes_json:
                    json.dump(changes, changes_json, indent='    ', sort_keys=True)
                with open(os.path.join('build', 'sandbox', 'logic-core.json'), 'w') as logic_core_json:
                    json.dump(logic_core, logic_core_json, indent='    ', sort_keys=True)
                with open(os.path.join('build', 'sandbox', 'solutions.json'), 'w') as solutions_json:
                    json.dump(solutions, solutions_json, indent='    ', sort_keys=True)
                # patcher.patch(changes.json, 'build/patch.ppf')
                break