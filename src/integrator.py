# External libraries
import collections
import json
import os
import time
import yaml

# Local libraries
import solver

entry_points = {
    'Enter - Alchemy Laboratory': {
        'Room': 'Marble Gallery, Loading Room to Alchemy Laboratory',
        'Section': 'Main',
    },
    'Enter - Castle Center': {
        'Room': 'Marble Gallery, Elevator Room',
        'Section': 'Elevator',
    },
    'Enter - Castle Entrance': {
        'Room': 'Marble Gallery, Loading Room to Castle Entrance',
        'Section': 'Main',
    },
    "Enter - Olrox's Quarters": {
        'Room': "Marble Gallery, Loading Room to Olrox's Quarters",
        'Section': 'Main',
    },
    'Enter - Outer Wall': {
        'Room': 'Marble Gallery, Loading Room to Outer Wall',
        'Section': 'Main',
    },
    'Enter - Underground Caverns': {
        'Room': 'Marble Gallery, Loading Room to Underground Caverns',
        'Section': 'Main',
    },
}

goals__all_checks = {
    'Sections Visited': {
        'All': {
            'Alchemy Laboratory, Bat Card Room (Bat Card Room Duplicate)': True,
            'Castle Entrance, Cube of Zoe Room (Main)': True,
            'Abandoned Mine, Demon Card Room (Main)': True,
            "Olrox's Quarters, Echo of Bat Room (Main)": True,
            'Clock Tower, Fire of Bat Room (Main)': True,
            'Colosseum, Top of Elevator Shaft (Left Side)': True,
            'Castle Keep, Ghost Card Room (Ground)': True,
            'Long Library, Shop (Main)': True,
            'Castle Keep, Keep Area (Middle-Left Ledge)': True,
            'Marble Gallery, Gravity Boots Room (Main)': True,
            'Underground Caverns, Holy Symbol Room (Main)': True,
            'Castle Keep, Keep Area (Ground)': True,
            'Underground Caverns, Merman Statue Room (Main)': True,
            'Castle Entrance, After Drawbridge (Parapet)': True,
            'Alchemy Laboratory, Skill of Wolf Room (Main)': True,
            'Long Library, Lesser Demon Area (Behind Mist Gate)': True,
            'Outer Wall, Elevator Shaft Room (Elevator Shaft)': True,
            'Marble Gallery, Spirit Orb Room (Main)': True,
            "Olrox's Quarters, Sword Card Room (Main)": True,
            'Long Library, Faerie Card Room (Main)': True,
            'Long Library, Spellbook Area (Main)': True,
            'Catacombs, Spike Breaker Room (Main)': True,
            'Royal Chapel, Silver Ring Room (Main)': True,
            'Underground Caverns, False Save Room (Main)': True,
        },
    },
}

all_progressions = {
    'Cube of Zoe': {
        'Progression - Item Materialization': True,
        'Relic - Cube of Zoe': True,
    },
    'Demon Card': {
        'Progression - Summon Demon Familiar': True,
        'Relic - Demon Card': True,
    },
    'Echo of Bat': {
        'Progression - Echolocation': True,
        'Relic - Echo of Bat': True,
    },
    'Form of Mist': {
        'Progression - Mid-Air Reset': True,
        'Progression - Mist Transformation': True,
        'Relic - Form of Mist': True,
    },
    'Gravity Boots': {
        'Progression - Gravity Jump': True,
        'Relic - Gravity Boots': True,
    },
    'Holy Symbol': {
        'Progression - Protection From Water': True,
        'Relic - Holy Symbol': True,
    },
    'Jewel of Open': {
        'Progression - Unlock Blue Doors': True,
        'Relic - Jewel of Open': True,
    },
    'Leap Stone': {
        'Progression - Double Jump': True,
        'Progression - Mid-Air Reset': True,
        'Relic - Leap Stone': True,
    },
    'Merman Statue': {
        'Progression - Summon Ferryman': True,
        'Relic - Merman Statue': True,
    },
    'Power of Mist': {
        'Progression - Longer Mist Duration': True,
        'Relic - Power of Mist': True,
    },
    'Soul of Bat': {
        'Progression - Bat Transformation': True,
        'Progression - Mid-Air Reset': True,
        'Relic - Soul of Bat': True,
    },
    'Soul of Wolf': {
        'Progression - Mid-Air Reset': True,
        'Progression - Wolf Transformation': True,
        'Relic - Soul of Wolf': True,
    },
    'Spike Breaker': {
        'Item - Spike Breaker': 1,
    },
    'Silver Ring': {
        'Item - Silver Ring': 1,
    },
    'Gold Ring': {
        'Item - Gold Ring': 1,
    },
    'Holy Glasses': {
        'Item - Holy Glasses': 1,
    },
}

