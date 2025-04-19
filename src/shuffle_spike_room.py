# External libraries
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
            if len(obstacles) > 0 and obstacles[-1] in ('UP', 'DOWN'):
                options.append('LEFT_' + obstacles[-1])
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

def get_updated_spike_room(spike_room, rules):
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

if __name__ == '__main__':
    '''
    Usage
    python shuffle_spike_room.py

    1) Within the "spike zone", every NONE or EMPTY tile orthogonally adjacent to one or more SOLID tiles will get SPIKES
    2) Every SPIKES tile orthogonally adjacent to 3 or more NONE or EMPTY tiles will have the two "diagonal"
    '''
    rng = random.Random()
    obstacles = get_obstacles(rng.random(), 4)
    print(obstacles)
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
    for row_data in spike_room:
        print(row_data)
    rules = [
        # Fill in square-shaped walls
        (('@@@@@@@', '@.....@', '@.....@', '@.....@', '@.....@', '@.....@', '@@@@@@@'), ('@@@@@@@', '@.....@', '.@...@.', '..@@@..', '..@@@..', '.@...@.', '@.....@'), 1.0),
        (('@@@@@@@', '@.....@', '@.....@', '@.....@', '@.....@', '@.....@', '@.....@', '@@@@@@@'), ('.......', '@.....@', '.@...@.', '..@@@..', '..@@@..', '.@...@.', '@.....@', '@@@@@@@'), 1.0),
        # Convert empty tiles to soft walls
        (('.', ), ('*', ), 1.0),
        (('?', ), ('*', ), 1.0),
    ]
    spike_room = get_updated_spike_room(spike_room, rules)
    for row_data in spike_room:
        print(row_data)
    # Carve a solvable path
    (curr_row, curr_col, steps) = (7, 6, 0)
    while curr_col < 41:
        # Carve current radius
        for row_offset in range(-2, 2 + 1):
            for col_offset in range(-2, 2 + 1):
                if (abs(row_offset) + abs(col_offset)) > 3:
                    continue
                (row, col) = (curr_row + row_offset, curr_col + col_offset)
                if 0 < row < len(spike_room) and 0 < col < len(spike_room[0]):
                    pass
                else:
                    print((curr_row, curr_col, steps), (row_offset, col_offset), (row, col))
                    raise Exception()
                if spike_room[row][col] == '*':
                    spike_room[row] = spike_room[row][:col] + '.' + spike_room[row][col + 1:]
        BASE_WEIGHT = 3
        moves = set((
            (BASE_WEIGHT + 1, curr_row - 1, curr_col),
            (BASE_WEIGHT + 1, curr_row + 1, curr_col),
            (BASE_WEIGHT + 0, curr_row    , curr_col - 1),
            (BASE_WEIGHT + 2, curr_row    , curr_col + 1),
        ))
        # Valid moves must not get too close to a wall
        valid_moves = []
        for (weight, next_row, next_col) in list(moves):
            valid_ind = True
            if next_col < 6:
                valid_ind = False
                break
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
    for row_data in spike_room:
        print(row_data)
    # Add spikes
    rules = [
        # Consider trimming rounded corners
        (('@@@', '.*@', '..@'), ('@@@', '..@', '..@'), 0.5),
        (('@@@', '@*.', '@..'), ('@@@', '@..', '@..'), 0.5),
        (('..@', '.*@', '@@@'), ('..@', '..@', '@@@'), 0.5),
        (('@..', '@*.', '@@@'), ('@..', '@..', '@@@'), 0.5),
    ]
    spike_room = get_updated_spike_room(spike_room, rules)
    for row_data in spike_room:
        print(row_data)
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
    spike_room = get_updated_spike_room(spike_room, rules)
    for row_data in spike_room:
        print(row_data)
    '''
    vxv 0730 0731 0732      0000 078B 0000
    x@x
    ?@?

    v
    x@  0745 0746 
    v
    '''
    vanilla_spike_room = [
        '------------------------------------------------',
        '#########@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@########',
        '#########xxxxxxxxxxxxxxx@@@@xxxxxxxx@@@@########',
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
        '#########@@@@@@@@@@@xxxxxxxxx@@@@@@@@@@@########',
        '#########@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@########',
        '------------------------------------------------',
    ]