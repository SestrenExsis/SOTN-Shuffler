# External libraries
import argparse
import collections
import copy
import heapq
import json
import os
import random

# Local libraries
import mapper

class Game:
    DEFAULT_BOOLEAN = False
    DEFAULT_STRING = 'NONE'
    DEFAULT_NUMBER = 0
    def __init__(self, logic_core: dict, starting_state: dict=None):
        self.logic_core = logic_core # copy.deepcopy(logic_core)
        if starting_state is None:
            starting_state = logic_core['State']
        self.current_state = copy.deepcopy(starting_state)
        if 'Stages Visited' not in self.current_state:
            self.current_state['Stages Visited'] = {}
        if 'Rooms Visited' not in self.current_state:
            self.current_state['Rooms Visited'] = {}
        if 'Locations Visited' not in self.current_state:
            self.current_state['Locations Visited'] = {}
        self.commands = self.logic_core['Commands']
        # NOTE(sestren): Anything that must also be added to self.clone() is below this line
        self.history = []
        self.goals_achieved = set()
        self.layer = 0
        self.debug = False
    
    # TODO(sestren): Implement __eq__, __gt__, etc.
    def __lt__(self, other) -> bool:
        result = self.get_key() < other.get_key()
        return result
    
    @property
    def stage(self):
        stage_name = self.DEFAULT_STRING
        if 'Room' in self.current_state:
            room_name = self.current_state['Room']
            stage_name = room_name[:room_name.find(',')]
        result = stage_name
        return result
    
    @property
    def room(self):
        room_name = self.DEFAULT_STRING
        if 'Room' in self.current_state:
            room_name = self.current_state['Room']
        result = room_name
        return result
    
    @property
    def location(self):
        section_name = self.DEFAULT_STRING
        if 'Section' in self.current_state:
            section_name = self.current_state['Section']
        result = self.room + ' (' + section_name + ')'
        return result
    
    def clone(self):
        result = Game(self.logic_core, self.current_state)
        result.history = list(self.history)
        result.goals_achieved = set(self.goals_achieved)
        result.layer = self.layer
        result.debug = self.debug
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
        score = 0
        score += 2.00 * len(self.current_state['Stages Visited'])
        score += 1.25 * len(self.current_state['Rooms Visited'])
        score += 0.25 * len(self.current_state['Locations Visited'])
        other_scores = {
            # 'Check - Colosseum Library Card': 10.0,
            'Relic - Cube of Zoe': 3.0,
            'Relic - Echo of Bat': 40.0,
            'Relic - Form of Mist': 40.0,
            # 'Relic - Faerie Scroll': 1.0,
            'Relic - Gravity Boots': 10.0,
            'Relic - Jewel of Open': 25.0,
            'Relic - Leap Stone': 25.0,
            'Relic - Power of Mist': 3.0,
            'Relic - Soul of Bat': 45.0,
            'Relic - Soul of Wolf': 15.0,
            # 'Status - Breakable Ceiling in Blade Master Room Broken': 2.0,
            # 'Status - Breakable Ceiling in Catwalk Crypt Broken': 2.0,
            # 'Status - Breakable Floor in Tall Zig Zag Room Broken': 2.0,
            # 'Status - Breakable Wall in Grand Staircase Broken': 2.0,
            # 'Status - Breakable Wall in Tall Zig Zag Room Broken': 2.0,
            # 'Status - Cannon Activated': 2.0,
            # 'Status - DK Bridge Broken': 3.0,
            # 'Status - DK Button Pressed': 3.0,
            # 'Status - Elevator in Colosseum Unlocked': 2.0,
            'Status - Elevator in Outer Wall Activated': 3.0,
            # 'Status - Lower-Left Gear in Clock Tower Set': 1.25,
            # 'Status - Lower-Right Gear in Clock Tower Set': 1.25,
            'Status - Pressure Plate in Marble Gallery Activated': 25.0,
            # 'Status - Secret Wall in Merman Room Opened': 2.0,
            # 'Status - Shortcut in Cube of Zoe Room Activated': 3.0,
            # 'Status - Shortcut to Warp Rooms Activated': 3.0,
            # 'Status - Trapdoor After Drawbridge Opened': 2.0,
            # 'Status - Upper-Left Gear in Clock Tower Set': 1.25,
            # 'Status - Upper-Right Gear in Clock Tower Set': 1.25,
        }
        for (key, value) in self.current_state.items():
            if type(value) == bool and value:
                if key in other_scores:
                    score += other_scores[key]
        result = score
        return result
    
    def get_progression(self) -> str:
        chars = {
            'cz': 'Relic - Cube of Zoe',
            'B': 'Relic - Soul of Bat',
            'Be': 'Relic - Echo of Bat',
            'gb': 'Relic - Gravity Boots',
            'jo': 'Relic - Jewel of Open',
            'ls': 'Relic - Leap Stone',
            'M': 'Relic - Form of Mist',
            'Mp': 'Relic - Power of Mist',
            'sb': 'Item - Spike Breaker',
            'W': 'Relic - Soul of Wolf',
        }
        progressions = []
        for progression_code in sorted(chars):
            progression_name = chars[progression_code]
            if progression_name in self.current_state:
                value = self.current_state[progression_name]
                if type(value) == bool and value:
                    progressions.append(progression_code + ' ')
                elif type(value) == int and value > 0:
                    progressions.append(progression_code + ' ')
                else:
                    progressions.append('-' * len(progression_code) + ' ')
            else:
                progressions.append('-' * len(progression_code) + ' ')
        result = ''.join(progressions) + ' > ' + self.location
        return result
    
    def get_key(self) -> int:
        self.cleanup_state()
        hashed_state = hash(json.dumps(self.current_state, sort_keys=True, default=str))
        result = hashed_state
        return result
    
    def check_requirement(self, requirement, scoped_state) -> bool:
        # All checks within a given requirement set must pass
        valid_ind = True
        for (requirement_key, requirement_value) in requirement.items():
            target_value = None
            if requirement_key not in scoped_state:
                if type(requirement_value) == str:
                    target_value = self.DEFAULT_STRING
                elif type(requirement_value) == bool:
                    target_value = self.DEFAULT_BOOLEAN
                elif type(requirement_value) in (int, dict):
                    target_value = self.DEFAULT_NUMBER
            else:
                target_value = scoped_state[requirement_key]
            if type(requirement_value) == dict:
                # Requirements for a numerical value
                if 'Minimum' in requirement_value:
                    if target_value < requirement_value['Minimum']:
                        valid_ind = False
                        break
                if 'Maximum' in requirement_value:
                    if target_value > requirement_value['Maximum']:
                        valid_ind = False
                        break
                # Requirements for a dictionary value
                if 'All' in requirement_value:
                    if not self.validate(requirement_value, requirement_key):
                        valid_ind = False
                        break
                # TODO(sestren): Consider adding 'None' dictionary requirement
                # TODO(sestren): Consider adding 'Any' dictionary requirement
            elif target_value != requirement_value:
                valid_ind = False
                break
        result = valid_ind
        return result
    
    def validate(self, requirements, state_scope_key: str=None):
        scoped_state = self.current_state
        if state_scope_key is not None:
            scoped_state = self.current_state[state_scope_key]
        result = False
        for requirement in requirements.values():
            valid_ind = self.check_requirement(requirement, scoped_state)
            # Satisfying even one of the requirement sets is sufficient
            if valid_ind:
                result = True
                break
        return result
    
    def get_validated(self, requirements, state_scope_key: str=None):
        scoped_state = self.current_state
        if state_scope_key is not None:
            scoped_state = self.current_state[state_scope_key]
        result = set()
        for (requirement_key, requirement) in requirements.items():
            if self.check_requirement(requirement, scoped_state):
                result.add(requirement_key)
        return result

    def cheat_location(self, room_name: str, section_name: str, helper: str=None):
        self.current_state['Room'] = room_name
        self.current_state['Section'] = section_name
        if helper is None:
            if 'Helper' in self.current_state:
                self.current_state.pop('Helper')
        else:
            self.current_state['Helper'] = helper
        self.cleanup_state()
    
    def cheat_command(self, room_name: str, command_name: str):
        command_data = self.commands[room_name]
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
        self.current_state['Stages Visited'][self.stage] = True
        self.current_state['Rooms Visited'][self.room] = True
        self.current_state['Locations Visited'][self.location] = True
        self.history.append((self.layer, self.location, command_name))
        command_data = {}
        if self.room in self.commands:
            command_data = self.commands[self.room]
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
        self.goals_achieved = self.get_validated(self.logic_core['Goals'])
        self.cleanup_state()

    def get_valid_command_names(self, require_validation: bool=True) -> list:
        result = set()
        # Add choices for valid commands the player can issue
        command_data = {}
        if self.room in self.commands:
            command_data = self.commands[self.room]
        for (command_name, command_info) in self.commands['Global'].items():
            command_data[command_name] = command_info
        for (command_name, command_info) in command_data.items():
            if not require_validation or self.validate(command_info['Requirements']):
                result.add(command_name)
        result = list(reversed(sorted(result)))
        return result

    def play(self):
        print('@', self.location)
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
    def __init__(self, logic_core, skills, seed: int=0):
        self.logic_core = logic_core
        for (skill_key, skill_value) in skills.items():
            self.logic_core['State'][skill_key] = skill_value
        self.results = {
            'Wins': [],
            'Withdrawals': [],
            'Losses': [],
            'Cycles': 0,
        }
        self.debug = False
        self.decay_start = 4_999
        self.cycle_limit = 9_999
        self.solver_count = 0
        self.initial_seed = seed
        self.rng = random.Random(self.initial_seed)
    
    def get_should_prune(self) -> bool:
        result = False
        if self.cycle_count > self.decay_start:
            span = self.cycle_limit - self.decay_start
            chance_of_decay = 0.0
            chance_of_decay = (self.cycle_count - self.decay_start) / span
            roll = self.rng.random()
            if roll < chance_of_decay:
                result = True
        return result
    
    def solve_via_random_exploration(self, cycle_limit: int=1999, restrict_to_stage: str=None):
        self.rng = random.Random(self.initial_seed)
        game__solver = Game(self.logic_core)
        memo = {}
        self.cycle_count = 0
        while self.cycle_count < cycle_limit:
            # print('', self.cycle_count, game__solver.location)
            game__solver.layer = self.cycle_count
            hashed_state__solver = game__solver.get_key()
            # assert hashed_state__solver not in memo
            if hashed_state__solver not in memo:
                memo[hashed_state__solver] = 0
            memo[hashed_state__solver] += 1
            if len(game__solver.goals_achieved) > 0:
                self.results['Wins'].append((self.cycle_count, game__solver))
                break
            commands = {}
            for command_name in game__solver.get_valid_command_names():
                next_game__solver = game__solver.clone()
                next_game__solver.process_command(command_name)
                if restrict_to_stage is not None:
                    if not next_game__solver.current_state['Room'].startswith(restrict_to_stage):
                        continue
                next_hashed_state__solver = next_game__solver.get_key()
                visit_count = 0
                if next_hashed_state__solver in memo:
                    visit_count = memo[next_hashed_state__solver]
                if visit_count not in commands:
                    commands[visit_count] = set()
                commands[visit_count].add(command_name)
            if len(commands) > 0:
                priority_visit_count = min(commands.keys())
                command_name = self.rng.choice(
                    list(sorted(commands[priority_visit_count]))
                )
                game__solver.process_command(command_name)
            else:
                self.results['Losses'].append((self.cycle_count, game__solver))
                break
            self.cycle_count += 1
        self.results['Withdrawals'].append((self.cycle_count, game__solver))
        if self.debug:
            print(
                'Explorer ID:', self.solver_count,
                (self.cycle_count, len(game__solver.current_state['Locations Visited']), game__solver.goals_achieved),
                game__solver.location
            )
        self.solver_count += 1

    def solve_via_steps(self, step_limit: int=100, restrict_to_stage: str=None):
        self.rng = random.Random(self.initial_seed)
        initial_game = Game(self.logic_core)
        memo = {}
        solution_found = False
        current_work_key = 0
        work__solver = {
            current_work_key: (0, initial_game),
        }
        self.cycle_count = 0
        while len(work__solver) > 0 and not solution_found:
            chosen_work_key = self.rng.choice(list(work__solver.keys()))
            (step__solver, game__solver) = work__solver.pop(chosen_work_key)
            if self.debug:
                print((step__solver, len(work__solver)), (self.cycle_count, chosen_work_key), game__solver.current_state['Room'])
            if step__solver >= step_limit:
                continue
            self.cycle_count += 1
            should_prune = self.get_should_prune()
            if should_prune:
                continue
            game__solver.layer = step__solver
            if len(game__solver.goals_achieved) > 0:
                solution_found = True
                self.results['Wins'].append((step__solver, game__solver))
                break
            hashed_state__solver = game__solver.get_key()
            if hashed_state__solver in memo and memo[hashed_state__solver] <= step__solver:
                continue
            memo[hashed_state__solver] = step__solver
            for command in game__solver.get_valid_command_names():
                next_game__solver = game__solver.clone()
                next_game__solver.process_command(command)
                if restrict_to_stage is not None:
                    if not next_game__solver.current_state['Room'].startswith(restrict_to_stage):
                        continue
                next_step__solver = step__solver + 1
                next_hashed_state__solver = next_game__solver.get_key()
                if next_hashed_state__solver in memo and memo[next_hashed_state__solver] <= next_step__solver:
                    continue
                current_work_key += 1
                work__solver[current_work_key] = (next_step__solver, next_game__solver)
    
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
                # print('Layer', (score__solver, step__solver), len(work__solver), game__solver.get_progression(), limit)
                highest_layer_found = (score__solver, step__solver)
            game__solver.layer = step__solver
            if len(game__solver.goals_achieved):
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
            #     print(score__solver, step__solver, game__solver.location, hashed_state__solver, len(work__solver), len(memo))
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
                if len(game__bonded.goals_achieved) > 0:
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
        logic_core['State']['Room'] = 'Castle Entrance, After Drawbridge'
        logic_core['State']['Section'] = 'Ground'
        # To prevent Bad Endings, require Holy Glasses before entering the Throne Room
        logic_core['Commands']['Castle Keep, Keep Area']['Move - Throne Room']['Requirements']['Anteroom - Default']['Item - Holy Glasses'] = {
            'Minimum': 1,
        }
        logic_core['Goals'] = {
            # 'Debug': {
            #     'Room': 'Castle Entrance, After Drawbridge',
            # },
            'Exploration': {
                'Stages Visited': {
                    'All': {
                        # 'Abandoned Mine': True,
                        # 'Alchemy Laboratory': True,
                        # 'Castle Center': True,
                        'Castle Entrance': True,
                        # 'Castle Entrance Revisited': True,
                        # 'Castle Keep': True,
                        # 'Catacombs': True,
                        # 'Clock Tower': True,
                        # 'Colosseum': True,
                        # 'Long Library': True,
                        # 'Marble Gallery': True,
                        # 'Olrox\'s Quarters': True,
                        # 'Outer Wall': True,
                        # 'Royal Chapel': True,
                        # 'Underground Caverns': True,
                        # 'Warp Rooms': True,
                    }
                },
            },
            'Bad Ending': {
                'Status - Richter Defeated': True,
            },
            'WIP: Good Ending': {
                'Relic - Jewel of Open': True,
                'Relic - Leap Stone': True,
                'Relic - Form of Mist': True,
                'Relic - Soul of Bat': True,
                'Relic - Echo of Bat': True,
                'Item - Spike Breaker': {
                    'Minimum': 1,
                },
                'Item - Silver Ring': {
                    'Minimum': 1,
                },
                'Item - Gold Ring': {
                    'Minimum': 1,
                },
                'Item - Holy Glasses': {
                    'Minimum': 1,
                },
                'Status - Richter Saved': True,
                # 'Relic - Ring of Vlad': True,
                # 'Relic - Heart of Vlad': True,
                # 'Relic - Tooth of Vlad': True,
                # 'Relic - Rib of Vlad': True,
                # 'Relic - Eye of Vlad': True,
                # 'Status - Dracula Defeated': True,
            },
        }
        with open(os.path.join('build', 'debug', 'logic-core.json'), 'w') as debug_logic_core_json:
            json.dump(logic_core, debug_logic_core_json, indent='    ', sort_keys=True, default=str)
        skills = json.load(skills_json)
        skills_json.close()
        print('Solving')
        map_solver = Solver(logic_core, skills)
        map_solver.debug = True
        # map_solver.solve_via_layers(3, 10)
        # map_solver.solve_via_steps()
        for _ in range(100):
            map_solver.solve_via_random_exploration(29_999)
        if len(map_solver.results['Wins']) > 0:
            best_index = 0
            for (index, (_, game)) in enumerate(map_solver.results['Wins']):
                if 'WIP: Good Ending' in game.goals_achieved:
                    N = len(map_solver.results['Wins'][best_index][1].history)
                    if best_index == -1 or len(game.history) < N:
                        best_index = index
            (winning_layers, winning_game) = map_solver.results['Wins'][best_index]
            print('-------------')
            print('GOAL REACHED: Layer', winning_layers)
            print('History')
            history_seen = set()
            for (layer, location, command_name) in winning_game.history:
                if (location, command_name) not in history_seen:
                    print('-', layer, location, ':', command_name)
                history_seen.add((location, command_name))
            print('State')
            for (key, value) in winning_game.current_state.items():
                print('-', key, ':', value)
            print('-------------')
            while True:
                winning_game.play()
