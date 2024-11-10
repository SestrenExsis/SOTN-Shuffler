import argparse

sector_header_size = 24
sector_data_size = 2048
sector_error_correction_data_size = 280
sector_size = sector_header_size + sector_data_size + sector_error_correction_data_size

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

def get_disc_address(gamedata_address):
    sector, offset = divmod(gamedata_address, sector_data_size)
    result = sector * sector_size + offset + sector_header_size
    return result

def get_gamedata_address(disc_address):
    sector, offset = divmod(disc_address, sector_size)
    if offset < sector_header_size:
        return None
    elif offset >= (sector_header_size + sector_data_size):
        return None
    result = sector * sector_data_size + (offset - sector_header_size) % sector_data_size
    return result

def get_castlemap(map_filename):
    map_addr = 0x001EF8E8 # game address = 0x001AF800
    base = get_gamedata_address(map_addr)
    result = []
    with open(map_filename, 'rb') as file:
        for row in range(256):
            result.append([])
            for col2 in range(128):
                game_address = base + 128 * row + col2
                disc_address = get_disc_address(game_address)
                file.seek(disc_address)
                char = (file.read(1).hex())[::-1]
                result[-1].append(char)
    return result

if __name__ == '__main__':
    '''
    Usage
    python ReadCastleMap.py FILEPATH
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('filepath', help='Filepath to a SOTN BIN', type=str)
    args = parser.parse_args()
    castlemap = get_castlemap(args.filepath)
    with open('build/CastleMap.out', 'w') as file:
        for line in castlemap:
            file.write(''.join(line))
            file.write('\n')