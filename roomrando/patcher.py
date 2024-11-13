# External libraries
import json
import os

# Local libraries
import roomrando

def get_room_rando_ppf(logic, changes):
    addresses = {
        ('Castle Map'): roomrando.Address(0x001AF800),
        ('Teleporter Data'): roomrando.Address(0x00097C5C),
        ('Room Data', 'Alchemy Laboratory'): roomrando.Address(0x049C0F2C),
        ('Room Data', 'Castle Entrance'): roomrando.Address(0x041AB4C4),
        ('Room Data', 'Marble Gallery'): roomrando.Address(0x03F8D7E0),
        ('Room Data', 'Outer Wall'): roomrando.Address(0x0404A488),
        ('Room Data', 'Olrox\'s Quarters'): roomrando.Address(0x040FE2A0),
        ('Layer Data', 'Castle Entrance'): roomrando.Address(0x041A79C4),
        ('Layer Data', 'Alchemy Laboratory'): roomrando.Address(0x049BE964),
        ('Layer Data', 'Marble Gallery'): roomrando.Address(0x03F8B150),
        ('Layer Data', 'Outer Wall'): roomrando.Address(0x040471D4),
        ('Layer Data', 'Olrox\'s Quarters'): roomrando.Address(0x040FB110),
    }
    result = roomrando.PPF('Shuffled rooms in first few stages of the game')
    canvas = roomrando.IndexedBitmapCanvas(256, 256)
    for room_name in sorted(changes['Rooms'].keys()):
        if (
            changes['Rooms'][room_name]['Index'] == logic['Rooms'][room_name]['Index'] and
            changes['Rooms'][room_name]['Top'] == logic['Rooms'][room_name]['Top'] and
            changes['Rooms'][room_name]['Left'] == logic['Rooms'][room_name]['Left']
        ):
            continue
        exits = []
        for node in logic['Rooms'][room_name]['Nodes'].values():
            if 'Secret' not in node['Type']:
                exit = (node['Row'], node['Column'], node['Edge'])
                exits.append(exit)
        flags = set()
        if logic['Rooms'][room_name]['Flags'] is not None:
            flags = set(logic['Rooms'][room_name]['Flags'])
        foreground_layer_id = None
        if 'Foreground Layer ID' in logic['Rooms'][room_name]:
            foreground_layer_id = logic['Rooms'][room_name]['Foreground Layer ID']
        room = roomrando.Room(
            changes['Rooms'][room_name]['Index'],
            (
                changes['Rooms'][room_name]['Top'],
                changes['Rooms'][room_name]['Left'],
                logic['Rooms'][room_name]['Rows'],
                logic['Rooms'][room_name]['Columns'],
            ),
            exits,
            flags,
            foreground_layer_id,
        )
        result.patch_room_data(
            room,
            addresses[('Room Data', logic['Rooms'][room_name]['Stage'])]
        )
        if 'Foreground Layer ID' in logic['Rooms'][room_name]:
            result.patch_packed_room_data(
                room,
                addresses[('Layer Data', logic['Rooms'][room_name]['Stage'])]
            )
        canvas.draw_room(room)
    result.patch_bitmap(canvas, addresses[('Castle Map')])
    stages = {
        'Marble Gallery': 0x00,
        'Castle Entrance Revisited': 0x07,
        'Alchemy Laboratory': 0x0C,
        'Castle Entrance': 0x41,
    }
    if 'Teleporters' in changes and 'Sources' in changes['Teleporters']:
        for source_name in sorted(changes['Teleporters']['Sources'].keys()):
            target_name = changes['Teleporters']['Sources'][source_name]['Target']
            if target_name == logic['Teleporters']['Sources'][source_name]['Target']:
                continue
            source_stage_name = logic['Teleporters']['Sources'][source_name]['Stage']
            target_stage_name = logic['Teleporters']['Targets'][target_name]['Stage']
            source_stage_id = stages[source_stage_name]
            target_stage_id = stages[target_stage_name]
            room_name = logic['Teleporters']['Targets'][target_name]['Stage'] + ', ' + logic['Teleporters']['Targets'][target_name]['Room']
            teleporter = roomrando.Teleporter(
                logic['Teleporters']['Sources'][source_name]['Index'],
                logic['Teleporters']['Targets'][target_name]['Player X'],
                logic['Teleporters']['Targets'][target_name]['Player Y'],
                logic['Rooms'][room_name]['Index'],
                source_stage_id,
                target_stage_id
            )
            result.patch_teleporter_data(
                teleporter,
                addresses['Teleporter Data']
            )
    return result

if __name__ == '__main__':
    '''
    Usage
    python alchemylab.py
    '''
    with open(os.path.join('build', 'sandbox', 'current-seed.json')) as current_seed_json:
        current_seed = json.load(current_seed_json)
        changes = current_seed['Changes']
        data_core = current_seed['Data Core']
        patch = get_room_rando_ppf(data_core, changes)
        with open(os.path.join('build', 'RoomRando.ppf'), 'wb') as file:
            file.write(patch.bytes)