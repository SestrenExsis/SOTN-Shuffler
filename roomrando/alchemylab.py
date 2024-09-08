import roomrando

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

def get_swap_rooms_ppf():
    addresses = {
        ('Castle Map'): roomrando.Address(0x001AF800),
        ('Room Data', 'NZ0'): roomrando.Address(0x049C0F2C),
        ('Packed Room Data', 'NZ0', 0x09): roomrando.Address(0x049BEA1C),
        ('Packed Room Data', 'NZ0', 0x0A): roomrando.Address(0x049BEA2C),
        ('Packed Room Data', 'NZ0', 0x0B): roomrando.Address(0x049BEA4C),
        ('Packed Room Data', 'NZ0', 0x0C): roomrando.Address(0x049BEA5C),
        ('Packed Room Data', 'NZ0', 0x0D): roomrando.Address(0x049BEA6C),
        ('Packed Room Data', 'NZ0', 0x0E): roomrando.Address(0x049BEA7C),
        ('Packed Room Data', 'NZ0', 0x0F): roomrando.Address(0x049BEA8C),
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