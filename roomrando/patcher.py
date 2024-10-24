import json
import os
import roomrando
import yaml

'''
TODO(sestren): Clear old map tiles when rooms change locations
TODO(sestren): Update teleport locations to match where rooms are
    Keep teleport indices and data the same, except for Current Stage ID
    Change 
'''

def _hex(val: int, size: int):
    result = ('{:0' + str(size) + 'X}').format(val)
    return result

def get_room_rando_ppf(logic, changes):
    addresses = {
        ('Castle Map'): roomrando.Address(0x001AF800),
        ('Teleporter Data'): roomrando.Address(0x00097C5C),
        ('Room Data', 'Alchemy Laboratory'): roomrando.Address(0x049C0F2C),
        ('Room Data', 'Castle Entrance'): roomrando.Address(0x041AB4C4),
        ('Packed Room Data', 'Castle Entrance, After Drawbridge'): roomrando.Address(0x041A79CC + 0x010),       # 8239A001
        ('Packed Room Data', 'Castle Entrance, Drop Under Portcullis'): roomrando.Address(0x041A79CC + 0x030),  # 422AA801
        ('Packed Room Data', 'Castle Entrance, Zombie Hallway'): roomrando.Address(0x041A79CC + 0x050),         # 422AA801
        ('Packed Room Data', 'Castle Entrance, Holy Mail Room'): roomrando.Address(0x041A79CC + 0x070),
        ('Packed Room Data', 'Castle Entrance, Attic Staircase'): roomrando.Address(0x041A79CC + 0x090),
        ('Packed Room Data', 'Castle Entrance, Attic Hallway'): roomrando.Address(0x041A79CC + 0x0B0),
        ('Packed Room Data', 'Castle Entrance, Attic Entrance'): roomrando.Address(0x041A79CC + 0x0D0),
        ('Packed Room Data', 'Castle Entrance, Merman Room'): roomrando.Address(0x041A79CC + 0x0F0),
        ('Packed Room Data', 'Castle Entrance, Jewel Sword Room'): roomrando.Address(0x041A79CC + 0x110),
        ('Packed Room Data', 'Castle Entrance, Warg Hallway'): roomrando.Address(0x041A79CC + 0x130),
        ('Packed Room Data', 'Castle Entrance, Shortcut to Underground Caverns'): roomrando.Address(0x041A79CC + 0x150),
        ('Packed Room Data', 'Castle Entrance, Meeting Room With Death'): roomrando.Address(0x041A79CC + 0x170),
        ('Packed Room Data', 'Castle Entrance, Stairwell After Death'): roomrando.Address(0x041A79CC + 0x190),
        ('Packed Room Data', 'Castle Entrance, Gargoyle Room'): roomrando.Address(0x041A79CC + 0x1B0),
        ('Packed Room Data', 'Castle Entrance, Heart Max-Up Room'): roomrando.Address(0x041A79CC + 0x1D0),
        ('Packed Room Data', 'Castle Entrance, Cube of Zoe Room'): roomrando.Address(0x041A79CC + 0x1F0),
        ('Packed Room Data', 'Castle Entrance, Shortcut to Warp'): roomrando.Address(0x041A79CC + 0x210),
        ('Packed Room Data', 'Castle Entrance, Life Max-Up Room'): roomrando.Address(0x041A79CC + 0x230),
        ('Packed Room Data', 'Castle Entrance, Forest Cutscene'): roomrando.Address(0x041A79CC + 0x250),
        ('Packed Room Data', 'Castle Entrance, Unknown 19'): roomrando.Address(0x041A79CC + 0x270),
        ('Packed Room Data', 'Castle Entrance, Unknown 20'): roomrando.Address(0x041A79CC + 0x280),
        ('Packed Room Data', 'Castle Entrance, Loading Room A'): roomrando.Address(0x041A79CC + 0x290),
        ('Packed Room Data', 'Castle Entrance, Loading Room B'): roomrando.Address(0x041A79CC + 0x2A0),
        ('Packed Room Data', 'Castle Entrance, Loading Room C'): roomrando.Address(0x041A79CC + 0x2B0),
        ('Packed Room Data', 'Castle Entrance, Loading Room D'): roomrando.Address(0x041A79CC + 0x2C0), # 41A7C7C
        ('Packed Room Data', 'Castle Entrance, Save Room A'): roomrando.Address(0x041A79CC + 0x2D0),
        ('Packed Room Data', 'Castle Entrance, Save Room B'): roomrando.Address(0x041A79CC + 0x2E0),
        ('Packed Room Data', 'Castle Entrance, Save Room C'): roomrando.Address(0x041A79CC + 0x2F0),
        ('Packed Room Data', 'Alchemy Laboratory, Bat Card Room'): roomrando.Address(0x049BE97C),               # + 0x000
        ('Packed Room Data', 'Alchemy Laboratory, Exit to Royal Chapel'): roomrando.Address(0x049BE98C),        # + 0x010
        ('Packed Room Data', 'Alchemy Laboratory, Blue Door Hallway'): roomrando.Address(0x049BE99C),           # + 0x020
        ('Packed Room Data', 'Alchemy Laboratory, Bloody Zombie Hallway'): roomrando.Address(0x049BE9AC),       # + 0x030
        ('Packed Room Data', 'Alchemy Laboratory, Cannon Room'): roomrando.Address(0x049BE9BC),                 # + 0x040
        ('Packed Room Data', 'Alchemy Laboratory, Cloth Cape Room'): roomrando.Address(0x049BE9CC),             # + 0x050
        ('Packed Room Data', 'Alchemy Laboratory, Sunglasses Room'): roomrando.Address(0x049BE9DC),             # + 0x060
        ('Packed Room Data', 'Alchemy Laboratory, Glass Vats'): roomrando.Address(0x049BE9EC),                  # + 0x070
        ('Packed Room Data', 'Alchemy Laboratory, Skill of Wolf Room'): roomrando.Address(0x049BE9FC),          # + 0x080
        ('Packed Room Data', 'Alchemy Laboratory, Heart Max-Up Room'): roomrando.Address(0x049BEA1C),           # + 0x0A0
        ('Packed Room Data', 'Alchemy Laboratory, Entryway'): roomrando.Address(0x049BEA2C),                    # + 0x0B0
        ('Packed Room Data', 'Alchemy Laboratory, Tall Spittlebone Room'): roomrando.Address(0x049BEA4C),       # + 0x0D0
        ('Packed Room Data', 'Alchemy Laboratory, Empty Zig Zag Room'): roomrando.Address(0x049BEA5C),          # + 0x0E0
        ('Packed Room Data', 'Alchemy Laboratory, Short Zig Zag Room'): roomrando.Address(0x049BEA6C),          # + 0x0F0
        ('Packed Room Data', 'Alchemy Laboratory, Tall Zig Zag Room'): roomrando.Address(0x049BEA7C),           # + 0x100
        ('Packed Room Data', 'Alchemy Laboratory, Secret Life Max-Up Room'): roomrando.Address(0x049BEA8C),     # + 0x110
        ('Packed Room Data', 'Alchemy Laboratory, Slogra and Gaibon Boss Room'): roomrando.Address(0x049BEA9C), # + 0x120
        ('Packed Room Data', 'Alchemy Laboratory, Box Puzzle Room'): roomrando.Address(0x049BEAAC),             # + 0x130
        ('Packed Room Data', 'Alchemy Laboratory, Red Skeleton Lift Room'): roomrando.Address(0x049BEACC),      # + 0x150
        ('Packed Room Data', 'Alchemy Laboratory, Tetromino Room'): roomrando.Address(0x049BEAEC),              # + 0x170
        ('Packed Room Data', 'Alchemy Laboratory, Exit to Marble Gallery'): roomrando.Address(0x049BEAFC),      # + 0x180
        ('Packed Room Data', 'Alchemy Laboratory, Corridor to Elevator'): roomrando.Address(0x049BEB0C),        # + 0x190
        ('Packed Room Data', 'Alchemy Laboratory, Elevator Shaft'): roomrando.Address(0x049BEB1C),              # + 0x1A0
        ('Packed Room Data', 'Alchemy Laboratory, Save Room A'): roomrando.Address(0x049BEB3C),                 # + 0x1C0
        ('Packed Room Data', 'Alchemy Laboratory, Save Room B'): roomrando.Address(0x049BEB4C),                 # + 0x1D0
        ('Packed Room Data', 'Alchemy Laboratory, Save Room C'): roomrando.Address(0x049BEB5C),                 # + 0x1E0
        ('Packed Room Data', 'Alchemy Laboratory, Loading Room A'): roomrando.Address(0x049BEB6C),              # + 0x1F0
        ('Packed Room Data', 'Alchemy Laboratory, Loading Room B'): roomrando.Address(0x049BEB7C),              # + 0x200
        ('Packed Room Data', 'Alchemy Laboratory, Loading Room C'): roomrando.Address(0x049BEB8C),              # + 0x210
    }
    result = roomrando.PPF('Shuffled rooms in Castle Entrance and Alchemy Lab')
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
        )
        result.patch_room_data(
            room,
            addresses[('Room Data', logic['Rooms'][room_name]['Stage'])]
        )
        if len(room.flags) > 0:
            result.patch_packed_room_data(
                room,
                addresses[('Packed Room Data', room_name)]
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
    with (
        open(os.path.join('build', 'sandbox', 'data-core.json')) as data_core_json,
        open(os.path.join('build', 'sandbox', 'changes.json')) as changes_json,
    ):
        changes = json.load(changes_json)
        data_core = json.load(data_core_json)
        patch = get_room_rando_ppf(data_core, changes)
        with open(os.path.join('build', 'RoomRando.ppf'), 'wb') as file:
            file.write(patch.bytes)