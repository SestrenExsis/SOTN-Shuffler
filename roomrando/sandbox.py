
class Overlay:
    def __init__(self,
        id: int,
        data_offset: int,
        tile_offset: int,
    ):
        self.id = id
        self.data_offset = data_offset
        self.tile_offset = tile_offset

# base: 0x04B6AAFC, # Entrance
# base: 0x053F89D4, # Entrance
# 0x0180B7CB:
#   search for CBB78001 in BIN
#   found at 0x054B0EF4
# 0x0188C80C:
#   search for 0CC88801 in BIN
#   found at 0x054B0F04

# 800733DA : Player Position - X
# 8007308E : Screen Scroll - X

# Left
# Top
# Right
# Bottom
# LayerID
# TileDefID
# EntityGfxID    = Could this be what entity graphics are needed in a room?
# EntityLayoutID = Could this be how entities are layed out in a room?
np3_rooms = [
    [ 2, 38,  3, 40,  0,  0,  5,  1], # 0x00 - After Drawbridge
    [ 2, 41,  2, 42,  1,  0,  0,  2], # 0x01
    [ 4, 40, 10, 40,  2,  0,  7,  3], # 0x02 - Zombie Hallway
    [ 5, 38,  5, 38,  3,  0,  0,  4], # 0x03
    [ 6, 38,  6, 39,  4,  0,  0,  5], # 0x04 - Attic Staircase
    [ 7, 39, 10, 39,  5,  0,  8,  6], # 0x05
    [11, 39, 11, 39,  6,  0,  0,  7], # 0x06
    [11, 40, 13, 41,  7,  0,  3,  8], # 0x07 - Merman Room
    [10, 41, 10, 41,  8,  0,  0,  9], # 0x08
    [14, 40, 19, 40,  9,  0,  7, 10], # 0x09 - Warg Hallway
    [14, 41, 14, 41, 10,  0,  0, 11], # 0x0A
    [20, 39, 20, 40, 11,  0,  2, 12], # 0x0B - Meeting with Death
    [21, 38, 21, 40, 12,  0,  0, 13], # 0x0C
    [20, 38, 20, 38, 13,  0,  0, 14], # 0x0D
    [19, 39, 19, 39, 14,  0,  0, 15], # 0x0E
    [18, 36, 19, 38, 15,  0,  4, 16], # 0x0F - Cube of Zoe Room
    [17, 38, 17, 38, 16,  0,  0, 17], # 0x10
    [20, 37, 20, 37, 17,  0,  0, 18], # 0x11 - Life Max Up Room
    [20, 36, 20, 36, 18,  0,  0, 52], # 0x12
    [16, 38, 16, 38, 19,  0,  0, 50], # 0x13
    [17, 36, 17, 36, 20,  0,  0, 51], # 0x14
    [15, 41, 15, 41, 21,  0,  0, 49], # 0x15
    [ 3, 42,  3, 42, 22,  0,  0, 48], # 0x16
    [17, 37, 17, 37, 23,  0,  0, 46], # 0x17
    [ 5, 39,  5, 39, 24,  0,  0, 47], # 0x18
    [16, 36, 16, 36, 58, -1,  0,  0], # 0x19
    [21, 36, 21, 36, 56, -1,  0,  0], # 0x1A
    [15, 38, 15, 38, 59, -1,  0,  0], # 0x1B
    [16, 41, 16, 41, 57, -1,  0,  0], # 0x1C
]

