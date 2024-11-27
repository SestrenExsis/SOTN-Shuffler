
# External libraries
import argparse
import json
import os
import yaml

# Local libraries
import mapper

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

def get_room_spoiler(core_data: dict, changes: dict, mapper_data, stage_name: str) -> list[str]:
    codes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+. '
    legend = []
    (stage_top, stage_left, stage_bottom, stage_right) = (float('inf'), float('inf'), float('-inf'), float('-inf'))
    for (room_name, room_info) in changes['Rooms'].items():
        if core_data['Rooms'][room_name]['Stage'] != stage_name:
            continue
        top = room_info['Top']
        left = room_info['Left']
        bottom = top + core_data['Rooms'][room_name]['Rows'] - 1
        right = left + core_data['Rooms'][room_name]['Columns'] - 1
        stage_top = min(stage_top, top)
        stage_left = min(stage_left, left)
        stage_bottom = max(stage_bottom, bottom)
        stage_right = max(stage_right, right)
    stage_rows = 1 + stage_bottom - stage_top
    stage_cols = 1 + stage_right - stage_left
    grid = [[' ' for col in range(5 * stage_cols)] for row in range(5 * stage_rows)]
    for (room_name, room_info) in changes['Rooms'].items():
        if core_data['Rooms'][room_name]['Stage'] != stage_name:
            continue
        (index, room_top, room_left, room_rows, room_cols) = (
            core_data['Rooms'][room_name]['Room ID'],
            room_info['Top'],
            room_info['Left'],
            core_data['Rooms'][room_name]['Rows'],
            core_data['Rooms'][room_name]['Columns'],
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
        index = core_data['Rooms'][room_name]['Room ID']
        top = changes['Rooms'][room_name]['Top']
        left = changes['Rooms'][room_name]['Left']
        width = core_data['Rooms'][room_name]['Columns']
        height = core_data['Rooms'][room_name]['Rows']
        result.append(str((code, room_name, ('I:', index, 'T:', top, 'L:', left, 'H:', height, 'W:', width))))
    return result

if __name__ == '__main__':
    '''
    View spoilers of room and stage layout

    Usage
    python src/sotn_spoiler.py INPUT_JSON
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('core_data_filepath', help='Input a filepath for creating the output JSON file', type=str)
    parser.add_argument('changes_filepath', help='Input a filepath ...', type=str)
    parser.add_argument('mapper_data_filepath', help='Input a filepath ...', type=str)
    args = parser.parse_args()
    with (
        open(args.core_data_filepath) as core_data_file,
        open(args.changes_filepath) as changes_file,
        open(args.mapper_data_filepath) as mapper_data_file,
    ):
        core_data = json.load(core_data_file)
        changes = json.load(changes_file)
        if 'Changes' in changes:
            changes = changes['Changes']
        mapper_data = mapper.MapperData().get_core()
        for row_data in get_room_spoiler(core_data, changes, mapper_data, 'Long Library'):
            print(row_data)