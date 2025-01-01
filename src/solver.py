# External libraries
import argparse
import collections
import copy
import heapq
import json
import os

# Local libraries
import mapper

class Game:
    DEFAULT_BOOLEAN = False
    DEFAULT_STRING = 'NONE'
    DEFAULT_NUMBER = 0
    def __init__(self, logic_core: dict, starting_state: dict=None):
        self.logic_core = copy.deepcopy(logic_core)
        if starting_state is None:
            starting_state = logic_core['State']
        self.current_state = copy.deepcopy(starting_state)
        self.commands = self.logic_core['Commands']
        # Must add the following to self.clone()
        self.history = []
        self.stages_visited = set()
        self.goal_achieved = False
        self.layer = 0
        self.debug = False
    
    # TODO(sestren): Implement __eq__, __gt__, etc.
    def __lt__(self, other) -> bool:
        result = self.get_key() < other.get_key()
        return result
    
    @property
    def location(self):
        result = [self.current_state['Location'], self.current_state['Section']]
        if 'Helper' in self.current_state:
            result.append(self.current_state['Helper'])
        result = tuple(result)
        return result
    
    def clone(self):
        result = Game(self.logic_core, self.current_state)
        result.layer = self.layer
        result.history = list(self.history)
        self.stages_visited = set(self.stages_visited)
        self.goal_achieved = self.goal_achieved
        self.layer = self.layer
        self.debug = self.debug
        return result

    def cleanup_state(self):
        # Remove default values in state before calculating hash of state
        keys_to_remove = set()
        for (key, value) in self.current_state.items():
            if type(value) == str:
                if value == self.DEFAULT_STRING:
                    keys_to_remove.add(key)
            elif type(value) == bool:
                if value == self.DEFAULT_BOOLEAN:
                    keys_to_remove.add(key)
            elif type(value) in (int, dict):
                if value == self.DEFAULT_NUMBER:
                    keys_to_remove.add(key)
        for key in keys_to_remove:
            self.current_state.pop(key)
    
    def get_score(self) -> int:
        scores = {
            'Check - Colosseum Library Card': 5.0,
            'Progression - Alchemy Laboratory Stage Reached': 16.0,
            'Progression - Castle Entrance Revisited Stage Reached': 4.0,
            'Progression - Castle Entrance Stage Reached': 16.0,
            'Progression - Colosseum Stage Reached': 9.0,
            'Progression - Long Library Stage Reached': 8.0,
            'Progression - Marble Gallery Stage Reached': 19.0,
            'Progression - Olrox\'s Quarters Stage Reached': 12.0,
            'Progression - Outer Wall Stage Reached': 11.0,
            'Progression - Clock Tower Stage Reached': 8.0,
            'Progression - Warp Rooms Stage Reached': 7.0,
            'Progression - Castle Keep Stage Reached': 8.0,
            'Progression - Royal Chapel Stage Reached': 12.0,
            'Relic - Cube of Zoe': 3.0,
            'Relic - Form of Mist': 5.0,
            'Relic - Faerie Scroll': 1.0,
            'Relic - Gravity Boots': 10.0,
            'Relic - Jewel of Open': 5.0,
            'Relic - Leap Stone': 8.0,
            'Relic - Power of Mist': 3.0,
            'Relic - Soul of Bat': 15.0,
            'Relic - Soul of Wolf': 10.0,
            'Status - Breakable Ceiling in Blade Master Room Broken': 2.0,
            'Status - Breakable Ceiling in Catwalk Crypt Broken': 2.0,
            'Status - Breakable Floor in Tall Zig Zag Room Broken': 2.0,
            'Status - Breakable Wall in Grand Staircase Broken': 2.0,
            'Status - Breakable Wall in Tall Zig Zag Room Broken': 2.0,
            'Status - Cannon Activated': 2.0,
            'Status - Elevator in Colosseum Unlocked': 2.0,
            'Status - Elevator in Outer Wall Activated': 3.0,
            'Status - Lower-Left Gear in Clock Tower Set': 1.25,
            'Status - Lower-Right Gear in Clock Tower Set': 1.25,
            'Status - Pressure Plate in Marble Gallery Activated': 5.0,
            'Status - Secret Wall in Merman Room Opened': 2.0,
            'Status - Shortcut in Cube of Zoe Room Activated': 3.0,
            'Status - Shortcut to Warp Activated': 3.0,
            'Status - Trapdoor After Drawbridge Opened': 2.0,
            'Status - Upper-Left Gear in Clock Tower Set': 1.25,
            'Status - Upper-Right Gear in Clock Tower Set': 1.25,
        }
        score = 0
        for (key, value) in self.current_state.items():
            if type(value) == bool and value:
                if key in scores:
                    score += scores[key]
        result = score
        return result
    
    def get_progression(self) -> str:
        chars = {
            'Progression - Alchemy Laboratory Stage Reached': 'AL',
            'Progression - Castle Entrance Revisited Stage Reached': 'C1',
            'Progression - Castle Entrance Stage Reached': 'C2',
            'Progression - Castle Keep Stage Reached': 'CK',
            'Progression - Clock Tower Stage Reached': 'CT',
            'Progression - Colosseum Stage Reached': 'CO',
            'Progression - Long Library Stage Reached': 'LB',
            'Progression - Marble Gallery Stage Reached': 'MG',
            'Progression - Olrox\'s Quarters Stage Reached': 'OQ',
            'Progression - Outer Wall Stage Reached': 'OW',
            'Progression - Royal Chapel Stage Reached': 'RC',
            'Progression - Warp Rooms Stage Reached': 'WR',
            'Relic - Form of Mist': 'm',
            'Relic - Gravity Boots': 'g',
            'Relic - Jewel of Open': 'o',
            'Relic - Leap Stone': 'l',
            'Relic - Power of Mist': 'M',
            'Relic - Soul of Bat': 'b',
            'Relic - Soul of Wolf': 'w',
        }
        progressions = []
        for progression_name in sorted(chars):
            symbol = chars[progression_name]
            if progression_name in self.current_state:
                value = self.current_state[progression_name]
                if type(value) == bool and value:
                    progressions.append(symbol + ' ')
                else:
                    progressions.append('-' * len(symbol) + ' ')
            else:
                progressions.append('-' * len(symbol) + ' ')
        result = ''.join(progressions)
        return result
    
    def get_key(self) -> int:
        self.cleanup_state()
        hashed_state = hash(json.dumps(self.current_state, sort_keys=True))
        result = hashed_state
        return result
    
    def validate(self, requirements):
        result = False
        for requirement in requirements.values():
            # All checks within a requirement list must pass
            valid_ind = True
            for (key, value) in requirement.items():
                target_value = None
                if key not in self.current_state:
                    if type(value) == str:
                        target_value = self.DEFAULT_STRING
                    elif type(value) == bool:
                        target_value = self.DEFAULT_BOOLEAN
                    elif type(value) in (int, dict):
                        target_value = self.DEFAULT_NUMBER
                else:
                    target_value = self.current_state[key]
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
        self.current_state['Location'] = location_name
        self.current_state['Section'] = section_name
        if helper is None:
            if 'Helper' in self.current_state:
                self.current_state.pop('Helper')
        else:
            self.current_state['Helper'] = helper
        self.cleanup_state()
    
    def cheat_command(self, location_name: str, command_name: str):
        command_data = self.commands[location_name]
        # Apply outcomes from the command
        for (key, value) in command_data[command_name]['Outcomes'].items():
            if type(value) in (str, bool):
                if self.debug and (key not in self.current_state or self.current_state[key] != value):
                    print('  +', key, ': ', value)
                self.current_state[key] = value
            elif type(value) in (int, float):
                if key not in self.current_state:
                    self.current_state[key] = 0
                if self.debug:
                    print('  +', key, ': ', value)
                self.current_state[key] += value
        self.cleanup_state()

    def process_command(self, command_name: str):
        location = self.current_state['Location']
        self.history.append((self.layer, location, command_name))
        stage = location[:location.find(',')]
        self.stages_visited.add(stage)
        command_data = {}
        if self.current_state['Location'] in self.commands:
            command_data = self.commands[self.current_state['Location']]
        # Apply outcomes from the command
        for (key, value) in command_data[command_name]['Outcomes'].items():
            if type(value) in (str, bool):
                if self.debug and (key not in self.current_state or self.current_state[key] != value):
                    print('  +', key, ': ', value)
                self.current_state[key] = value
            elif type(value) in (int, float):
                if key not in self.current_state:
                    self.current_state[key] = 0
                if self.debug:
                    print('  +', key, ': ', value)
                self.current_state[key] += value
        if not self.goal_achieved:
            if self.validate(self.logic_core['Goals']):
                self.goal_achieved = True
        self.cleanup_state()

    def get_valid_command_names(self, require_validation: bool=True) -> list:
        result = set()
        # Add choices for valid commands the player can issue
        command_data = {}
        if self.current_state['Location'] in self.commands:
            command_data = self.commands[self.current_state['Location']]
        for (command_name, command_info) in command_data.items():
            if not require_validation or self.validate(command_info['Requirements']):
                result.add(command_name)
        result = list(reversed(sorted(result)))
        return result

    def play(self):
        print('@', self.current_state['Location'], '-', self.current_state['Section'])
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
        self.debug = False
    
    def solve_via_steps(self, step_range: tuple[int]):
        highest_layer_found = (0, -1)
        initial_game = Game(self.logic_core)
        memo = {}
        solution_found = False
        work__solver = []
        limit = 10_000
        heapq.heappush(work__solver, (-initial_game.get_score(), 0, initial_game))
        while len(work__solver) > 0 and not solution_found:
            limit -= 1
            if limit < 0:
                break
            (score__solver, step__solver, game__solver) = heapq.heappop(work__solver)
            if (-score__solver, step__solver) > highest_layer_found and self.debug:
                print('Layer', (score__solver, step__solver), len(work__solver), game__solver.get_progression(), limit)
                highest_layer_found = (score__solver, step__solver)
            game__solver.layer = step__solver
            if game__solver.goal_achieved:
                solution_found = True
                self.results['Wins'].append((step__solver, game__solver))
                break
            hashed_state__solver = game__solver.get_key()
            if hashed_state__solver in memo and memo[hashed_state__solver] <= step__solver:
                # if self.debug:
                #     print('    seen', hashed_state__solver, 'with layer', memo[hashed_state__solver], len(work__solver), len(memo))
                continue
            memo[hashed_state__solver] = step__solver
            if step__solver > -score__solver:
                continue
            # if self.debug:
            #     print(score__solver, step__solver, game__solver.current_state['Location'], hashed_state__solver, len(work__solver), len(memo))
            for command in game__solver.get_valid_command_names():
                next_game__solver = game__solver.clone()
                next_game__solver.process_command(command)
                next_step__solver = step__solver + 1
                next_hashed_state__solver = next_game__solver.get_key()
                next_score = next_game__solver.get_score()
                if next_hashed_state__solver in memo and memo[next_hashed_state__solver] <= next_step__solver:
                    # if self.debug:
                    #     print('    seen', next_hashed_state__solver, 'with layer', memo[next_hashed_state__solver], next_step__solver, len(memo))
                    continue
                heapq.heappush(work__solver, (-next_score, next_step__solver, next_game__solver))
    
    def solve_via_layers(self, reflexive_limit: int=3, max_layers: int=8, require_validation: bool=True):
        highest_layer_found = (0, -1)
        initial_game = Game(self.logic_core)
        memo = {}
        solution_found = False
        work__solver = []
        limit = 100
        heapq.heappush(work__solver, (-initial_game.get_score(), 0, initial_game))
        while len(work__solver) > 0 and not solution_found:
            limit -= 1
            if limit < 0:
                break
            (score__solver, step__solver, game__solver) = heapq.heappop(work__solver)
            if (-score__solver, step__solver) > highest_layer_found and self.debug:
                print('Layer', (score__solver, step__solver), len(work__solver), game__solver.get_progression(), limit)
                highest_layer_found = (score__solver, step__solver)
            game__solver.layer = step__solver
            if game__solver.goal_achieved:
                solution_found = True
                self.results['Wins'].append((step__solver, game__solver))
                break
            hashed_state__solver = game__solver.get_key()
            if hashed_state__solver in memo and memo[hashed_state__solver] <= step__solver:
                # if self.debug:
                #     print('    seen', hashed_state__solver, 'with layer', memo[hashed_state__solver], len(work__solver), len(memo))
                continue
            memo[hashed_state__solver] = step__solver
            if step__solver > -score__solver:
                continue
            if self.debug:
                print(score__solver, step__solver, game__solver.current_state['Location'], hashed_state__solver, len(work__solver), len(memo))
            #
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
                hashed_state__bonded = game__bonded.get_key()
                # Find all N-reflexive commands at the current location
                reflexive_command_names = set()
                work__reflexive = collections.deque()
                for command in game__bonded.get_valid_command_names(require_validation):
                    work__reflexive.appendleft((0, command, command, game__bonded.clone()))
                    bonded_locations[game__bonded.location][1].add(command)
                while len(work__reflexive) > 0:
                    (step__reflexive, original_command__reflexive, current_command__reflexive, game__reflexive) = work__reflexive.pop()
                    game__reflexive.process_command(current_command__reflexive)
                    hashed_state__reflexive = game__reflexive.get_key()
                    if hashed_state__reflexive == hashed_state__bonded:
                        reflexive_command_names.add(original_command__reflexive)
                        continue
                    if step__reflexive < reflexive_limit:
                        for next_command__reflexive in game__reflexive.get_valid_command_names(require_validation):
                            work__reflexive.appendleft((step__reflexive + 1, original_command__reflexive, next_command__reflexive, game__reflexive.clone()))
                for reflexive_command_name in reflexive_command_names:
                    next_game__bonded = game__bonded.clone()
                    next_game__bonded.process_command(reflexive_command_name)
                    work__bonded.append((step__bonded + 1, next_game__bonded))
                bonded_locations[game__bonded.location][1] -= reflexive_command_names
            for (bonded_location, (game, valid_commands)) in sorted(bonded_locations.items()):
                hashed_state__game = game.get_key()
                # if self.debug:
                #     print('  ', bonded_location, hashed_state__game, len(valid_commands))
                for next_command__solver in valid_commands:
                    # if self.debug:
                    #     print('    ', next_command__solver)
                    next_game__solver = game.clone()
                    next_game__solver.process_command(next_command__solver)
                    next_step__solver = step__solver + 1
                    next_hashed_state__solver = next_game__solver.get_key()
                    if next_hashed_state__solver in memo and memo[next_hashed_state__solver] <= next_step__solver:
                        # if self.debug:
                        #     print('    seen', next_hashed_state__solver, 'with layer', memo[next_hashed_state__solver], next_step__solver, len(memo))
                        continue
                    heapq.heappush(work__solver, (-next_game__solver.get_score(), next_step__solver, next_game__solver))

