# External libraries
import argparse
import json
import os
import random
import yaml

def getID(aliases: dict, path: tuple):
    result = path[-1]
    scope = aliases
    for token in path:
        if token not in scope:
            break
        scope = scope[token]
    else:
        result = scope
    if type(result) == str:
        result = int(result)
    return result

# UNIDENTIFIED: Unidentified
# FATAL: Crashes the game
# ERROR: Highly likely to cause softlocks or severe glitches
# WARNING: Might cause softlocks or unintended glitches, depending on other factors
# UNCERTAIN: Unsure of outcome
# WEIRD: Safe, but will probably look strange or glitchy
# SAFE: Safe
entity_error_levels = {
    'GLOBAL': {
        5: 'ERROR', # Red Door
        8: 'ERROR', # Room Foreground Entity
        9: 'WARNING', # Stage Name Popup
        11: 'SAFE', # Relic Orb
        12: 'SAFE', # Unique Item Drop
        40961: 'SAFE', # Candle
    },
    'Abandoned Mine': {
        22: 'WEIRD', # Wall for Demon Switch
        23: 'WARNING', # Demon Switch
        24: 'UNCERTAIN', # Breakable Wall in Abandoned Mine
        28: 'SAFE', # Crumbling Stairwell
        29: 'SAFE', # Tiny Crumbling Ledge
        30: 'SAFE', # Gremlin
        33: 'SAFE', # Salem Witch
        38: 'SAFE', # Thornweed
        41: 'SAFE', # Venus Weed
    },
    'Alchemy Laboratory': {
        22: 'UNIDENTIFIED',
        25: 'UNCERTAIN', # Pressure Plate in Box Puzzle Room
        26: 'WEIRD', # Retractable Spikes
        27: 'WEIRD', # Movable Crate
        28: 'WARNING', # Cannon?
        29: 'WARNING', # Cannon Lever?
        31: 'WARNING', # Cannon Wall?
        32: 'UNIDENTIFIED',
        33: 'WARNING', # Elevator Lift
        35: 'SAFE', # Bust with Red Eyes
        36: 'WARNING', # Retractable Spikes?
        37: 'WARNING', # Pressure Plate for Spikes?
        38: 'SAFE', # Red Skeleton 1
        39: 'SAFE', # Red Skeleton 2
        41: 'SAFE', # Green Axe Knight
        43: 'SAFE', # Bloody Zombie
        46: 'UNIDENTIFIED',
        49: 'SAFE', # Spittlebone
        52: 'UNIDENTIFIED',
        53: 'UNIDENTIFIED',
        54: 'UNIDENTIFIED',
        55: 'SAFE', # Breakable Orb with Unique Item Drop
        57: 'UNIDENTIFIED',
        62: 'UNIDENTIFIED',
        71: 'UNIDENTIFIED',
        72: 'UNIDENTIFIED',
        74: 'ERROR', # Blue Door
        75: 'UNIDENTIFIED',
    },
    'Anti-Chapel': {
        22: 'ERROR', # Invisible Room Transition Entity?
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED', # Background Geometry, Nave 1?
        27: 'UNIDENTIFIED', # Background Geometry, Nave 2?
        30: 'SAFE', # Archer?
        34: 'SAFE', # Spectral Sword?
        38: 'SAFE', # Sniper of Goth?
        40: 'SAFE', # Imp?
        42: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        44: 'UNIDENTIFIED',
        45: 'UNIDENTIFIED',
        50: 'UNIDENTIFIED',
        51: 'UNIDENTIFIED',
    },
    'Black Marble Gallery': {
        17: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        33: 'SAFE', # Guardian
        38: 'SAFE', # Spike Contraption?
        39: 'SAFE', # Thornweed
        42: 'SAFE', # Stone Skull
        43: 'SAFE', # Jack O'Bones
        46: 'SAFE', # Nova Skeleton
        53: 'SAFE', # Gurkha
        55: 'SAFE', # Blade
        57: 'UNIDENTIFIED',
        62: 'SAFE', # Gorgon
        71: 'UNIDENTIFIED',
        72: 'UNIDENTIFIED',
        74: 'UNIDENTIFIED',
        75: 'UNIDENTIFIED',
        76: 'UNIDENTIFIED',
        79: 'ERROR', # Blue Door
        40977: 'UNIDENTIFIED',
        41033: 'UNIDENTIFIED',
    },
    'Castle Center': {
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
    },
    'Castle Entrance': {
        8: 'UNIDENTIFIED',
        11: 'UNIDENTIFIED',
        12: 'UNIDENTIFIED',
        17: 'UNIDENTIFIED',
        23: 'ERROR', # Background Effect, Lightning
        24: 'WEIRD', # Water
        25: 'UNIDENTIFIED',
        26: 'ERROR',
        27: 'ERROR',
        28: 'UNIDENTIFIED',
        29: 'ERROR', # Lever Platform
        31: 'WEIRD', # Wooden Wall 1
        32: 'FATAL',
        33: 'FATAL',
        34: 'FATAL',
        35: 'WEIRD', # Trapdoor
        36: 'WEIRD', # Left Breakable Rock
        37: 'WEIRD', # Right Breakable Rock
        38: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        43: 'WEIRD', # Pressure Plate
        44: 'WEIRD', # Wooden Wall 2
        52: 'UNIDENTIFIED', # Related to water?
        58: 'UNIDENTIFIED',
        65: 'WEIRD', # Merman
        69: 'UNIDENTIFIED',
        70: 'SAFE', # Bone Scimitar with Unique Drop
        72: 'SAFE', # Bat
        74: 'SAFE', # Warg
        77: 'WEIRD', # Floor Zombie Spawner
        78: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        79: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        80: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        81: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        82: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        83: 'UNIDENTIFIED',
        84: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        85: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        86: 'UNIDENTIFIED', # UNIDENTIFIED in Forest Cutscene
        87: 'UNIDENTIFIED',
        92: 'WEIRD', # Breakable Corner Block
        95: 'UNIDENTIFIED',
    },
    'Castle Entrance Revisited': {
        17: 'UNIDENTIFIED',
        23: 'ERROR', # Background Effect, Lightning
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'FATAL',
        33: 'FATAL',
        34: 'FATAL',
        35: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        44: 'UNIDENTIFIED',
        50: 'UNIDENTIFIED',
        57: 'UNIDENTIFIED',
        61: 'UNIDENTIFIED',
        64: 'UNIDENTIFIED',
        67: 'UNIDENTIFIED',
        69: 'SAFE', # Owl (and Owl Knight?)
        72: 'SAFE', # Bloody Zombie
        75: 'SAFE', # Zombie
        78: 'SAFE', # Slogra
        81: 'SAFE', # Gaibon
        88: 'SAFE', # Gurkha
        90: 'SAFE', # Blade
    },
    'Castle Keep': {
        18: 'UNIDENTIFIED',
        22: 'ERROR',
        23: 'ERROR',
        24: 'ERROR',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        31: 'ERROR',
        32: 'UNIDENTIFIED',
        33: 'SAFE', # Flea Rider
        34: 'ERROR',
        35: 'ERROR',
        40: 'SAFE', # Axe Knight
    },
    'Catacombs': {
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'WEIRD', # Dark Room Platform
        28: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        44: 'UNIDENTIFIED',
        46: 'SAFE', # Discus Lord
        50: 'SAFE', # Hellfire Beast
        55: 'SAFE', # Bone Ark?
        62: 'SAFE', # Lossoth
        67: 'UNIDENTIFIED',
        68: 'SAFE', # Grave Keeper
        71: 'SAFE', # Gremlin
        74: 'SAFE', # Large Slime?
        76: 'SAFE', # Slime
        78: 'SAFE', # Wereskeleton
        81: 'UNIDENTIFIED',
    },
    'Cave': {
        22: 'SAFE', # Slogra
        25: 'SAFE', # Gaibon
        30: 'WEIRD', # Demon Switch Wall
        31: 'WARNING', # Demon Switch
        32: 'WEIRD', # Breakable Wall
        34: 'SAFE', # Thornweed
        37: 'SAFE', # Bat?
    },
    'Clock Tower': {
        17: 'UNIDENTIFIED',
        18: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        31: 'WEIRD', # Pendulum?
        34: 'WEIRD', # Breakable Wall
        36: 'UNCERTAIN', # Invisible Room Transition Entity
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        46: 'UNIDENTIFIED',
        50: 'SAFE', # Skull Lord
        54: 'SAFE', # Harpy
        59: 'SAFE', # Cloaked Knight
        63: 'SAFE', # Sword Lord
        68: 'SAFE', # Phantom Skull
        70: 'SAFE', # Flail Guard
        72: 'UNIDENTIFIED',
        73: 'SAFE', # Flea Armor
        77: 'UNIDENTIFIED', # UNIDENTIFIED in Karasuman's Room
        86: 'UNIDENTIFIED',
    },
    'Colosseum': {
        17: 'UNIDENTIFIED',
        22: 'WEIRD', # Background Detail 1?
        23: 'WEIRD', # Background Detail 2?
        24: 'WEIRD', # Stone Barrier
        25: 'WEIRD', # Pressure Plate
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        28: 'WEIRD', # Elevator Hatch
        29: 'UNIDENTIFIED',
        30: 'WEIRD', # Breakable Ceiling
        31: 'UNIDENTIFIED',
        34: 'SAFE', # Blade Master
        38: 'SAFE', # Blade Soldier
        41: 'SAFE', # Bone Musket
        44: 'SAFE', # Owl Knight
        47: 'SAFE', # Valhalla Knight
        50: 'SAFE', # Axe Knight
        54: 'SAFE', # Armor Lord
        58: 'SAFE', # Hunting Girl
        60: 'SAFE', # Paranthropus
        67: 'SAFE', # Bone Scimitar
        69: 'SAFE', # Plate Lord
        75: 'SAFE', # Grave Keeper
        77: 'WEIRD', # Mist Gate
    },
    "Death Wing's Lair": {
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        34: 'WEIRD', # Breakable Wall
        35: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        38: 'ERROR', # Boss Door
        39: 'UNIDENTIFIED',
        43: 'SAFE', # Malachi
        47: 'SAFE', # Karasuman
        53: 'UNIDENTIFIED',
        57: 'SAFE', # Azaghal
        60: 'SAFE', # Ghost Dancer
        61: 'UNIDENTIFIED',
    },
    'Floating Catacombs': {
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        34: 'SAFE', # Frozen Half
        40: 'SAFE', # Salome
        45: 'WEIRD', # Breakable Wall
        46: 'UNIDENTIFIED',
        50: 'SAFE', # Skeleton
        53: 'SAFE', # Blood Skeleton
        54: 'SAFE', # Bat
    },
    'Forbidden Library': {
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        28: 'SAFE', # Lion
        31: 'SAFE', # Tin Man
        36: 'SAFE', # Scarecrow
        39: 'SAFE', # Schmoo
        41: 'UNIDENTIFIED',
    },
    'Long Library': {
        17: 'UNIDENTIFIED',
        18: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED', # UNIDENTIFIED in Spellbook Area
        23: 'UNIDENTIFIED', # UNIDENTIFIED in Spellbook Area
        24: 'UNIDENTIFIED', # UNIDENTIFIED in Spellbook Area
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED', # UNIDENTIFIED in Bookcase Room
        36: 'UNIDENTIFIED', # UNIDENTIFIED in Shop
        43: 'UNIDENTIFIED', # UNIDENTIFIED in Shop
        44: 'UNIDENTIFIED', # UNIDENTIFIED in Shop
        48: 'SAFE', # Spellbook
        50: 'SAFE', # Magic Tome
        51: 'SAFE', # Dhuron
        55: 'SAFE', # Ectoplasm
        58: 'SAFE', # Thornweed
        61: 'WEIRD', # Candle Table
        64: 'UNIDENTIFIED', # UNIDENTIFIED in Lesser Demon Area
        65: 'UNIDENTIFIED', # UNIDENTIFIED in Lesser Demon Area
        70: 'UNIDENTIFIED', # UNIDENTIFIED in Bookcase Room
        73: 'UNIDENTIFIED', # UNIDENTIFIED in Lesser Demon Area
        74: 'SAFE', # Flea Armor
        76: 'SAFE', # Flea Man
    },
    'Marble Gallery': {
        17: 'UNIDENTIFIED',
        18: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        33: 'SAFE', # Diplocephalus
        40: 'UNIDENTIFIED',
        41: 'UNIDENTIFIED',
        44: 'WEIRD', # Pressure Plate
        45: 'UNIDENTIFIED',
        46: 'SAFE', # Skelerang
        49: 'SAFE', # Plate Lord
        56: 'UNIDENTIFIED',
        57: 'SAFE', # Marionette
        58: 'SAFE', # Slinger
        61: 'SAFE', # Stone Rose
        66: 'UNIDENTIFIED',
        67: 'SAFE', # Ctulhu
        71: 'SAFE', # Axe Knight
        74: 'SAFE', # Ouija Table
        76: 'SAFE', # Flea Man
        77: 'SAFE', # Skeleton
        81: 'ERROR', # Blue Door
        40977: 'UNIDENTIFIED',
        41003: 'UNIDENTIFIED',
    },
    'Necromancy Laboratory': {
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        35: 'SAFE', # Lesser Demon
        39: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        41: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        44: 'UNIDENTIFIED',
        48: 'UNIDENTIFIED',
        49: 'UNIDENTIFIED',
        50: 'UNIDENTIFIED',
        52: 'UNIDENTIFIED',
        55: 'UNIDENTIFIED',
    },
    "Olrox's Quarters": {
        22: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        45: 'UNIDENTIFIED',
        51: 'UNIDENTIFIED',
        52: 'UNIDENTIFIED',
        55: 'UNIDENTIFIED',
        60: 'UNIDENTIFIED',
        62: 'UNIDENTIFIED',
    },
    'Outer Wall': {
        17: 'ERROR', # Elevator Switch Parts 1?
        23: 'UNIDENTIFIED', # Rain Effects 1?
        24: 'UNIDENTIFIED', # Rain Effects 2?
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        29: 'WEIRD', # Bird's Nest?
        30: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'SAFE', # Blue Axe Knight?
        36: 'UNIDENTIFIED',
        40: 'WEIRD', # Telescope?
        41: 'WARNING', # Elevator Cage?
        43: 'WARNING', # Elevator Shaft Parts?
        46: 'UNIDENTIFIED',
        50: 'WARNING', # Elevator Switch Parts 2?
        51: 'WARNING', # Elevator Switch
        53: 'UNIDENTIFIED',
        55: 'UNIDENTIFIED',
        59: 'UNIDENTIFIED',
        61: 'UNIDENTIFIED',
        62: 'SAFE', # Skeleton
        68: 'SAFE', # Bone Archer
        70: 'SAFE', # Bone Musket
        72: 'SAFE', # Sword Lord
        74: 'SAFE', # Armor Lord
        79: 'SAFE', # Spear Guard
        83: 'SAFE', # Skeleton Ape
        87: 'UNIDENTIFIED',
        89: 'UNCERTAIN', # Medusa Head Spawner
        93: 'UNCERTAIN', # Mist Door
    },
    'Reverse Castle Center': {
        22: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
    },
    'Reverse Caverns': {
        10: 'UNIDENTIFIED',
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        35: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        41: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        52: 'UNIDENTIFIED',
        55: 'UNIDENTIFIED',
        57: 'UNIDENTIFIED',
        58: 'UNIDENTIFIED',
        61: 'UNIDENTIFIED',
        64: 'UNIDENTIFIED',
        67: 'UNIDENTIFIED',
        72: 'UNIDENTIFIED',
        79: 'UNIDENTIFIED',
        80: 'UNIDENTIFIED',
        81: 'UNIDENTIFIED',
        83: 'UNIDENTIFIED',
        86: 'UNIDENTIFIED',
        90: 'UNIDENTIFIED',
        92: 'UNIDENTIFIED',
        94: 'UNIDENTIFIED',
    },
    'Reverse Clock Tower': {
        17: 'UNIDENTIFIED',
        18: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        35: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
        51: 'UNIDENTIFIED',
        54: 'UNIDENTIFIED',
        58: 'UNIDENTIFIED',
        62: 'UNIDENTIFIED',
        65: 'UNIDENTIFIED',
        74: 'UNIDENTIFIED',
    },
    'Reverse Colosseum': {
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
    },
    'Reverse Entrance': {
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        48: 'UNIDENTIFIED',
        52: 'UNIDENTIFIED',
        59: 'UNIDENTIFIED',
        62: 'UNIDENTIFIED',
        65: 'UNIDENTIFIED',
        66: 'UNIDENTIFIED',
        67: 'UNIDENTIFIED',
        69: 'UNIDENTIFIED',
        71: 'UNIDENTIFIED',
        72: 'UNIDENTIFIED',
        78: 'UNIDENTIFIED',
    },
    'Reverse Keep': {
        18: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        26: 'UNIDENTIFIED',
        27: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
    },
    'Reverse Outer Wall': {
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
        44: 'UNIDENTIFIED',
        45: 'UNIDENTIFIED',
        47: 'UNIDENTIFIED',
    },
    'Reverse Warp Rooms': {
        22: 'UNIDENTIFIED',
    },
    'Royal Chapel': {
        22: 'UNCERTAIN', # Invisible Room Transition Entity
        23: 'UNIDENTIFIED',
        24: 'UNIDENTIFIED',
        25: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED', # Confessional Booth?
        38: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        41: 'UNIDENTIFIED',
        45: 'UNIDENTIFIED',
        46: 'UNIDENTIFIED',
        50: 'UNIDENTIFIED',
        55: 'UNIDENTIFIED',
        56: 'UNIDENTIFIED',
        57: 'UNIDENTIFIED',
        58: 'UNIDENTIFIED',
        61: 'UNIDENTIFIED',
        63: 'UNIDENTIFIED',
        66: 'UNIDENTIFIED',
        67: 'UNIDENTIFIED',
        69: 'UNIDENTIFIED',
        72: 'UNIDENTIFIED',
    },
    'Underground Caverns': {
        17: 'UNIDENTIFIED',
        22: 'UNIDENTIFIED',
        28: 'UNIDENTIFIED',
        29: 'UNIDENTIFIED',
        30: 'UNIDENTIFIED',
        31: 'UNIDENTIFIED',
        32: 'UNIDENTIFIED',
        33: 'UNIDENTIFIED',
        34: 'UNIDENTIFIED',
        35: 'UNIDENTIFIED',
        36: 'UNIDENTIFIED',
        37: 'UNIDENTIFIED',
        38: 'UNIDENTIFIED',
        39: 'UNIDENTIFIED',
        40: 'UNIDENTIFIED',
        41: 'UNIDENTIFIED',
        42: 'UNIDENTIFIED',
        43: 'UNIDENTIFIED',
        44: 'UNIDENTIFIED',
        45: 'UNIDENTIFIED',
        47: 'UNIDENTIFIED',
        48: 'UNIDENTIFIED',
        54: 'UNIDENTIFIED',
        55: 'UNIDENTIFIED',
        56: 'UNIDENTIFIED',
        57: 'UNIDENTIFIED',
        58: 'UNIDENTIFIED',
        60: 'UNIDENTIFIED',
        61: 'UNIDENTIFIED',
        63: 'UNIDENTIFIED',
        68: 'UNIDENTIFIED',
        69: 'UNIDENTIFIED',
        73: 'UNIDENTIFIED',
        74: 'UNIDENTIFIED',
        76: 'UNIDENTIFIED',
        78: 'UNIDENTIFIED',
        80: 'UNIDENTIFIED',
        81: 'UNIDENTIFIED',
        83: 'UNIDENTIFIED',
        85: 'UNIDENTIFIED',
        91: 'UNIDENTIFIED',
        93: 'UNIDENTIFIED',
        94: 'UNIDENTIFIED',
        95: 'UNIDENTIFIED',
        96: 'UNIDENTIFIED',
    },
    'Warp Rooms': {
        22: 'UNIDENTIFIED',
    },
}

