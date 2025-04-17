# External libraries
import random

if __name__ == '__main__':
    '''
    Usage
    python shuffle_spike_room.py

    1) Within the "spike zone", every NONE or EMPTY tile orthogonally adjacent to one or more SOLID tiles will get SPIKES
    2) Every SPIKES tile orthogonally adjacent to 3 or more NONE or EMPTY tiles will have the two "diagonal"
    '''
    ROWS = 1
    COLS = 3
    NONE = ' '
    EMPTY = '.'
    SOLID = '@'
    SLOPE = '?'
    SPIKES = 'w'
    GOAL = '='
    vanilla_spike_room = [
        '                                                ',
        '#######@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@########',
        '#######@@xxxxxxxxxxxxxxx@@@@xxxxxxxx@@@@########',
        '#######@x..............x@@xx........xx@@########',
        '#######x...............x@@x...........xx########',
        '###    ................x@@x.............     ?##',
        '       ....vxv...vxxxxxx@@x...vxx.......        ',
        '       ....x@x...x@@@@@@@@x...x@@xx.....        ',
        '       ....x@x...vxxxxxx@xv...vx@@@xxxxx        ',
        '       ....x@x.........vxv.....x@@@@@@@@ ===    ',
        '###??  ....x@x.................x@@@@@@@@########',
        '#####? ....x@xx...............xx@@@@@@@@########',
        '######wxxxxx@@@xxxxx.........x@@@@@@@@@@########',
        '#######@@@@@@@@@@@@@xxxxxxxxx@@@@@@@@@@@########',
        '#######@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@########',
        '                                                ',
    ]
    spike_room = [
        '                                                ',
        '#######@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@########',
        '#######.................................########',
        '#######.................................########',
        '#######.................................########',
        '###    .................................     ?##',
        '       .................................        ',
        '       .................................        ',
        '       .................................        ',
        '       ................................. ===    ',
        '###??  .................................########',
        '#####? .................................########',
        '######w.................................########',
        '#######.................................########',
        '#######@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@########',
        '                                                ',
    ]
    rules = [
        # Clear all spikes before every round
        (('x', ), ('.', ), 1.0),
        (('v', ), ('.', ), 1.0),
        # Grow solid walls
        # (('.@.', '...', '...'), ('.@.', '.@.', '...'), 0.05),
        # (('...', '...', '.@.'), ('...', '.@.', '.@.'), 0.05),

        (('@@@@@', '.....', '.....'), ('@@@@@', '..@..', '.....'), 0.05),
        # (('.....', '...', '@@@'), ('...', '.@.', '@@@'), 0.05),
        # (('@.', ), ('@@', ), 0.05),
        # (('.@', ), ('@@', ), 0.05),
        # (('.', '@'), ('@', '@'), 0.05),
        # (('@', '.'), ('@', '@'), 0.05),
        # (('.@.', '...', '...'), ('.@.', '.@.', '.@.'), 0.20),
        # (('...', '...', '.@.'), ('.@.', '.@.', '.@.'), 0.20),
        # (('...', '@..', '...'), ('...', '@@@', '...'), 0.20),
        # (('...', '..@', '...'), ('...', '@@@', '...'), 0.20),
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
    rng = random.Random()
    for _ in range(1):
        prev_spike_room = spike_room.copy()
        for (search, replace, chance) in rules:
            rows = len(search)
            cols = len(search[0])
            for top in range(1 + len(spike_room) - rows):
                for left in range(1 + len(spike_room[top]) - cols):
                    match_ind = True
                    for row in range(rows):
                        if not match_ind:
                            break
                        for col in range(cols):
                            if spike_room[top + row][left + col] != search[row][col]:
                                match_ind = False
                                break
                    if not match_ind:
                        continue
                    if chance < 1.0 and rng.random() > chance:
                        continue
                    for row in range(rows):
                        for col in range(cols):
                            spike_room[top + row] = spike_room[top + row][:left + col] + replace[row][col] + spike_room[top + row][left + col + 1:]
        solvable_ind = True # attempt to solve
        if not solvable_ind:
            spike_room = prev_spike_room
            break
    for row_data in spike_room:
        print(row_data)
