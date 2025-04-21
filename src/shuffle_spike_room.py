# External libraries
import argparse
import json
import os
import random

def get_obstacles(seed, obstacle_count: int=4):
    rng = random.Random(seed)
    obstacles = []
    while True:
        obstacles = []
        while len(obstacles) < obstacle_count:
            options = ['UP', 'UP', 'UP', 'DOWN', 'DOWN', 'DOWN']
            if len(obstacles) < (obstacle_count - 1):
                options.extend(('RIGHT', 'RIGHT', 'RIGHT'))
            # if len(obstacles) > 0 and obstacles[-1] in ('UP', 'DOWN'):
            #     options.append('LEFT_' + obstacles[-1])
            choice = rng.choice(options)
            obstacles.append(choice)
        lanes = []
        current_lane = 'MID'
        lanes.append(current_lane)
        for (choice_id, choice) in enumerate(obstacles):
            if 'UP' in choice:
                current_lane = 'LOW'
            elif 'DOWN' in choice:
                current_lane = 'HIGH'
            elif 'RIGHT' in choice:
                for future_choice in obstacles[choice_id + 1:]:
                    if 'UP' in future_choice:
                        current_lane = 'LOW'
                        break
                    elif 'DOWN' in future_choice:
                        current_lane = 'HIGH'
                        break
            if current_lane != lanes[-1]:
                lanes.append(current_lane)
        if len(lanes) > 2 and lanes[1] == 'LOW':
            # NOTE(sestren): Force initial lane change to be low for now
            # TODO(sestren): Remove later
            break
    result = obstacles
    return result

def get_updated_spike_room(seed, spike_room, rules):
    rng = random.Random(seed)
    result = spike_room.copy()
    for (search, replace, chance) in rules:
        rows = len(search)
        cols = len(search[0])
        for top in range(1 + len(result) - rows):
            for left in range(1 + len(result[top]) - cols):
                match_ind = True
                for row in range(rows):
                    if not match_ind:
                        break
                    for col in range(cols):
                        if result[top + row][left + col] != search[row][col]:
                            match_ind = False
                            break
                if not match_ind:
                    continue
                if chance < 1.0 and rng.random() > chance:
                    continue
                for row in range(rows):
                    for col in range(cols):
                        result[top + row] = result[top + row][:left + col] + replace[row][col] + result[top + row][left + col + 1:]
    return result

