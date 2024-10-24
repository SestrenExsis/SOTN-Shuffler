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
        extracted_data = {
            'Rooms': {},
            'Layers': {},
            'Extractions': {},
        }
        extracted_data['Extractions']['Rooms'] = {}
        for (stage_name, room_address_start) in (
            ('Castle Entrance', roomrando.Address(0x041AB4C4, 'GAMEDATA')),
            ('Alchemy Laboratory', roomrando.Address(0x049C0F2C, 'GAMEDATA')),
            ('Marble Gallery', roomrando.Address(0x03F8D7E0, 'GAMEDATA')),
        ):
            rooms_address = roomrando.Address(room_address_start.address, 'GAMEDATA')
            extracted_data['Extractions']['Rooms'][stage_name] = {
                'Disc Address': rooms_address.to_disc_address(),
                'Gamedata Address': rooms_address.address,
            }
            rooms = []
            current_address = roomrando.Address(rooms_address.address, 'GAMEDATA')
            while True:
                extracted_data['Extractions']['Rooms'][stage_name + ', Room ID ' + ('00' + str(len(rooms)))[-2:]] = {
                    'Disc Address': current_address.to_disc_address(),
                    'Gamedata Address': current_address.address,
                }
                room = {}
                data = []
                for i in range(8):
                    open_file.seek(current_address.to_disc_address(i))
                    byte = open_file.read(1)
                    data.append(byte)
                room = {
                    'Stage': stage_name,
                    'Room ID': len(rooms),
                    'Left': int.from_bytes(data[0], byteorder='little', signed=False),
                    'Top':  int.from_bytes(data[1], byteorder='little', signed=False),
                    'Right':  int.from_bytes(data[2], byteorder='little', signed=False),
                    'Bottom':  int.from_bytes(data[3], byteorder='little', signed=False),
                    'Layer ID':  int.from_bytes(data[4], byteorder='little', signed=False),
                    'Tile Def ID':  int.from_bytes(data[5], byteorder='little', signed=True),
                    'Entity Gfx ID':  int.from_bytes(data[6], byteorder='little', signed=False),
                    'Entity Layout ID':  int.from_bytes(data[7], byteorder='little', signed=False),
                }
                room['Width'] = 1 + room['Right'] - room['Left']
                room['Height'] = 1 + room['Bottom'] - room['Top']
                rooms.append(room)
                current_address.address += 8
                open_file.seek(current_address.to_disc_address())
                byte = open_file.read(1)
                value = int.from_bytes(byte, byteorder='little', signed=False)
                if value == 0x40:
                    break
            extracted_data['Rooms'][stage_name] = rooms
        # Extract layer data
        extracted_data['Extractions']['Layers'] = {}
        for (stage_name, layers_address_start, layer_count) in (
            ('Castle Entrance', roomrando.Address(0x041A79CC, 'GAMEDATA'), 48),
            ('Castle Entrance Revisited', roomrando.Address(0x0491A9D0, 'GAMEDATA'), 44),
            ('Alchemy Laboratory', roomrando.Address(0x049BE964, 'GAMEDATA'), 35),
        ):
            layers_address = roomrando.Address(layers_address_start.address, 'GAMEDATA')
            extracted_data['Extractions']['Layers'][stage_name] = {
                'Disc Address': layers_address.to_disc_address(),
                'Gamedata Address': layers_address.address,
            }
            layers = []
            current_address = roomrando.Address(layers_address.address, 'GAMEDATA')
            for _ in range(layer_count):
                extracted_data['Extractions']['Layers'][stage_name + ', Layer ID ' + str(len(layers))] = {
                    'Disc Address': current_address.to_disc_address(),
                    'Gamedata Address': current_address.address,
                }
                layer = {}
                data = []
                for i in range(16):
                    open_file.seek(current_address.to_disc_address(i))
                    byte = open_file.read(1)
                    data.append(int.from_bytes(byte))
                layer = {
                    'Layer ID': len(layers),
                    'Tilemap': _hex(int.from_bytes(data[0:4], byteorder='little', signed=False), 8),
                    'Tiledef': _hex(int.from_bytes(data[4:8], byteorder='little', signed=False), 8),
                    'Packed Layout': _hex(int.from_bytes(data[8:12], byteorder='little', signed=False), 8),
                    'Z-Priority':  int.from_bytes(data[12:14], byteorder='little', signed=False),
                    'Unknown 1': int.from_bytes(data[14:15], byteorder='little', signed=False),
                    'Unknown 2': int.from_bytes(data[15:16], byteorder='little', signed=False),
                }
                layers.append(layer)
                current_address.address += 16
            extracted_data['Layers'][stage_name] = layers
            # TODO(sestren): Extract room-layer assignments
            # room_layers = {}
            # extracted_data['Room-Layers'][stage_name] = room_layers
        with open(os.path.join('build', 'sandbox', 'vanilla.json'), 'w') as extracted_data_core_json:
            json.dump(extracted_data, extracted_data_core_json, indent='    ', sort_keys=True)