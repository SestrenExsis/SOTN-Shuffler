import roomrando

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

def get_swap_rooms_ppf():
    address = roomrando.Address()
    address.addresses['Castle Map'] = 0x001AF800
    address.addresses['Packed Room Data, Alchemy Lab 0x0D'] = 0x049BEA6C
    address.addresses['Packed Room Data, Alchemy Lab 0x0E'] = 0x049BEA7C
    address.addresses['Room Data - Alchemy Lab'] = 0x049C0F2C
    def F(address_name, offset):
        return address.get_disc_address(address.addresses[address_name] + offset)
    result = roomrando.PPF('Two rooms in Alchemy Lab have swapped places')
    # result.patch_string(0x04389C76, '!ROOMS!')
    for (offset_in_file, patch_data) in (
        (F('Room Data - Alchemy Lab', 8 * 0x0D), [12, 33, 12, 34]),
        (F('Packed Room Data, Alchemy Lab 0x0D', 0), list(reversed([0x01, 0x88, 0xC8, 0x4C]))),
        (F('Room Data - Alchemy Lab', 8 * 0x0E), [11, 31, 11, 33]),
        (F('Packed Room Data, Alchemy Lab 0x0E', 0), list(reversed([0x01, 0x84, 0xB7, 0xCB]))),
    ):
        result.write_u32(offset_in_file)
        size = len(patch_data)
        result.write_byte(size)
        for i in range(size):
            result.write_byte(patch_data[i])
    canvas = roomrando.IndexedBitmapCanvas(256, 256)
    canvas.fill_rect(160, 8, 5, 5, 0)
    canvas.fill_rect(161, 9, 3, 3, 1)
    canvas.set_pixel(160, 10, 5)
    canvas.set_pixel(162, 12, 2)
    result.patch_bitmap(canvas, address.addresses['Castle Map'])
    return result

if __name__ == '__main__':
    '''
    Usage
    python ShuffleRooms.py
    '''
    patch = get_swap_rooms_ppf()
    with open('build/SwapRooms.ppf', 'wb') as file:
        file.write(patch.bytes)