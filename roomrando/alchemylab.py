import roomrando
import json
import yaml

'''
TODO(sestren): Clear old map tiles when rooms change locations
TODO(sestren): Update teleport locations to match where rooms are
'''

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

def get_swap_rooms_ppf(logic, changes):
    addresses = {
        ('Castle Map'): roomrando.Address(0x001AF800),
        ('Room Data', 'Alchemy Laboratory'): roomrando.Address(0x049C0F2C),
        ('Packed Room Data', 'Alchemy Laboratory, Bat Card Room'): roomrando.Address(0x049BE97C),
        ('Packed Room Data', 'Alchemy Laboratory, Exit to Holy Chapel'): roomrando.Address(0x049BE98C),
        ('Packed Room Data', 'Alchemy Laboratory, Blue Door Hallway'): roomrando.Address(0x049BE99C),
        ('Packed Room Data', 'Alchemy Laboratory, Bloody Zombie Hallway'): roomrando.Address(0x049BE9AC),
        ('Packed Room Data', 'Alchemy Laboratory, Cannon Room'): roomrando.Address(0x049BE9BC),
        ('Packed Room Data', 'Alchemy Laboratory, Cloth Cape Room'): roomrando.Address(0x049BE9CC),
        ('Packed Room Data', 'Alchemy Laboratory, Sunglasses Room'): roomrando.Address(0x049BE9DC),
        ('Packed Room Data', 'Alchemy Laboratory, Glass Vats'): roomrando.Address(0x049BE9EC),
        ('Packed Room Data', 'Alchemy Laboratory, Skill of Wolf Room'): roomrando.Address(0x049BE9FC),
        ('Packed Room Data', 'Alchemy Laboratory, Heart Max-Up Room'): roomrando.Address(0x049BEA1C),
        ('Packed Room Data', 'Alchemy Laboratory, Entryway'): roomrando.Address(0x049BEA2C),
        ('Packed Room Data', 'Alchemy Laboratory, Tall Spittlebone Room'): roomrando.Address(0x049BEA4C),
        ('Packed Room Data', 'Alchemy Laboratory, Empty Zig Zag Room'): roomrando.Address(0x049BEA5C),
        ('Packed Room Data', 'Alchemy Laboratory, Short Zig Zag Room'): roomrando.Address(0x049BEA6C),
        ('Packed Room Data', 'Alchemy Laboratory, Tall Zig Zag Room'): roomrando.Address(0x049BEA7C),
        ('Packed Room Data', 'Alchemy Laboratory, Secret Life Max-Up Room'): roomrando.Address(0x049BEA8C),
        ('Packed Room Data', 'Alchemy Laboratory, Slogra and Gaibon Boss Room'): roomrando.Address(0x049BEA9C),
        ('Packed Room Data', 'Alchemy Laboratory, Box Puzzle Room'): roomrando.Address(0x049BEAAC),
        ('Packed Room Data', 'Alchemy Laboratory, Red Skeleton Lift Room'): roomrando.Address(0x049BEACC),
        ('Packed Room Data', 'Alchemy Laboratory, Tetromino Room'): roomrando.Address(0x049BEAEC),
        ('Packed Room Data', 'Alchemy Laboratory, Exit to Marble Gallery'): roomrando.Address(0x049BEAFC),
        ('Packed Room Data', 'Alchemy Laboratory, Corridor to Elevator'): roomrando.Address(0x049BEB0C),
        ('Packed Room Data', 'Alchemy Laboratory, Elevator Shaft'): roomrando.Address(0x049BEB1C),
        ('Packed Room Data', 'Alchemy Laboratory, Save Room A'): roomrando.Address(0x049BEB3C),
        ('Packed Room Data', 'Alchemy Laboratory, Save Room B'): roomrando.Address(0x049BEB4C),
        ('Packed Room Data', 'Alchemy Laboratory, Save Room C'): roomrando.Address(0x049BEB5C),
        ('Packed Room Data', 'Alchemy Laboratory, Loading Room A'): roomrando.Address(0x049BEB6C),
        ('Packed Room Data', 'Alchemy Laboratory, Loading Room B'): roomrando.Address(0x049BEB7C),
        ('Packed Room Data', 'Alchemy Laboratory, Loading Room C'): roomrando.Address(0x049BEB8C),
        ('Packed Room Data', 'Alchemy Laboratory, Fake Marble Gallery Room'): roomrando.Address(0x049BEB9C),
        ('Packed Room Data', 'Alchemy Laboratory, Fake Royal Chapel Room'): roomrando.Address(0x049BEBAC),
        ('Packed Room Data', 'Alchemy Laboratory, Fake Castle Entrance Room'): roomrando.Address(0x049BEBBC),
    }
    result = roomrando.PPF('Two rooms in Alchemy Lab have swapped places')
    canvas = roomrando.IndexedBitmapCanvas(256, 256)
    # result.patch_string(0x04389C76, '!ROOMS!')
    for room_name in sorted(changes.keys()):
        if (
            changes[room_name]['Index'] == logic[room_name]['Index'] and
            changes[room_name]['Top'] == logic[room_name]['Top'] and
            changes[room_name]['Left'] == logic[room_name]['Left']
        ):
            continue
        exits = []
        for node in logic[room_name]['Node Sections'].values():
            if 'Secret' not in node['Type']:
                exit = (node['Row'], node['Column'], node['Edge'])
                exits.append(exit)
        room = roomrando.Room(
            changes[room_name]['Index'],
            (
                changes[room_name]['Top'],
                changes[room_name]['Left'],
                logic[room_name]['Rows'],
                logic[room_name]['Columns'],
            ),
            exits,
        )
        result.patch_room_data(
            room,
            addresses[('Room Data', logic[room_name]['Stage'])]
        )
        result.patch_packed_room_data(
            room,
            addresses[('Packed Room Data', room_name)]
        )
        canvas.draw_room(room)
    result.patch_bitmap(canvas, addresses[('Castle Map')])
    return result

if __name__ == '__main__':
    '''
    Usage
    python alchemylab.py
    '''
    changes = {}
    file_name = 'build/AlchemyLabChanges.yaml'
    with open(file_name) as open_file:
        changes = yaml.safe_load(open_file)
    with open('build/logic.json') as open_file:
        logic = json.load(open_file)
        patch = get_swap_rooms_ppf(logic, changes)
        with open('build/SwapRooms.ppf', 'wb') as file:
            file.write(patch.bytes)