entities = set()

def shuffle_entities(object_layout, seed: int, stage_name: str=None) -> dict:
    if len(object_layout) < 1:
        return None
    rng = random.Random(seed)
    # Split each entity into two parts:
    A = []
    B = []
    unique_entity_types = {}
    for entity in object_layout:
        if (stage_name, entity['Entity Type ID']) not in unique_entity_types:
            unique_entity_types[(stage_name, entity['Entity Type ID'])] = 0
        unique_entity_types[(stage_name, entity['Entity Type ID'])] += 1
        entities.add((stage_name, entity['Entity Type ID']))
        A.append({
            'Entity Room Index': entity['Entity Room Index'],
            'Entity Type ID': entity['Entity Type ID'],
            'Params': entity['Params'],
        })
        status = 'UNIDENTIFIED'
        if entity['Entity Type ID'] in entity_error_levels['GLOBAL']:
            status = entity_error_levels['GLOBAL'][entity['Entity Type ID']]
        elif entity['Entity Type ID'] in entity_error_levels[stage_name]:
            status = entity_error_levels[stage_name][entity['Entity Type ID']]
        shuffle_percents = {
            'SAFE':    1.00,
            'WEIRD':   0.50,
            'UNIDENTIFIED': 0.25,
            'UNCERTAIN': 0.25,
            'WARNING': 0.10,
            'ERROR':   0.02,
            'FATAL':   0.00,
        }
        shuffle_ind = rng.random() < shuffle_percents[status]
        if shuffle_ind:
            B.append({
                'X': entity['X'],
                'Y': entity['Y'],
            })
        else:
            A[-1]['X'] = entity['X']
            A[-1]['Y'] = entity['Y']
    # Create a new entity list by shuffling part As and Bs around
    rng.shuffle(B)
    for entity in A:
        if 'X' not in entity or 'Y' not in entity:
            b = B.pop()
            entity['X'] = b['X']
            entity['Y'] = b['Y']
    assert len(B) == 0
    # Sort the new entity list by X and assign part A to the original order of the horizontal list
    # Sort the new entity list by Y and assign part A to the original order of the vertical list
    result = {
        'Object Layout - Horizontal': {},
        'Object Layout - Vertical': {},
    }
    horizontal_object_layout = list(sorted(A, key=lambda x: (x['X'], x['Y'], x['Entity Room Index'], x['Entity Type ID'], x['Params'])))
    vertical_object_layout = list(sorted(A, key=lambda x: (x['Y'], x['X'], x['Entity Room Index'], x['Entity Type ID'], x['Params'])))
    assert len(horizontal_object_layout) == len(vertical_object_layout)
    for i in range(len(horizontal_object_layout)):
        # NOTE(sestren): The key for the changes file is going to need +1 added to it to account for the sentinel entity at the start of every entity list
        result['Object Layout - Horizontal'][str(i + 1)] = horizontal_object_layout[i]
        result['Object Layout - Vertical'][str(i + 1)] = vertical_object_layout[i]
    for unique_entity_type in sorted(unique_entity_types):
        print('   -', unique_entity_type, unique_entity_types[unique_entity_type])
    return result

