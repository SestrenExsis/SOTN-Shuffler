
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
        self.bytes.append(byte)
    
    def write_string(self, string):
        for char in string:
            self.write_byte(ord(char))
    
    def write_u32(self, value):
        for i in range(8):
            value, byte = divmod(value, 0x100)
            self.write_byte(byte)
    
    def patch_u32(self, offset_in_file, value: int):
        self.write_u32(offset_in_file)
        size = 4
        self.write_byte(4)
        for i in range(size):
            value, byte = divmod(value, 0x100)
            self.write_byte(byte)
    
    def patch_string(self, offset_in_file, value: str):
        self.write_u32(offset_in_file)
        size = len(value)
        self.write_byte(size)
        self.write_string(value)

def get_clock_hands_ppf():
    result = PPF('Hands of the clock show minutes and seconds')
    # Hour hand now shows in-game minutes
    # Minute hand now shows in-game seconds
    # 0x801CCC2C in RAM --> 0x04FCF12C on Disc
    # Either it is 0x04FCF144 or it's 0x04951C2C
    # result.patch_string(0x04389C76, '!CLOCK!')
    for base in (
        0x04951C14, # Marble Gallery
        0x04FCF12C, # Black Marble Gallery
    ):
        result.patch_u32(base + 0x00, 0x8CA302D4), # lw v1,$2D4(a1)
        result.patch_u32(base + 0x18, 0x8CA302D4), # lw v1,$2D4(a1)
        result.patch_u32(base + 0x20, 0x00000000), # nop
        result.patch_u32(base + 0x24, 0x00000000), # nop
        result.patch_u32(base + 0x28, 0x00051900), # sll v1,a1,$4
        result.patch_u32(base + 0x2C, 0x00651823), # subu v1,a1
        result.patch_u32(base + 0x34, 0x00000000), # nop
        result.patch_u32(base + 0x38, 0x00000000), # nop
        result.patch_u32(base + 0x3C, 0x00000000), # nop
    return result

if __name__ == '__main__':
    '''
    Usage
    python ClockHands.py
    '''
    ppf = get_clock_hands_ppf()
    with open('build/MinuteHandSecondHand.ppf', 'wb') as file:
        file.write(ppf.bytes)