if __name__ == '__main__':
    '''
    Usage
    python solver.py
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('changes', help='Input a filepath to the changes JSON file', type=str)
    parser.add_argument('skills', help='Input a filepath to the skills JSON file', type=str)
    args = parser.parse_args()
    SOLVER_VERSION = '0.0.0'
    mapper_data = mapper.MapperData().get_core()
    with open(os.path.join('build', 'debug', 'mapper-data.json'), 'w') as debug_mapper_data_json:
        json.dump(mapper_data, debug_mapper_data_json, indent='    ', sort_keys=True, default=str)
    with (
        open(args.changes) as changes_json,
        open(args.skills) as skills_json,
    ):
        changes = json.load(changes_json)
        changes_json.close()
        if 'Changes' in changes:
            changes = changes['Changes']
        logic_core = mapper.LogicCore(mapper_data, changes).get_core()
        with open(os.path.join('build', 'debug', 'logic-core.json'), 'w') as debug_logic_core_json:
            json.dump(logic_core, debug_logic_core_json, indent='    ', sort_keys=True, default=str)
        logic_core['State']['Location'] = 'Castle Entrance, After Drawbridge'
        logic_core['State']['Section'] = 'Ground'
        logic_core['Goals'] = {
            # 'Debug 1': {
            #     'Location': 'Castle Entrance Revisited, Cube of Zoe Room',
            # },
            # 'Debug 2': {
            #     'Location': 'Marble Gallery, Slinger Staircase',
            # },
            # 'Debug 3': {
            #     'Location': 'Outer Wall, Exit to Marble Gallery',
            # },
            # 'Debug 4': {
            #     'Relic - Soul of Wolf': True,
            #     'Item - Library Card': {
            #         'Minimum': 1,
            #     },
            #     'Relic - Form of Mist': True,
            #     'Location': 'Clock Tower, Stairwell to Outer Wall',
            # },
            'Debug 5': {
                'Progression - Castle Entrance Stage Reached': True,
                'Progression - Castle Entrance Revisited Stage Reached': True,
                'Progression - Alchemy Laboratory Stage Reached': True,
                'Progression - Marble Gallery Stage Reached': True,
                'Progression - Outer Wall Stage Reached': True,
                'Progression - Olrox\'s Quarters Stage Reached': True,
                'Progression - Colosseum Stage Reached': True,
                'Progression - Long Library Stage Reached': True,
                'Progression - Clock Tower Stage Reached': True,
                'Progression - Warp Rooms Stage Reached': True,
                'Progression - Castle Keep Stage Reached': True,
                'Progression - Royal Chapel Stage Reached': True,
            },
            # 'Debug 99': {
            #     'Relic - Soul of Bat': True,
            # },
            # 'Debug 99': {
            #     'Relic - Form of Mist': True,
            # },
        }
        skills = json.load(skills_json)
        skills_json.close()
        print('Solving')
        map_solver = Solver(logic_core, skills)
        map_solver.debug = True
        # map_solver.solve_via_layers(3, 10)
        map_solver.solve_via_steps((32, 10, 80))
        if len(map_solver.results['Wins']) > 0:
            (winning_layers, winning_game) = map_solver.results['Wins'][-1]
            print('-------------')
            print('GOAL REACHED: Layer', winning_layers)
            print('History')
            for (layer, location, command_name) in winning_game.history:
                print('-', layer, location, ':', command_name)
            print('State')
            for (key, value) in winning_game.current_state.items():
                print('-', key, ':', value)
            print('-------------')
            while True:
                winning_game.play()