overlays = {
    'Marble Gallery': Overlay(0x00, 0x048F9A38, 0x0488F688),
    'Outer Wall': Overlay(0x01, 0x049D18B8, 0x04967E38),
    'Long Library': Overlay(0x02, 0x047A1AE8, 0x0473C0B8),
    'Catacombs': Overlay(0x03, 0x0448F938, 0x04511EC8),
    'Olrox\'s Quarters': Overlay(0x04, 0x04AA0438, 0x04A369B8),
    'Abandoned Mine': Overlay(0x05, 0x045E8AE8, 0x0462BDD8),
    'Royal Chapel': Overlay(0x06, 0x04675F08, 0x046F1658),
    'Castle Entrance': Overlay(0x07, 0x053F4708, 0x0538BEE8),
    'Castle Center': Overlay(0x08, 0x0455BFF8, 0x0459E9B8),
    'Underground Caverns': Overlay(0x09, 0x04C307E8, 0x04BCC018),
    'Colosseum': Overlay(0x0A, 0x043C2018, 0x04445808),
    'Castle Keep': Overlay(0x0B, 0x0560E7B8, 0x055BF3D8),
    'Alchemy Laboratory': Overlay(0x0C, 0x054B0C88, 0x05454E88),
    'Clock Tower': Overlay(0x0D, 0x055724B8, 0x5508108),
    'Warp Rooms': Overlay(0x0E, 0x05883408, 0x5819058),
    'Nightmare': Overlay(0x12, 0x05AF2478, 0x5A889F8),
    'Cerberus': Overlay(0x16, 0x066B32F8, 0x66574F8),
    'Richter': Overlay(0x18, 0x063AA448, 0x6342E88),
    'Hippogryph': Overlay(0x19, 0x06304E48, 0x62A9048),
    'Doppleganger10': Overlay(0x1A, 0x06246D38, 0x61E1C38),
    'Scylla': Overlay(0x1B, 0x061A60B8, 0x613C638),
    'Werewolf & Minotaur': Overlay(0x1C, 0x060FCA68, 0x60A83D8),
    'Legion': Overlay(0x1D, 0x0606DAB8, 0x6004968),
    'Olrox': Overlay(0x1E, 0x05FA9DC8, 0x5F40C78),
    'Final Stage: Bloodlines': Overlay(0x1F, 0x0533EFC8, 0x52D70D8),
    'Black Marble Gallery': Overlay(0x20, 0x04F84A28, 0x4F1B8D8),
    'Reverse Outer Wall': Overlay(0x21, 0x0504F558, 0x4FE6D38),
    'Forbidden Library': Overlay(0x22, 0x04EE2218, 0x4E851B8),
    'Floating Catacombs': Overlay(0x23, 0x04CFA0B8, 0x4C9F518),
    'Death Wing''s Lair': Overlay(0x24, 0x050F7948, 0x5090CB8),
    'Cave': Overlay(0x25, 0x04DA4968, 0x4D48B68),
    'Anti-Chapel': Overlay(0xFF, 0x04E31458, 0x4DD68B8),
    'Reverse Entrance': Overlay(0xFF, 0x051AC758, 0x5150958),
    'Reverse Castle Center': Overlay(0xFF, 0x056BD9E8, 0x5654898),
    'Reverse Caverns': Overlay(0xFF, 0x0526A868, 0x5202978),
    'Reverse Colosseum': Overlay(0xFF, 0x057509E8, 0x56F2728),
    'Reverse Castle Keep': Overlay(0xFF, 0x057DF998, 0x57933A8),
    'Necromancy Laboratory': Overlay(0xFF, 0x05902278, 0x589B5E8),
    'Reverse Clock Tower': Overlay(0xFF, 0x059BB0D8, 0x5951F88),
    'Reverse Warp Rooms': Overlay(0xFF, 0x05A6E358, 0x5A05208),
    'Galamoth': Overlay(0x36, 0x06A5F2E8, 0x69FA1E8),
    'Akmodan II': Overlay(0xFF, 0x069D1598, 0x6968448),
    'Dracula': Overlay(0xFF, 0x0692B668, 0x68C2E48),
    'Doppleganger40': Overlay(0xFF, 0x06861468, 0x67FC368),
    'Creature': Overlay(0xFF, 0x067CFFF8, 0x6768108),
    'Medusa': Overlay(0xFF, 0x067422A8, 0x66DC878),
    'Death': Overlay(0xFF, 0x06620C28, 0x65B8408),
    'Beezlebub': Overlay(0xFF, 0x06590A18, 0x65281F8),
    'Trio': Overlay(0xFF, 0x064705F8, 0x6408708),
    'Castle Entrance First Visit': Overlay(0x41, 0x04B665E8, 0x4AFCB68),
}