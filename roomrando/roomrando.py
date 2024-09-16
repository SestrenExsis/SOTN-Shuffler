
class Address:
    '''
    # gamedata address:
    #   - The location of a specific piece of gamedata
    #   - Used as the canonical address
    # disc address:
    #   - The location of gamedata as it is found on the disc image
    #   - To get the location on disc, call get_disc_address passing the 
    #     canonical or gamedata address as a parameter
    '''
    SECTOR_HEADER_SIZE = 24
    SECTOR_DATA_SIZE = 2048
    SECTOR_ERROR_CORRECTION_DATA_SIZE = 280
    SECTOR_SIZE = SECTOR_HEADER_SIZE + SECTOR_DATA_SIZE + SECTOR_ERROR_CORRECTION_DATA_SIZE
    addresses = {}
    def __init__(self, address: int, address_type: str='GAMEDATA'):
        if address_type == 'DISC':
            self.address = self.get_gamedata_address(address)
        elif address_type == 'GAMEDATA':
            self.address = address
        else:
            raise ValueError('Unknown address type: ' + address_type)
    
    def to_disc_address(self, offset: int=0) -> int:
        result = self.get_disc_address(self.address + offset)
        return result

    @classmethod
    def get_disc_address(self, gamedata_address: int) -> int:
        sector, offset = divmod(gamedata_address, self.SECTOR_DATA_SIZE)
        result = sector * self.SECTOR_SIZE + self.SECTOR_HEADER_SIZE + offset
        return result

    @classmethod
    def get_gamedata_address(self, disc_address: int) -> int:
        HDR = self.SECTOR_HEADER_SIZE
        DAT = self.SECTOR_DATA_SIZE
        sector, offset = divmod(disc_address, self.SECTOR_SIZE)
        if offset < HDR:
            return None
        elif offset >= (HDR + DAT):
            return None
        result = sector * DAT + (offset - HDR) % DAT
        return result

class Room:
    def __init__(self, room_index: int, box: tuple[int], exits: list[tuple]):
        self.room_index = room_index
        self.top = box[0]
        self.left = box[1]
        self.height = box[2]
        self.width = box[3]
        self.exits = exits

class IndexedBitmapCanvas():
    def __init__(self, rows, cols):
        self.address = Address(0x001AF800, 'GAMEDATA')
        self.rows = rows
        self.cols = cols
        self.pixels = [
            [None for col in range(self.cols)] for row in range(self.rows)
        ]
        self.default = 1
    
    def get_pixel(self, top: int, left: int):
        result = self.pixels[top][left]
        return result
    
    def set_pixel(self, top: int, left: int, fill: int):
        self.pixels[top][left] = fill
    
    def fill_rect(self, top: int, left: int, height: int, width: int, fill: int):
        for row in range(height):
            for col in range(width):
                self.set_pixel(top + row, left + col, fill)
    
    def draw_room(self, room: Room):
        top = 4 * room.top
        left = 4 * room.left
        height = 4 * room.height + 1
        width = 4 * room.width + 1
        self.fill_rect(top, left, height, width, 0)
        self.fill_rect(top + 1, left + 1, height - 2, width - 2, 1)
        for (row, col, edge) in room.exits:
            y = top + 4 * row + 2
            x = left + 4 * col + 2
            if edge == 'Left':
                x -= 2
            elif edge == 'Right':
                x += 2
            elif edge == 'Top':
                y -= 2
            elif edge == 'Bottom':
                y += 2
            self.set_pixel(y, x, 1)

class PPF:
    def __init__(self, description):
        self.patches = []
        self.description = (description + 50 * ' ')[:50]
        self.bytes = bytearray()
        self.write_string('PPF30')
        self.write_byte(2) # Encoding method = PPF3.0
        self.write_string(self.description)
        self.write_byte(0) # Imagetype = BIN
        self.write_byte(0) # Blockcheck = Disabled
        self.write_byte(0) # Undo data = Not available
        self.write_byte(0) # Dummy
        assert len(self.bytes) == 60 # 0x3C
    
    def write_byte(self, byte):
        assert 0x00 <= byte < 0x100
        self.bytes.append(byte)
    
    def write_string(self, string):
        for char in string:
            self.write_byte(ord(char))
    
    def write_u16(self, value):
        for i in range(4):
            value, byte = divmod(value, 0x100)
            self.write_byte(byte)
    
    def write_u32(self, value):
        for i in range(8):
            value, byte = divmod(value, 0x100)
            self.write_byte(byte)
    
    def patch_string(self, offset_in_file: int, value: str):
        self.write_u32(offset_in_file)
        size = len(value)
        self.write_byte(size)
        self.write_string(value)
    
    def patch_bitmap(self, canvas: IndexedBitmapCanvas, address: Address):
        for row in range(0, canvas.rows):
            # Each byte contains a pair of pixels, side-by-side horizontally
            for col in range(0, canvas.cols, 2):
                left = canvas.get_pixel(row, col)
                right = canvas.get_pixel(row, col + 1)
                # No overwrites on either pair of pixels, so skip them
                if left is None and right is None:
                    continue
                disc_address = address.to_disc_address(
                    row * (canvas.cols // 2) + col // 2
                )
                self.write_u32(disc_address)
                self.write_byte(1)
                # If either side of the pair is unspecified, supply the default
                left = 0xF & (left if left is not None else canvas.default)
                right = 0xF & (right if right is not None else canvas.default)
                self.write_byte((right << 4) | left)
    
    def patch_room_data(self, room: Room, address: Address):
        self.write_u32(address.to_disc_address(8 * room.room_index))
        size = 4
        self.write_byte(size)
        self.write_byte(room.left)
        self.write_byte(room.top)
        self.write_byte(room.left + room.width - 1)
        self.write_byte(room.top + room.height - 1)
    
    def patch_packed_room_data(self, room: Room, address: Address):
        self.write_u32(address.to_disc_address())
        size = 4
        self.write_byte(size)
        data = [
            0x01, # UNKNOWN
            0x3F & (room.top + room.height - 1), # bottom
            0x3F & (room.left + room.width - 1), # right
            0x3F & (room.top),
            0x3F & (room.left),
        ]
        self.write_u16(
            (data[0] << 24) |
            (data[1] << 18) |
            (data[2] << 12) |
            (data[3] << 6) |
            (data[4] << 0)
        )