def get_shuffled_spike_room(initial_seed: int):
    rng = random.Random(initial_seed)
    obstacles = get_obstacles(rng.random(), 4)
    spike_room = [
        '------------------------------------------------',
        '#########@@@@@@@@@@@@@@@@@@@@@@@@@@@@@##########',
        '#########...?.....?.....?.....?.....?.@#########',
        '########X..............................@########',
        '#######X ...............................########',
        '###      ...............................     _##',
        '         ...............................        ',
        '         ...?.....?.....?.....?.....?...        ',
        '         ...............................        ',
        '         ............................... ===    ',
        '###__    ...............................########',
        '#####_   ..............................@########',
        '######XXX...?.....?.....?.....?.....?.@#########',
        '#########............................@##########',
        '#########@@@@@@@@@@@@@@@@@@@@@@@@@@@@###########',
        '------------------------------------------------',
    ]
    for (obstacle_id, obstacle) in enumerate(obstacles):
        if 'UP' in obstacle:
            top = 2
            col = 12 + 6 * obstacle_id
            for row_offset in range(6):
                row = top + row_offset
                spike_room[row] = spike_room[row][:col] + '@' + spike_room[row][col + 1:]
        if 'DOWN' in obstacle:
            top = 7
            col = 12 + 6 * obstacle_id
            for row_offset in range(7):
                row = top + row_offset
                spike_room[row] = spike_room[row][:col] + '@' + spike_room[row][col + 1:]
        if 'RIGHT' in obstacle:
            row = 7
            left = 12 + 6 * obstacle_id
            for col_offset in range(7):
                col = left + col_offset
                spike_room[row] = spike_room[row][:col] + '@' + spike_room[row][col + 1:]
        if 'LEFT' in obstacle:
            row = 7
            left = 6 + 6 * obstacle_id
            for col_offset in range(7):
                col = left + col_offset
                spike_room[row] = spike_room[row][:col] + '@' + spike_room[row][col + 1:]
    rules = [
        # Fill in square-shaped walls
        (('@@@@@@@', '@.....@', '@.....@', '@.....@', '@.....@', '@.....@', '@@@@@@@'), ('@@@@@@@', '@@...@@', '.@@.@@.', '..@@@..', '..@@@..', '.@@.@@.', '@@...@@'), 1.0),
        (('@@@@@@@', '@.....@', '@.....@', '@.....@', '@.....@', '@.....@', '@.....@', '@@@@@@@'), ('.......', '@@...@@', '.@@.@@.', '..@@@..', '..@@@..', '.@@.@@.', '@@...@@', '@@@@@@@'), 1.0),
        # Convert empty tiles to soft walls
        (('.', ), ('*', ), 1.0),
        (('?', ), ('*', ), 1.0),
    ]
    spike_room = get_updated_spike_room(rng.random(), spike_room, rules)
    # Carve a solvable path
    for (curr_row, curr_col) in (
        ( 5, 9),
        (10, 9),
    ):
        while curr_col < 41:
            # Carve current radius
            for row_offset in range(-2, 2 + 1):
                for col_offset in range(-2, 2 + 1):
                    if (abs(row_offset) + abs(col_offset)) > 3:
                        continue
                    (row, col) = (curr_row + row_offset, curr_col + col_offset)
                    if spike_room[row][col] == '*':
                        spike_room[row] = spike_room[row][:col] + '.' + spike_room[row][col + 1:]
            BASE_WEIGHT = 5
            FORWARD_WEIGHT = 4
            moves = set((
                (int(BASE_WEIGHT + 0.5 * FORWARD_WEIGHT), curr_row - 1, curr_col),
                (int(BASE_WEIGHT + 0.5 * FORWARD_WEIGHT), curr_row + 1, curr_col),
                (int(BASE_WEIGHT + 0.0 * FORWARD_WEIGHT), curr_row    , curr_col - 1),
                (int(BASE_WEIGHT + 1.0 * FORWARD_WEIGHT), curr_row    , curr_col + 1),
            ))
            # Valid moves must not get too close to a wall
            valid_moves = []
            for (weight, next_row, next_col) in list(moves):
                valid_ind = True
                if next_col < 6:
                    valid_ind = False
                for row_offset in range(-2, 2 + 1):
                    if not valid_ind:
                        break
                    for col_offset in range(-2, 2 + 1):
                        if (abs(row_offset) + abs(col_offset)) > 3:
                            continue
                        (row, col) = (next_row + row_offset, next_col + col_offset)
                        if 0 < row < len(spike_room) and 0 < col < len(spike_room[0]):
                            if spike_room[row][col] in ('#', '@'):
                                valid_ind = False
                                break
                        else:
                            valid_ind = False
                            break
                if valid_ind:
                    for _ in range(weight):
                        valid_moves.append((next_row, next_col))
            assert len(valid_moves) > 0
            (curr_row, curr_col) = rng.choice(list(sorted(valid_moves)))
    # Add spikes
    rules = [
        # Consider trimming rounded corners
        (('@@@', '.*@', '..@'), ('@@@', '..@', '..@'), 0.5),
        (('@@@', '@*.', '@..'), ('@@@', '@..', '@..'), 0.5),
        (('..@', '.*@', '@@@'), ('..@', '..@', '@@@'), 0.5),
        (('@..', '@*.', '@@@'), ('@..', '@..', '@@@'), 0.5),
    ]
    spike_room = get_updated_spike_room(rng.random(), spike_room, rules)
    # Add spikes
    rules = [
        # Clear all spikes before every round
        # (('x', ), ('.', ), 1.0),
        # (('v', ), ('.', ), 1.0),
        # Trim soft walls that are too close to the left side
        ((' *', ), (' .', ), 1.0),
        # Convert soft walls into hard walls
        (('*', ), ('@', ), 1.0),
        # Spawn primary spikes next to solid walls
        (('@.', ), ('@>', ), 1.0),
        (('.@', ), ('<@', ), 1.0),
        # Spawn primary spikes next to solid floors and ceilings
        (('.', '@'), ('^', '@'), 1.0),
        (('@', '.'), ('@', 'v'), 1.0),
        # Spawn secondary spikes vertically next to a single tile or vertical array of primary spikes
        (('.', '>', '.'), (')', '>', '('), 1.0),
        (('.', '<', '.'), ('(', '<', ')'), 1.0),
        (('>', '>', '.'), ('>', '>', '('), 1.0),
        (('<', '<', '.'), ('<', '<', ')'), 1.0),
        (('.', '>', '>'), (')', '>', '>'), 1.0),
        (('.', '<', '<'), ('(', '<', '<'), 1.0),
        # Spawn secondary spikes horizontally next to a single tile of primary spikes
        (('.^.'), ('(^)'), 1.0),
        (('.v.'), (')v('), 1.0),
    ]
    spike_room = get_updated_spike_room(rng.random(), spike_room, rules)
    result = spike_room
    for row_data in result:
        print(row_data)
    return result

def main(initial_seed: int):
    edits = []
    shuffled_spike_room = get_shuffled_spike_room(initial_seed)
    target = []
    target.append(' ' * 48)
    for row_data in shuffled_spike_room[1:-1]:
        truncated_row_data = ' ' * 9 + row_data[9:40] + ' ' * 8
        target.append(truncated_row_data)
    target.append(' ' * 48)
    edit = {
        'Layer': 'Foreground and Background',
        'Source': [
            '                                                ',
            '         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@##        ',
            '         vvvvvvvvvvvvvvx@@@@vvvvvvvv@@@#        ',
            '         ..............<@@x(........vv@@        ',
            '         ..............<@@>...........vv        ',
            '         ..............<@@>.............        ',
            '         ..(x)...(^^^^^x@@>...(^^.......        ',
            '         ..<@>...<@@@@@@@@>...<@@^^.....        ',
            '         ..<@>...)vvvvvx@x(...)x@@@^^^^^        ',
            '         ..<@>.........)x(.....<@@@@@@@@        ',
            '         ..<@>.................<@@@@@@@@        ',
            '         ..<@x^...............^x@@@@@@@@        ',
            '         ^^x@@@^^^^^.........^@@@@@@@@@@        ',
            '         @@@@@@@@@@@^^^^^^^^^@@@@@@@@@@#        ',
            '         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@##        ',
            '                                                '
        ],
        'Target': target,
    }
    edits.append(edit)
    result = edits
    return result

if __name__ == '__main__':
    '''
    Usage
    python shuffle_spike_room.py
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    parser = argparse.ArgumentParser()
    parser.add_argument('extraction', help='Input a filepath to the extraction JSON file', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    args = parser.parse_args()
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(MIN_SEED, MAX_SEED))
    global_rng = random.Random(initial_seed)
    seed = global_rng.randint(MIN_SEED, MAX_SEED)
    # with (
    #     open(args.extraction) as extraction_file,
    # ):
    #     extraction = json.load(extraction_file)
    tilemaps = main(initial_seed)