if __name__ == '__main__':
    '''
    Usage
    python entity_shuffler.py EXTRACTION CHANGES ALIASES --seed SEED
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    parser = argparse.ArgumentParser()
    parser.add_argument('extraction', help='Input a filepath to the extraction JSON file', type=str)
    parser.add_argument('changes', help='Input a filepath to the changes JSON file to modify', type=str)
    parser.add_argument('aliases', help='Input a filepath to the aliases YAML file to modify', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    args = parser.parse_args()
    with (
        open(args.extraction) as extraction_file,
        open(args.changes) as changes_file,
        open(args.aliases) as aliases_file,
    ):
        extraction = json.load(extraction_file)
        changes = json.load(changes_file)
        if 'Changes' in changes:
            changes = changes['Changes']
        aliases = yaml.safe_load(aliases_file)
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(MIN_SEED, MAX_SEED))
    # For each stage, shuffle entities within each room
    global_rng = random.Random(initial_seed)
    for stage_name in sorted(changes['Stages'].keys()):
        print('', stage_name)
        stage_seed = global_rng.randint(MIN_SEED, MAX_SEED)
        stage_rng = random.Random(stage_seed)
        for room_name in sorted(changes['Stages'][stage_name]['Rooms'].keys()):
            print('  ', room_name)
            room_id = str(getID(aliases, ('Rooms', room_name)))
            room_extract = extraction['Stages'][stage_name]['Rooms'][room_id]
            room_seed = stage_rng.randint(MIN_SEED, MAX_SEED)
            if 'Object Layout - Horizontal' not in room_extract:
                continue
            object_layouts = shuffle_entities(room_extract['Object Layout - Horizontal']['Data'][1:-1], room_seed, stage_name)
            if object_layouts is not None:
                changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Horizontal'] = object_layouts['Object Layout - Horizontal']
                changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Vertical'] = object_layouts['Object Layout - Vertical']
    # for entity in sorted(entities):
    #     print(entity)
    with open(os.path.join('build', 'shuffler', 'april-fools.json'), 'w') as changes_json:
        json.dump(changes, changes_json, indent='    ', sort_keys=True, default=str)
