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
        # Must add the following to self.clone()
        self.history = []
        self.stages_visited = set()
        self.goal_achieved = False
        self.layer = 0
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
        result.layer = self.layer
        result.history = list(self.history)
        self.stages_visited = set(self.stages_visited)
        self.goal_achieved = self.goal_achieved
        self.layer = self.layer
        self.debug = self.debug
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

    def cheat_location(self, location_name: str, section_name: str, helper: str=None):
        self.state['Location'] = location_name
        self.state['Section'] = section_name
        if helper is None:
            if 'Helper' in self.state:
                self.state.pop('Helper')
        else:
            self.state['Helper'] = helper
    
    def cheat_command(self, location_name: str, command_name: str):
        command_data = self.commands[location_name]
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

    def process_command(self, command_name: str):
        location = self.state['Location']
        self.history.append((self.layer, location, command_name))
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
        if not self.goal_achieved:
            goal_achieved = False
            for (goal_name, requirements) in self.goals.items():
                for (key, expected_value) in requirements.items():
                    if key not in self.state or self.state[key] != expected_value:
                        break
                else:
                    goal_achieved = True
                    break
            if goal_achieved:
                self.goal_achieved = True

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

class Solver():
    def __init__(self, logic_core, skills):
        self.logic_core = logic_core
        for (skill_key, skill_value) in skills.items():
            self.logic_core['State'][skill_key] = skill_value
        self.results = {
            'Wins': [],
            'Losses': [],
        }
    
    def solve(self, reflexive_limit: int=3, max_layers: int=8):
        # TODO(sestren): Improve performance with memoization
        memo = {}
        solution_found = False
        initial_game = Game(self.logic_core['State'], self.logic_core['Commands'], self.logic_core['Goals'])
        work__solver = collections.deque()
        work__solver.appendleft((0, initial_game))
        while len(work__solver) > 0 and not solution_found:
            (step__solver, game__solver) = work__solver.pop()
            game__solver.layer = step__solver
            if game__solver.goal_achieved:
                solution_found = True
                self.results['Wins'].append((step__solver, game__solver))
                break
            (_, _, hashed_state__solver) = game__solver.get_key()
            if hashed_state__solver in memo and memo[hashed_state__solver] <= step__solver:
                print('seen', hashed_state__solver, 'with layer', memo[hashed_state__solver])
                continue
            memo[hashed_state__solver] = step__solver
            if step__solver >= max_layers:
                continue
            print(step__solver, game__solver.state['Location'])
            # Find all locations that are N-bonded with the current location (N = reflexive_limit)
            # Two locations are considered "N-bonded" if you can move from one to another via a series of N-reflexive commands
            # A command is considered "N-reflexive" if you can return to the same state as you had before executing it in at most N additional commands
            # Examples:
            # - Going through a normal two-way door is a 1-reflexive command, because you can immediately go back through the door
            # - Falling into a pit that allows you to return to your original location by first going through an intermediary doorway is a 2-reflexive command
            # - Falling into an inescapable pit without any special abilities is NOT reflexive
            # - Going through the far end of a Loading Room is a 3-reflexive command, because it involves:
            #   - Retreating to the loading room (this loading room is not the same as the one you started in, because you are in a new stage)
            #   - Loading the original stage
            #   - Returning to the loading room again
            bonded_locations = {}
            work__bonded = collections.deque()
            work__bonded.appendleft((0, game__solver))
            while len(work__bonded) > 0 and not solution_found:
                (step__bonded, game__bonded) = work__bonded.pop()
                if game__bonded.goal_achieved:
                    solution_found = True
                    self.results['Wins'].append((step__solver + 1, game__bonded))
                    break
                if game__bonded.location in bonded_locations:
                    continue
                bonded_locations[game__bonded.location] = [game__bonded, set()]
                (_, _, hashed_state__bonded) = game__bonded.get_key()
                # Find all N-reflexive commands at the current location
                reflexive_command_names = set()
                work__reflexive = collections.deque()
                for command in game__bonded.get_valid_command_names():
                    work__reflexive.appendleft((0, command, command, game__bonded.clone()))
                    bonded_locations[game__bonded.location][1].add(command)
                while len(work__reflexive) > 0:
                    (step__reflexive, original_command__reflexive, current_command__reflexive, game__reflexive) = work__reflexive.pop()
                    game__reflexive.process_command(current_command__reflexive)
                    (_, _, hashed_state__reflexive) = game__reflexive.get_key()
                    if hashed_state__reflexive == hashed_state__bonded:
                        reflexive_command_names.add(original_command__reflexive)
                        continue
                    if step__reflexive < reflexive_limit:
                        for next_command__reflexive in game__reflexive.get_valid_command_names():
                            work__reflexive.appendleft((step__reflexive + 1, original_command__reflexive, next_command__reflexive, game__reflexive.clone()))
                for reflexive_command_name in reflexive_command_names:
                    next_game__bonded = game__bonded.clone()
                    next_game__bonded.process_command(reflexive_command_name)
                    work__bonded.append((step__bonded + 1, next_game__bonded))
                bonded_locations[game__bonded.location][1] -= reflexive_command_names
            for (bonded_location, (game, valid_commands)) in sorted(bonded_locations.items()):
                for next_command__solver in valid_commands:
                    next_game__solver = game.clone()
                    next_game__solver.process_command(next_command__solver)
                    work__solver.appendleft((step__solver + 1, next_game__solver))

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
        with open(os.path.join('build', 'sandbox', 'data-core.json'), 'w') as data_core_json:
            json.dump(data_core, data_core_json, indent='    ', sort_keys=True)
        logic_core = roomrando.LogicCore(data_core, {}).get_core()
        logic_core['State']['Location'] = 'Castle Entrance, After Drawbridge'
        logic_core['State']['Section'] = 'Ground'
        # logic_core['State']['Location'] = 'Alchemy Laboratory, Slogra and Gaibon Boss Room'
        # logic_core['State']['Section'] = 'Ground'
        logic_core['Goals'] = {
            # 'Debug 1': {
            #     'Location': 'Castle Entrance, Cube of Zoe Room',
            # },
            # 'Debug 2': {
            #     'Location': 'Alchemy Laboratory, Slogra and Gaibon Boss Room',
            # },
            # 'Debug 3': {
            #     'Location': 'Alchemy Laboratory, Bloody Zombie Hallway',
            # },
            # 'Debug 4': {
            #     'Location': 'Marble Gallery, Long Hallway',
            # },
            # 'Debug 5': {
            #     'Location': 'Outer Wall, Exit to Marble Gallery',
            # },
            # 'Debug 6': {
            #     'Relic - Soul of Wolf': True,
            # },
            # 'Debug 7': {
            #     'Location': 'Marble Gallery, Long Hallway',
            #     'Relic - Soul of Wolf': True,
            # },
            # 'Debug 8': {
            #     'Location': 'Marble Gallery, Clock Room',
            #     'Relic - Soul of Wolf': True,
            # },
            'Debug 9': {
                'Location': 'Marble Gallery, Loading Room D',
            },
            # 'Debug 99': {
            #     'Location': 'Colosseum, Entrance',
            #     'Relic - Form of Mist': True,
            # },
        }
        with open(os.path.join('build', 'sandbox', 'logic-core.json'), 'w') as logic_core_json:
            json.dump(logic_core, logic_core_json, indent='    ', sort_keys=True)
        skills = json.load(skills_json)
        print('Solving')
        map_solver = Solver(logic_core, skills)
        # map_solver.solve(51 + 4)
        map_solver.solve(3, 10)
        if len(map_solver.results['Wins']) > 0:
            (winning_layers, winning_game) = map_solver.results['Wins'][-1]
            print('-------------')
            print('GOAL REACHED: Layer', winning_layers)
            print('History')
            for (layer, location, command_name) in winning_game.history:
                print('-', layer, location, ':', command_name)
            print('State')
            for (key, value) in winning_game.state.items():
                print('-', key, ':', value)
            print('-------------')
            while True:
                winning_game.play()
