import roomrando

'''
- A dummy copy of NZ0-00 is visible from NZ0-13
- Initially, NZ0-00 and NZ0-13 should be moved around as one unit
- Once the ability to alter tilemaps becomes possible, that can be revisited
'''

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

def get_swap_rooms_ppf():
    addresses = {
        ('Castle Map'): roomrando.Address(0x001AF800),
        ('Room Data', 'NZ0'): roomrando.Address(0x049C0F2C),
        ('Packed Room Data', 'NZ0', 0x00): roomrando.Address(0x049BE97C),
        ('Packed Room Data', 'NZ0', 0x01): roomrando.Address(0x049BE98C),
        ('Packed Room Data', 'NZ0', 0x02): roomrando.Address(0x049BE99C),
        ('Packed Room Data', 'NZ0', 0x03): roomrando.Address(0x049BE9AC),
        ('Packed Room Data', 'NZ0', 0x04): roomrando.Address(0x049BE9BC),
        ('Packed Room Data', 'NZ0', 0x05): roomrando.Address(0x049BE9CC),
        ('Packed Room Data', 'NZ0', 0x06): roomrando.Address(0x049BE9DC),
        ('Packed Room Data', 'NZ0', 0x07): roomrando.Address(0x049BE9EC),
        ('Packed Room Data', 'NZ0', 0x08): roomrando.Address(0x049BE9FC),
        ('Packed Room Data', 'NZ0', 0x09): roomrando.Address(0x049BEA1C),
        ('Packed Room Data', 'NZ0', 0x0A): roomrando.Address(0x049BEA2C),
        ('Packed Room Data', 'NZ0', 0x0B): roomrando.Address(0x049BEA4C),
        ('Packed Room Data', 'NZ0', 0x0C): roomrando.Address(0x049BEA5C),
        ('Packed Room Data', 'NZ0', 0x0D): roomrando.Address(0x049BEA6C),
        ('Packed Room Data', 'NZ0', 0x0E): roomrando.Address(0x049BEA7C),
        ('Packed Room Data', 'NZ0', 0x0F): roomrando.Address(0x049BEA8C),
        ('Packed Room Data', 'NZ0', 0x10): roomrando.Address(0x049BEA9C),
        ('Packed Room Data', 'NZ0', 0x11): roomrando.Address(0x049BEAAC),
        ('Packed Room Data', 'NZ0', 0x12): roomrando.Address(0x049BEACC),
        ('Packed Room Data', 'NZ0', 0x13): roomrando.Address(0x049BEAEC),
        ('Packed Room Data', 'NZ0', 0x14): roomrando.Address(0x049BEAFC),
        ('Packed Room Data', 'NZ0', 0x15): roomrando.Address(0x049BEB0C),
        ('Packed Room Data', 'NZ0', 0x16): roomrando.Address(0x049BEB1C),
        ('Packed Room Data', 'NZ0', 0x17): roomrando.Address(0x049BEB3C),
        ('Packed Room Data', 'NZ0', 0x18): roomrando.Address(0x049BEB4C),
        ('Packed Room Data', 'NZ0', 0x19): roomrando.Address(0x049BEB5C),
        ('Packed Room Data', 'NZ0', 0x1A): roomrando.Address(0x049BEB6C),
        ('Packed Room Data', 'NZ0', 0x1B): roomrando.Address(0x049BEB7C),
        ('Packed Room Data', 'NZ0', 0x1C): roomrando.Address(0x049BEB8C),
        ('Packed Room Data', 'NZ0', 0x1D): roomrando.Address(0x049BEB9C),
        ('Packed Room Data', 'NZ0', 0x1E): roomrando.Address(0x049BEBAC),
        ('Packed Room Data', 'NZ0', 0x1F): roomrando.Address(0x049BEBBC),
    }
    rooms = {
        'Alchemy Lab 0x09': roomrando.Room(('NZ0', 0x09), (11, 34, 1, 1), [
            # (0, 0, 'RIGHT'),
        ]),
        'Alchemy Lab 0x0D': roomrando.Room(('NZ0', 0x0D), (11, 31, 1, 2), [
            (0, 0, 'LEFT'),
            (1, 0, 'RIGHT'),
        ]),
        'Alchemy Lab 0x0E': roomrando.Room(('NZ0', 0x0E), (12, 32, 1, 3), [
            (0, 0, 'LEFT'),
            (2, 0, 'RIGHT'),
            # (2, 0, 'DOWN'),
            # (2, 0, 'RIGHT'),
        ]),
        'Alchemy Lab 0x0F': roomrando.Room(('NZ0', 0x0F), (12, 35, 1, 2), [
            # (0, 0, 'UP'),
        ]),
    }
    rooms['Alchemy Lab 0x09'].top -= 1
    rooms['Alchemy Lab 0x09'].left -= 1
    rooms['Alchemy Lab 0x0D'].top += 2
    rooms['Alchemy Lab 0x0D'].left += 1
    rooms['Alchemy Lab 0x0E'].top -= 1
    rooms['Alchemy Lab 0x0E'].left -= 1
    rooms['Alchemy Lab 0x0F'].top -= 1
    rooms['Alchemy Lab 0x0F'].left -= 1
    result = roomrando.PPF('Two rooms in Alchemy Lab have swapped places')
    canvas = roomrando.IndexedBitmapCanvas(256, 256)
    # result.patch_string(0x04389C76, '!ROOMS!')
    for room in rooms.values():
        result.patch_room_data(
            room,
            addresses[('Room Data', room.stage_id)]
        )
        result.patch_packed_room_data(
            room,
            addresses[('Packed Room Data', room.stage_id, room.room_id)]
        )
        canvas.draw_room(room)
    result.patch_bitmap(canvas, addresses[('Castle Map')])
    return result

if __name__ == '__main__':
    '''
    Usage
    python ShuffleRooms.py
    '''
    patch = get_swap_rooms_ppf()
    with open('build/SwapRooms.ppf', 'wb') as file:
        file.write(patch.bytes)