def get_reachable_checks(map_solver, progression_ids: set):
    global_state = {
        'Status - Cannon Activated': False,
        'Status - Pressure Plate in Marble Gallery Activated': False,
        'Status - Shortcut in Cube of Zoe Room Activated': False,
        'Status - Shortcut to Underground Caverns Activated': False,
        'Status - Shortcut to Warp Rooms Activated': False,
        'Status - Breakable Ceiling in Catwalk Crypt Broken': False,
        'Status - DK Bridge Broken': False,
        'Status - Breakable Floor in Hidden Crystal Entrance Broken': False,
        'Status - Breakable Floor in Tall Zig Zag Room Broken': False,
        'Status - Snake Column Wall Broken': False,
        'Status - Breakable Wall in Grand Staircase Broken': False,
        'Status - Breakable Wall in Left Gear Room Broken': False,
        'Status - Breakable Wall in Tall Zig Zag Room Broken': False,
        'Status - Pushing Statue Destroyed': False,
        'Status - Stairwell Near Demon Switch Dislodged': False,
    }
    progression = {}
    for progression_id in progression_ids:
        for (key, value) in all_progressions[progression_id].items():
            progression[key] = value
    # for (key, value) in progression.items():
    #     print(key, value)
    # Find all locations potentially reachable without additional progression
    game__init = map_solver.current_game.clone()
    for (key, value) in progression.items():
        if type(value) in (bool, str):
            game__init.current_state[key] = value
        elif type(value) == int:
            if key not in game__init.current_state:
                game__init.current_state[key] = 0
            game__init.current_state[key] += value
    reachable_checks = set()
    memo__bond = {} # key = location_name, value = distance_in_steps
    work__bond = collections.deque()
    work__bond.appendleft((0, game__init))
    i = 0
    while len(work__bond) > 0:
        (step__bond, game__bond) = work__bond.pop()
        # Preserve global state across all game instances
        for key in global_state:
            if key in game__bond.current_state and game__bond.current_state[key]:
                work__bond.appendleft((0, game__init))
                global_state[key] |= game__bond.current_state[key]
            game__bond.current_state[key] = global_state[key]
        # if i % 100 == 0:
        #     print('    ', len(work__bond), step__bond, game__bond.location)
        i += 1
        # time.sleep(0.5)
        memo__bond[game__bond.get_alt_key()] = step__bond
        if 'END' in game__bond.goals_achieved:
            break
        for command__bond in game__bond.get_valid_command_names():
            logic_level = game__bond.commands[game__bond.room][command__bond].get('Logic Level', 'Optional')
            # print('      ', command__bond, '...', logic_level)
            # time.sleep(0.1)
            if logic_level == 'Required':
                reachable_checks.add(command__bond)
            if logic_level in ('Hidden', 'Required'):
                continue
            next_game__bond = game__bond.clone()
            next_game__bond.process_command(command__bond)
            if memo__bond.get(next_game__bond.get_alt_key(), float('inf')) > step__bond:
                work__bond.appendleft((step__bond + 1, next_game__bond))
    result = reachable_checks
    return result

def get_choices(game__init, state_template: dict, max_steps: int=3):
    command_costs = {}
    if game__init.current_state.get('Technique - Gear Puzzle', False):
        command_costs['Action - Set Lower-Left Gear'] = 0.25
        command_costs['Action - Set Lower-Right Gear'] = 0.25
        command_costs['Action - Set Upper-Left Gear'] = 0.25
        command_costs['Action - Set Upper-Right Gear'] = 0.25
    choices = {}
    work = []
    for command_name__init in game__init.get_valid_command_names():
        if game__init.commands[game__init.room][command_name__init].get('Logic Level', 'Optional') in ('Hidden', 'Required'):
            continue
        work.append((0, game__init.clone(), [command_name__init]))
    while len(work) > 0:
        (step__current, game__current, command_history__current) = work.pop()
        game__current.process_command(command_history__current[-1])
        state__current = game__current.get_scoped_state(state_template)
        if state__current not in choices:
            choices[state__current] = []
        choices[state__current].append(command_history__current)
        if step__current >= max_steps:
            continue
        for command_name__next in sorted(game__current.get_valid_command_names()):
            if game__current.commands[game__current.room][command_name__next].get('Logic Level', 'Optional') in ('Hidden', 'Required'):
                continue
            step__next = step__current + command_costs.get(command_name__next, 1)
            work.append((step__next, game__current.clone(), command_history__current[:] + [command_name__next]))
    result = choices
    return result

