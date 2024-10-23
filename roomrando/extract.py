import argparse
import json
import os
import roomrando

def _hex(val: int, size: int) -> str:
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

if __name__ == '__main__':
    '''
    Usage
    python roomrando/extract.py "external/Castlevania - Symphony of the Night (Track 1).bin"
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('binary_filepath', help='Input a filepath to a binary file', type=str)
    # parser.add_argument('disc_address', help='Input a disc address as a hexstring', type=str)
    # parser.add_argument('extraction_type', help='ROOMS or LAYERS', type=str)
    args = parser.parse_args()
    with open(args.binary_filepath, 'br') as open_file:
        extracted_data = {}
        for (stage_name, address) in (
            ('Castle Entrance', roomrando.Address(0x041AB4C4, 'GAMEDATA')),
            ('Alchemy Laboratory', roomrando.Address(0x049C0F2C, 'GAMEDATA')),
            ('Marble Gallery', roomrando.Address(0x03F8D7E0, 'GAMEDATA')),
        ):
            rooms = []
            while True:
                room = {}
                data = []
                for i in range(8):
                    open_file.seek(address.to_disc_address(8 * len(rooms) + i))
                    byte = open_file.read(1)
                    data.append(byte)
                (left, top, right, bottom, layer_id, tile_def_id, entity_gfx_id, entity_layout_id) = data
                room = {
                    'Left': int.from_bytes(data[0], byteorder='little', signed=False),
                    'Top':  int.from_bytes(data[1], byteorder='little', signed=False),
                    'Right':  int.from_bytes(data[2], byteorder='little', signed=False),
                    'Bottom':  int.from_bytes(data[3], byteorder='little', signed=False),
                    'Layer ID':  int.from_bytes(data[4], byteorder='little', signed=False),
                    'Tile Def ID':  int.from_bytes(data[5], byteorder='little', signed=True),
                    'Entity Gfx ID':  int.from_bytes(data[6], byteorder='little', signed=False),
                    'Entity Layout ID':  int.from_bytes(data[7], byteorder='little', signed=False),
                }
                rooms.append(room)
                open_file.seek(address.to_disc_address(8 * len(rooms)))
                byte = open_file.read(1)
                value = int.from_bytes(byte, byteorder='little', signed=False)
                if value == 0x40:
                    break
            stage = {
                'Rooms': rooms,
            }
            extracted_data[stage_name] = stage
        with open(os.path.join('build', 'sandbox', 'vanilla.json'), 'w') as extracted_data_core_json:
            json.dump(extracted_data, extracted_data_core_json, indent='    ', sort_keys=True)