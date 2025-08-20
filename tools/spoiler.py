
# External libraries
import base64
import argparse
import json

def get_stage_spoiler(core_data: dict, changes: dict) -> list[str]:
    codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+. '
    legend = []
    grid = [['.' for col in range(64)] for row in range(64)]
    for room_name in changes['Rooms'].keys():
        (index, top, left, rows, cols) = (
            core_data['Rooms'][room_name]['Index'],
            changes['Rooms'][room_name]['Top'],
            changes['Rooms'][room_name]['Left'],
            core_data['Rooms'][room_name]['Rows'],
            core_data['Rooms'][room_name]['Columns'],
        )
        code = codes[index]
        legend.append((code, room_name))
        for row in range(max(0, top), min(64, top + rows)):
            for col in range(max(0, left), min(64, left + cols)):
                prev_index = codes.find(grid[row][col])
                if index < prev_index:
                    grid[row][col] = code
    result = []
    for row_data in grid:
        result.append(''.join(row_data))
    for (code, room_name) in legend:
        index = core_data['Rooms'][room_name]['Index']
        top = changes['Rooms'][room_name]['Top']
        left = changes['Rooms'][room_name]['Left']
        width = core_data['Rooms'][room_name]['Columns']
        height = core_data['Rooms'][room_name]['Rows']
        result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
    return result

def get_room_spoiler(extraction: dict, changes: dict, mapper_data, stage_name: str) -> list[str]:
    codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+. '
    legend = []
    extraction_stage = extraction['Stages'][stage_name]
    changes_stage = changes['Stages'][stage_name]
    (stage_top, stage_left, stage_bottom, stage_right) = (float('inf'), float('inf'), float('-inf'), float('-inf'))
    for (room_name, changes_room) in changes_stage['Rooms'].items():
        extraction_room = extraction_stage['Rooms'][room_name]
        top = changes_room['Top']
        left = changes_room['Left']
        width = 1 + extraction_room['Left']['Value'] - extraction_room['Right']['Value']
        height = 1 + extraction_room['Top']['Value'] - extraction_room['Bottom']['Value']
        bottom = top + height - 1
        right = left + width - 1
        stage_top = min(stage_top, top)
        stage_left = min(stage_left, left)
        stage_bottom = max(stage_bottom, bottom)
        stage_right = max(stage_right, right)
    stage_rows = 1 + stage_bottom - stage_top
    stage_cols = 1 + stage_right - stage_left
    grid = [[' ' for col in range(5 * stage_cols)] for row in range(5 * stage_rows)]
    for (room_name, changes_room) in changes_stage['Rooms'].items():
        extraction_room = extraction_stage['Rooms'][room_name]
        top = changes_room['Top']
        left = changes_room['Left']
        width = 1 + extraction_room['Left']['Value'] - extraction_room['Right']['Value']
        height = 1 + extraction_room['Top']['Value'] - extraction_room['Bottom']['Value']
        bottom = top + height - 1
        right = left + width - 1
        (index, room_top, room_left, room_rows, room_cols) = (
            extraction_room['Room ID']['Value'],
            top,
            left,
            height,
            width,
        )
        code = codes[index]
        legend.append((code, room_name))
        for cell_row in range(max(0, room_top), min(64, room_top + room_rows)):
            for cell_col in range(max(0, room_left), min(64, room_left + room_cols)):
                top = cell_row - stage_top
                left = cell_col - stage_left
                for row in range(5 * top + 1, 5 * top + 4):
                    for col in range(5 * left + 1, 5 * left + 4):
                        prev_index = codes.find(grid[row][col])
                        if index < prev_index:
                            grid[row][col] = code
        for node in mapper_data['Rooms'][room_name]['Nodes'].values():
            (exit_row, exit_col, exit_edge) = (node['Row'], node['Column'], node['Edge'])
            row = 2 + 5 * (room_top - stage_top + exit_row)
            col = 2 + 5 * (room_left - stage_left + exit_col)
            if exit_edge == 'Top':
                row -= 2
            elif exit_edge == 'Left':
                col -= 2
            elif exit_edge == 'Bottom':
                row += 2
            elif exit_edge == 'Right':
                col += 2
            grid[row][col] = code # '@'
    result = []
    for row_data in grid:
        result.append(''.join(row_data))
    for (code, room_name) in legend:
        index = extraction['Stages'][stage_name]['Rooms'][room_name]['Room ID']
        top = changes['Stages'][stage_name]['Rooms'][room_name]['Top']
        left = changes['Stages'][stage_name]['Rooms'][room_name]['Left']
        width = extraction['Stages'][stage_name]['Rooms'][room_name]['Columns']
        height = extraction['Stages'][stage_name]['Rooms'][room_name]['Rows']
        result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
    return result

if __name__ == '__main__':
    '''
    View spoilers of room and stage layout

    Usage
    python src/sotn_spoiler.py INPUT_JSON
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('extraction_filepath', help='Input a filepath ...', type=str)
    args = parser.parse_args()
    with (
        open(args.extraction_filepath) as extraction_file,
    ):
        extraction = json.load(extraction_file)
        chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        grid = [[' ' for col in range(64)] for row in range(64)]
        command = 'Castle Entrance'
        while True:
            for row in range(64):
                for col in range(64):
                    grid[row][col] = '.'
            for stage_name in extraction['Stages']:
                rooms = extraction['Stages'][stage_name]['Rooms']
                for (room_id, room) in rooms.items():
                    top = room['Top']['Value']
                    left = room['Left']['Value']
                    bottom = room['Bottom']['Value']
                    right = room['Right']['Value']
                    for row in range(top, bottom + 1):
                        for col in range(left, right + 1):
                            if (0 <= row < 64) and (0 <= col < 64):
                                grid[row][col] = '#'
                            else:
                                print((stage_name, room_id, row, col), 'out of range')
            if command == 'Boss Teleporters':
                teleporters = extraction['Boss Teleporters']['Data']
                for (teleporter_id, teleporter) in enumerate(teleporters):
                    x = teleporter['Room X']
                    y = teleporter['Room Y']
                    grid[y][x] = chars[int(teleporter_id)]
            else:
                rooms = extraction['Stages'][command]['Rooms']
                for (room_id, room) in rooms.items():
                    top = room['Top']['Value']
                    left = room['Left']['Value']
                    bottom = room['Bottom']['Value']
                    right = room['Right']['Value']
                    for row in range(top, bottom + 1):
                        for col in range(left, right + 1):
                            grid[row][col] = chars[int(room_id)]
            marker = '0123456789012345678901234567890123456789012345678901234567890123'
            print(' ', marker)
            print('')
            for row in range(64):
                row_data = ''.join(grid[row])
                print(marker[row], row_data)
            command = input()