def traverse_safely(game__init, states, max_steps: int=3):
    # A reflexive series of commands can go from the current state to a new state and back to the current state
    # Processing the first part of a reflexive series of commands allows new states to be reached that are guaranteed bidirectional
    state_template = {
        'Room': game__init.DEFAULT_STRING,
        'Section': game__init.DEFAULT_STRING,
    }
    work = collections.deque()
    work.appendleft((0, game__init))
    while len(work) > 0:
        (step__current, game__current) = work.pop()
        state__current = game__current.get_scoped_state(state_template)
        states.add(state__current)
        choices = get_choices(game__current, state_template, max_steps)
        for command_history in choices.get(state__current, []):
            game__next = game__current.clone()
            step__next = step__current
            for command_name in command_history:
                game__next.process_command(command_name)
                step__next += 1
                state__next = game__next.get_scoped_state(state_template)
                if state__next != state__current and state__next not in states:
                    work.append((step__next, game__next))
                    states.add(state__next)
                    break

def traverse_greedily(game__init, states, max_steps: int=3):
    state_template = {
        'Room': game__init.DEFAULT_STRING,
        'Section': game__init.DEFAULT_STRING,
        'Status - DK Button Pressed': game__init.DEFAULT_STRING,
        'Status - Pressure Plate in Marble Gallery Activated': game__init.DEFAULT_STRING,
        'Subweapon': game__init.DEFAULT_STRING,
    }
    work = collections.deque()
    work.appendleft((0, game__init))
    while len(work) > 0:
        (step__current, game__current) = work.pop()
        state__current = game__current.get_scoped_state(state_template)
        states.add(state__current)
        choices = get_choices(game__current, state_template, max_steps)
        for (state__next, command_histories) in choices.items():
            if state__next == state__current:
                continue
            for command_history in command_histories:
                game__next = game__current.clone()
                step__next = step__current
                for command_name in command_history:
                    game__next.process_command(command_name)
                    step__next += 1
                    state__next = game__next.get_scoped_state(state_template)
                    if state__next != state__current and state__next not in states:
                        work.append((step__next, game__next))
                        states.add(state__next)
                        break

