# External libraries
import os
import yaml

# Local libraries
import mapper

def get_room_drawing(mapper_core, room_name) -> list[str]:
    room = mapper_core['Rooms'][room_name]
    rows = room['Rows']
    cols = room['Columns']
    char = '1'
    if room_name.startswith('Warp Room '):
        char = '5'
    elif 'Save Room' in room_name:
        char = '4'
    elif 'Loading Room' in room_name:
        char = 'c'
    elif 'FAKE ROOM WITH TELEPORTER' in room_name.upper():
        char = 'a'
    grid = [['0' for col in range(1 + 4 * cols)] for row in range(1 + 4 * rows)]
    for row in range(rows):
        row_span = 4 if row < (rows - 1) else 3
        for col in range(cols):
            if (row, col) in room['Empty Cells']:
                continue
            col_span = 4 if col < (cols - 1) else 3
            for r in range(row_span):
                for c in range(col_span):
                    grid[1 + 4 * row + r][1 + 4 * col + c] = char
    for node in room['Nodes'].values():
        row = 2 + 4 * node['Row']
        col = 2 + 4 * node['Column']
        if node['Edge'] == 'Top':
            row -= 2
        elif node['Edge'] == 'Left':
            col -= 2
        elif node['Edge'] == 'Bottom':
            row += 2
        elif node['Edge'] == 'Right':
            col += 2
        grid[row][col] = '1'
    result = []
    for row in range(len(grid)):
        result.append(''.join(grid[row]))
    return result

if __name__ == '__main__':
    '''
    Usage
    python helper.py
    '''
    mapper_core = mapper.MapperData().get_core()
    for folder_name in (
        'clock-tower',
    ):
        directory_listing = os.listdir(os.path.join('data', 'rooms', folder_name))
        file_listing = list(name for name in directory_listing if name.endswith('.yaml'))
        for file_name in file_listing:
            with (
                open(os.path.join('data', 'rooms', folder_name, file_name)) as file_yaml,
            ):
                room_data = yaml.safe_load(file_yaml)
                room_name = room_data['Stage'] + ', ' + room_data['Room']
                room_drawing = get_room_drawing(mapper_core, room_name)
                print(room_name)
                print('Map:')
                for row_data in room_drawing:
                    print('    - "' + row_data + '"')
