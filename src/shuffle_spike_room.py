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
        '###      ...............................     ?##',
        '         ...............................        ',
        '         ...?.....?.....?.....?.....?...        ',
        '         ...............................        ',
        '         ............................... ===    ',
        '###??    ...............................########',
        '#####?   ..............................@########',
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
        (('x', ), ('.', ), 1.0),
        (('v', ), ('.', ), 1.0),
        # Trim soft walls that are too close to the left side
        ((' *', ), (' .', ), 1.0),
        # Convert soft walls into hard walls
        (('*', ), ('@', ), 1.0),
        # Spawn primary spikes next to solid walls
        (('@.', ), ('@x', ), 1.0),
        (('.@', ), ('x@', ), 1.0),
        # Spawn primary spikes next to solid floors and ceilings
        (('.', '@'), ('x', '@'), 1.0),
        (('@', '.'), ('@', 'x'), 1.0),
        # Spawn secondary spikes vertically next to a single tile or vertical array of primary spikes
        (('.', 'x', '.'), ('v', 'x', 'v'), 1.0),
        (('x', 'x', '.'), ('x', 'x', 'v'), 1.0),
        (('.', 'x', 'x'), ('v', 'x', 'x'), 1.0),
        # Spawn secondary spikes horizontally next to a single tile of primary spikes
        (('.x.'), ('vxv'), 1.0),
    ]
    spike_room = get_updated_spike_room(rng.random(), spike_room, rules)
    result = spike_room
    return result

def main(initial_seed: int):
    with (
        open(os.path.join('build', 'patcher', 'extraction.json')) as extraction_file,
    ):
        extraction = json.load(extraction_file)
    shuffled_spike_room = get_shuffled_spike_room(initial_seed)
    room_extract = extraction['Stages']['Catacombs']['Rooms']['24']
    tilemaps = {
        'Vanilla BG': [],
        'Vanilla FG': [],
        'Shuffled BG': [],
        'Shuffled FG': [],
    }
    for row_data in room_extract['Tilemap Foreground']:
        tilemaps['Vanilla FG'].append(list(map(lambda x: int(x, 16), row_data.split(' '))))
        tilemaps['Shuffled FG'].append([None] * len(tilemaps['Vanilla FG'][-1]))
    for row_data in room_extract['Tilemap Background']:
        tilemaps['Vanilla BG'].append(list(map(lambda x: int(x, 16), row_data.split(' '))))
        tilemaps['Shuffled BG'].append([None] * len(tilemaps['Vanilla BG'][-1]))
    vanilla_spike_room = [
        '------------------------------------------------',
        '#########@@@@@@@@@@@@@@@@@@@@@@@@@@@@@##########',
        '#########xxxxxxxxxxxxxxx@@@@xxxxxxxx@@@#########',
        '########x..............x@@xx........xx@@########',
        '#######x ..............x@@x...........xx########',
        '###      ..............x@@x.............     ?##',
        '         ..vxv...vxxxxxx@@x...vxx.......        ',
        '         ..x@x...x@@@@@@@@x...x@@xx.....        ',
        '         ..x@x...vxxxxxx@xv...vx@@@xxxxx        ',
        '         ..x@x.........vxv.....x@@@@@@@@ ===    ',
        '###??    ..x@x.................x@@@@@@@@########',
        '#####?   ..x@xx...............xx@@@@@@@@########',
        '######xxxxxx@@@xxxxx.........x@@@@@@@@@@########',
        '#########@@@@@@@@@@@xxxxxxxxx@@@@@@@@@@#########',
        '#########@@@@@@@@@@@@@@@@@@@@@@@@@@@@@##########',
        '------------------------------------------------',
    ]
    (TOP, LEFT) = (1, 9)
    (ROWS, COLS) = (14, 31)
    for (stamp_height, stamp_width) in (
        (5, 5), # 25
        (5, 4), # 20
        (4, 5), # 20
        (4, 4), # 16
        (5, 3), # 15
        (3, 5), # 15
        (4, 3), # 12
        (3, 4), # 12
        (5, 2), # 10
        (2, 5), # 10
        (3, 3), # 9
        (4, 2), # 8
        (2, 4), # 8
        (3, 2), # 6
        (2, 3), # 6
        (5, 1), # 5
        (1, 5), # 5
        (2, 2), # 4
        (3, 1), # 3
        (1, 3), # 3
        (2, 1), # 2
        (1, 2), # 2
        (1, 1), # 1
    ):
        # Find valid target locations for the stamp
        for target_top in range(TOP, TOP + ROWS - (stamp_height - 1)):
            for target_left in range(LEFT, LEFT + COLS - (stamp_width - 1)):
                # Confirm target location has empty space for the stamp
                valid_ind = True
                for row in range(stamp_height):
                    if not valid_ind:
                        break
                    for col in range(stamp_width):
                        if tilemaps['Shuffled FG'][target_top + row][target_left + col] is not None:
                            valid_ind = False
                            break
                if not valid_ind:
                    continue
                # Stamp if a valid source location can be found
                valid_ind = False
                for source_top in range(TOP, TOP + ROWS - (stamp_height - 1)):
                    if valid_ind:
                        break
                    for source_left in range(LEFT, LEFT + COLS - (stamp_width - 1)):
                        # Find first source location that matches the shuffled location for the stamp
                        valid_ind = True
                        for row in range(stamp_height):
                            if not valid_ind:
                                break
                            for col in range(stamp_width):
                                source = vanilla_spike_room[source_top + row][source_left + col]
                                target = shuffled_spike_room[target_top + row][target_left + col]
                                if source != target:
                                    valid_ind = False
                                    break
                        # Apply the stamp
                        if valid_ind:
                            for row in range(stamp_height):
                                for col in range(stamp_width):
                                    fg = tilemaps['Vanilla FG'][source_top + row][source_left + col]
                                    tilemaps['Shuffled FG'][target_top + row][target_left + col] = fg
                                    bg = tilemaps['Vanilla BG'][source_top + row][source_left + col]
                                    tilemaps['Shuffled BG'][target_top + row][target_left + col] = bg
                            break
    for row in range(len(tilemaps['Shuffled FG'])):
        for col in range(len(tilemaps['Shuffled FG'][row])):
            if tilemaps['Shuffled FG'][row][col] is None:
                tilemaps['Shuffled FG'][row][col] = tilemaps['Vanilla FG'][row][col]
    for row in range(len(tilemaps['Shuffled BG'])):
        for col in range(len(tilemaps['Shuffled BG'][row])):
            if tilemaps['Shuffled BG'][row][col] is None:
                tilemaps['Shuffled BG'][row][col] = tilemaps['Vanilla BG'][row][col]
    tilemap_fg = []
    for row in range(len(tilemaps['Shuffled FG'])):
        row_data = ' '.join(map(lambda x: ('{:04X}').format(x), tilemaps['Shuffled FG'][row]))
        tilemap_fg.append(row_data)
    tilemap_bg = []
    for row in range(len(tilemaps['Shuffled BG'])):
        row_data = ' '.join(map(lambda x: ('{:04X}').format(x), tilemaps['Shuffled BG'][row]))
        tilemap_bg.append(row_data)
    result = {
        'Tilemap Foreground': tilemap_fg,
        'Tilemap Background': tilemap_bg,
    }
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