if __name__ == '__main__':
    '''
    Usage
    python integrator.py
    '''
    skills = {}
    with (
        open(os.path.join('examples', 'skillsets.yaml')) as skillsets_file,
        open(os.path.join('build', 'shuffler', 'current-seed.json')) as current_seed_json,
    ):
        start_time = time.time()
        skillsets = yaml.safe_load(skillsets_file)
        skillsets_file.close()
        for skill in skillsets['Integration']:
            skills[skill] = True
        current_seed = json.load(current_seed_json)
        current_seed_json.close()
        map_solver = solver.Solver(current_seed['Logic Core'], skills, custom_end=goals__all_checks)
        game__init = map_solver.current_game.clone()
        # Identify all (stage, room, section) locations attainable with full progression
        game__full_progression = game__init.clone()
        for (progression_id, progression_pairs) in all_progressions.items():
            for (key, value) in progression_pairs.items():
                game__full_progression.current_state[key] = value
        states__full_progression = set()
        traverse_greedily(game__full_progression, states__full_progression, 3)
        print('Full Progression')
        locations__full_progression = set()
        for state in sorted(states__full_progression):
            room__current = game__full_progression.DEFAULT_STRING
            section__current = game__full_progression.DEFAULT_STRING
            for (key, value) in state:
                if key == 'Room':
                    room__current = value
                if key == 'Section':
                    section__current = value
            if (room__current, section__current) not in locations__full_progression:
                print('  -', (room__current, section__current))
                locations__full_progression.add((room__current, section__current))
        print('')
        # Traverse all (stage, room, section) locations, and identify all other locations bonded to the chosen one with no progression
        group_ids = {}
        while len(locations__full_progression) > 0:
            (room__current, section__current) = locations__full_progression.pop()
            game__no_progression = game__init.clone()
            game__no_progression.current_state['Room'] = room__current
            game__no_progression.current_state['Section'] = section__current
            states__no_progression = set()
            traverse_safely(game__no_progression, states__no_progression, 3)
            locations__no_progression = set()
            print('No Progression:', (room__current, section__current))
            for state in sorted(states__no_progression):
                room__current = game__no_progression.DEFAULT_STRING
                section__current = game__no_progression.DEFAULT_STRING
                for (key, value) in state:
                    if key == 'Room':
                        room__current = value
                    if key == 'Section':
                        section__current = value
                # print('  -', (room__current, section__current))
                locations__no_progression.add((room__current, section__current))
                if (room__current, section__current) in locations__full_progression:
                    locations__full_progression.remove((room__current, section__current))
            group_ids[len(group_ids)] = locations__no_progression
        # Look for groups that overlap and split them up along their boundaries
        groups = []
        while len(group_ids) > 0:
            group_id__current = max(group_ids)
            group__current = group_ids.pop(group_id__current)
            group__core = group__current
            overlap_ind = True
            count = 0
            while overlap_ind:
                print(len(groups), len(group_ids), count)
                overlap_ind = False
                for group_id__next in list(sorted(group_ids.keys())):
                    group__next = group_ids[group_id__next]
                    if len(group__next & group__current) > 0:
                        left_group = group__current - group__next
                        if len(left_group) > 0:
                            group_id__left = max(group_ids) + 1
                            group_ids[group_id__left] = left_group
                        right_group = group__next - group__current
                        if len(right_group) > 0:
                            group_id__right = max(group_ids) + 1
                            group_ids[group_id__right] = right_group
                        group__core &= group__next
                        group_ids.pop(group_id__next)
                        overlap_ind = True
                count += 1
            groups.append(group__core)
        print('')
        meta_commands = {} # (source_group_id, progression_required, target_group_id)
        for (group_id, group) in enumerate(groups):
            print(f'Group ID #{group_id} has {len(group)} locations')
            for (room__current, section__current) in sorted(group):
                print('  -', (room__current, section__current))
        # ...
        raise Exception()
        all_checks = get_reachable_checks(map_solver, all_progressions.keys())
        print('\nAll Checks -', len(all_checks), 'in total')
        for check in sorted(all_checks):
            print(' -', check)
        memo = {}
        work = collections.deque()
        work.appendleft(
            set(), # Empty Hand
        )
        i = 0
        while len(work) > 0:
            if i % 50 == 0:
                print(i, len(work), time.time() - start_time)
            i += 1
            progression_items = work.pop()
            reachable_checks = get_reachable_checks(map_solver, progression_items)
            progression_key = (
                'Empty Hand' if len(progression_items) < 1
                else ' + '.join(sorted(progression_items))
            )
            memo[progression_key] = reachable_checks
            print(' -', len(reachable_checks), progression_key, '--> DONE' if len(reachable_checks) >= len(all_checks) else '')
            if len(reachable_checks) >= len(all_checks):
                continue
            for progression_id in sorted(all_progressions):
                if len(progression_items) > 0 and progression_id <= max(progression_items):
                    continue
                # print('---- ', progression_id, progression_items)
                work.appendleft(progression_items.union({ progression_id, }))
        location_locks = {}
        def F(d, k, v):
            # d[k].add(v)
            m = set(v.split(' + '))
            add_value_ind = True
            values_to_remove = set()
            for v2 in d[k]:
                m2 = set(v2.split(' + '))
                if (v == 'Empty Hand') or (m.issubset(m2)):
                    values_to_remove.add(v2)
                if (v2 == 'Empty Hand') or (m2.issubset(m)):
                    add_value_ind = False
            for value_to_remove in values_to_remove:
                d[k].remove(value_to_remove)
            if add_value_ind:
                d[k].add(v)
        for (progression_key, reachable_checks) in memo.items():
            for check in reachable_checks:
                if check not in location_locks:
                    location_locks[check] = set()
                F(location_locks, check, progression_key) # location_locks[check].add(progression_key)
        print('\nLocation Locks -', len(location_locks), 'in total')
        for check in sorted(location_locks):
            progression_keys = location_locks[check]
            print('', check)
            for progression_key in sorted(progression_keys):
                print('  -', progression_key)
