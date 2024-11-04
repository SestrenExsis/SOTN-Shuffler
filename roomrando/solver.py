import collections
import copy
import json
import os
import random

import roomrando

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
    
    @property
    def location(self):
        result = [self.state['Location'], self.state['Section']]
        if 'Helper' in self.state:
            result.append(self.state['Helper'])
        result = tuple(result)
        return result
    
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

class Solver2():
    # A command is considered "n-reflexive" if you can return to the same state as you had before executing it in at most n additional commands
    # Examples:
    # - Going through a normal two-way door is a 1-reflexive command, because you can immediately go back through the door
    # - Falling into a pit that allows you to return to your original location by first going through an intermediary doorway is a 2-reflexive command
    # - Falling into an inescapable pit without any special abilities is NOT reflexive
    # Two locations are considered "n-bonded" if you can move from one to another via a series of n-reflexive commands
    def __init__(self, logic_core, skills):
        self.logic_core = logic_core
        for (skill_key, skill_value) in skills.items():
            self.logic_core['State'][skill_key] = skill_value
    
    def solve(self):
        # Find all locations that are 1-bonded with the current location
        bonded_locations = set()
        work = [(0, Game(self.logic_core['State'], self.logic_core['Commands'], self.logic_core['Goals']))]
        while len(work) > 0:
            (step_count, game_0) = work.pop()
            bonded_locations.add(game_0.location)
            (location_0, section_0, hashed_state_0) = game_0.get_key()
            # Find 1-reflexive commands
            reflexive_command_names = set()
            for command_name_0 in game_0.get_valid_command_names():
                game_1 = game_0.clone()
                game_1.process_command(command_name_0)
                (location_1, section_1, hashed_state_1) =  game_1.get_key()
                if (hashed_state_1 == hashed_state_0): # Nothing changes after calling the command, so ignore it
                    continue
                reflexive_ind = False
                for command_name_1 in game_1.get_valid_command_names():
                    game_2 = game_1.clone()
                    game_2.process_command(command_name_1)
                    (location_2, section_2, hashed_state_2) =  game_2.get_key()
                    if (hashed_state_2 == hashed_state_0): # There exists a command after the first command that can return to the old state
                        reflexive_ind = True
                        break
                if reflexive_ind:
                    reflexive_command_names.add(command_name_0)
                    bonded_locations.add(game_1.location)
            print('1-reflexive commands')
            for command_name in reflexive_command_names:
                print(' ', command_name)

        print('1-bonded locations')
        for location in bonded_locations:
            print(' ', location)

class Solver():
    def __init__(self, logic_core, skills):
        self.logic_core = logic_core
        for (skill_key, skill_value) in skills.items():
            self.logic_core['State'][skill_key] = skill_value
        # TODO(sestren): Add game rules alongside skills as a modifer
        self.winning_game_count = 0
        self.winning_games = collections.deque()
        self.losing_game_count = 0
        self.losing_games = {}
        self.memo = {} # (location, section, hashed_state): (distance, game)
        self.work = collections.deque()

    def solve(self, max_steps=8):
        self.winning_game_count = 0
        self.winning_games = collections.deque()
        self.losing_game_count = 0
        self.losing_games = {}
        self.memo = {} # (location, section, hashed_state): (distance, game)
        self.work = collections.deque()
        self.work.appendleft((0, Game(self.logic_core['State'], self.logic_core['Commands'], self.logic_core['Goals'])))
        while len(self.work) > 0:
            (distance, game) = self.work.pop()
            goal_reached = False
            for (goal_name, requirements) in game.goals.items():
                for (key, expected_value) in requirements.items():
                    if key not in game.state or game.state[key] != expected_value:
                        break
                else:
                    goal_reached = True
                    break
            if goal_reached:
                self.winning_games.append((game.state, game.history))
                while len(self.winning_games) > 10:
                    self.winning_games.popleft()
                self.winning_game_count += 1
                break
            if distance > max_steps:
                location = game.state['Location']
                if location not in self.losing_games:
                    self.losing_games[location] = 0
                self.losing_games[location] += 1
                continue
            game_key = game.get_key()
            if game_key in self.memo and self.memo[game_key][0] < distance:
                continue
            self.memo[game_key] = (distance, game)
            commands = game.get_valid_command_names()
            if len(commands) < 1:
                location = game.state['Location']
                if location not in self.losing_games:
                    self.losing_games[location] = 0
                self.losing_games[location] += 1
                continue
            random.shuffle(commands) # Randomize the order to prevent favoring commands based on their name
            for command_name in commands:
                next_game = game.clone()
                next_game.process_command(command_name)
                self.work.appendleft((distance + 1, next_game))

if __name__ == '__main__':
    '''
    Usage
    python solver.py
    '''
    SOLVER_VERSION = '0.0.0'
    with (
        open(os.path.join('build', 'sandbox', 'skills.json')) as skills_json,
    ):
        data_core = roomrando.DataCore().get_core()
        logic_core = roomrando.LogicCore(data_core, {}).get_core()
        logic_core['Goals'] = {
            'Debug': {
                'Location': 'Marble Gallery, Pathway After Left Statue',
            },
        }
        with open(os.path.join('build', 'sandbox', 'logic-core.json'), 'w') as logic_core_json:
            json.dump(logic_core, logic_core_json, indent='    ', sort_keys=True)
        skills = json.load(skills_json)
        print('Solving')
        map_solver = Solver(logic_core, skills)
        map_solver.solve(51 + 4)
        # Halt and write files if solution found
        solutions = {
            'Win Count': map_solver.winning_game_count,
            'Wins': list(map_solver.winning_games),
            'Loss Count': map_solver.losing_game_count,
            'Losses': map_solver.losing_games,
            'Solver Version': SOLVER_VERSION,
        }
        with open(os.path.join('build', 'sandbox', 'solutions.json'), 'w') as solutions_json:
            json.dump(solutions, solutions_json, indent='    ', sort_keys=True)
        print('Wins:', map_solver.winning_game_count)
        map_solver2 = Solver2(logic_core, skills)
        map_solver2.solve()