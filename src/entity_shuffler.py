# External libraries
import argparse
import copy
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

# Entity pools
# - ENEMY: Enemy
# - RELIC_ORB: Relic Orb
# - ITEM_DROP: Unique Item Drop
# - CANDLE: Candle
# - UNIDENTIFIED: Unidentified
# Error levels
# - UNIDENTIFIED: Unidentified
# - FATAL: Crashes the game
# - ERROR: Highly likely to cause softlocks or severe glitches
# - WARNING: Might cause softlocks or unintended glitches, depending on other factors
# - UNCERTAIN: Unsure of outcome
# - WEIRD: Safe, but will probably look strange or glitchy
# - SAFE: Safe
entity_types = {
    'GLOBAL': {
        5: ('UNIDENTIFIED', 'ERROR'), # Red Door
        8: ('UNIDENTIFIED', 'ERROR'), # Room Foreground Entity
        9: ('UNIDENTIFIED', 'WARNING'), # Stage Name Popup
        11: ('RELIC_ORB', 'SAFE'), # Relic Orb
        12: ('ITEM_DROP', 'SAFE'), # Unique Item Drop
        40961: ('CANDLE', 'SAFE'), # Candle
    },
    'Abandoned Mine': {
        22: ('UNIDENTIFIED', 'WEIRD'), # Wall for Demon Switch
        23: ('UNIDENTIFIED', 'WARNING'), # Demon Switch
        24: ('UNIDENTIFIED', 'UNCERTAIN'), # Breakable Wall in Abandoned Mine
        28: ('UNIDENTIFIED', 'SAFE'), # Crumbling Stairwell
        29: ('UNIDENTIFIED', 'SAFE'), # Tiny Crumbling Ledge
        30: ('ENEMY', 'SAFE'), # Gremlin
        33: ('ENEMY', 'SAFE'), # Salem Witch
        38: ('ENEMY', 'SAFE'), # Thornweed
        41: ('ENEMY', 'SAFE'), # Venus Weed
    },
    'Alchemy Laboratory': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNCERTAIN'), # Pressure Plate in Box Puzzle Room
        26: ('UNIDENTIFIED', 'WEIRD'), # Retractable Spikes
        27: ('UNIDENTIFIED', 'WEIRD'), # Movable Crate
        28: ('UNIDENTIFIED', 'WARNING'), # Cannon?
        29: ('UNIDENTIFIED', 'WARNING'), # Cannon Lever?
        31: ('UNIDENTIFIED', 'WARNING'), # Cannon Wall?
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'WARNING'), # Elevator Lift
        35: ('UNIDENTIFIED', 'SAFE'), # Bust with Red Eyes
        36: ('UNIDENTIFIED', 'WARNING'), # Retractable Spikes?
        37: ('UNIDENTIFIED', 'WARNING'), # Pressure Plate for Spikes?
        38: ('ENEMY', 'SAFE'), # Red Skeleton 1
        39: ('ENEMY', 'SAFE'), # Red Skeleton 2
        41: ('ENEMY', 'SAFE'), # Green Axe Knight
        43: ('ENEMY', 'SAFE'), # Bloody Zombie
        46: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        49: ('ENEMY', 'SAFE'), # Spittlebone
        52: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        53: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        54: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        55: ('UNIDENTIFIED', 'SAFE'), # Breakable Orb with Unique Item Drop
        57: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        62: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        71: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        72: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        74: ('UNIDENTIFIED', 'ERROR'), # Blue Door
        75: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Anti-Chapel': {
        22: ('UNIDENTIFIED', 'ERROR'), # Invisible Room Transition Entity?
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'), # Background Geometry, Nave 1?
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'), # Background Geometry, Nave 2?
        30: ('ENEMY', 'SAFE'), # Archer?
        34: ('ENEMY', 'SAFE'), # Spectral Sword?
        38: ('ENEMY', 'SAFE'), # Sniper of Goth?
        40: ('ENEMY', 'SAFE'), # Imp?
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        45: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        50: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        51: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Black Marble Gallery': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('ENEMY', 'SAFE'), # Guardian
        38: ('ENEMY', 'SAFE'), # Spike Contraption?
        39: ('ENEMY', 'SAFE'), # Thornweed
        42: ('ENEMY', 'SAFE'), # Stone Skull
        43: ('ENEMY', 'SAFE'), # Jack O'Bones
        46: ('ENEMY', 'SAFE'), # Nova Skeleton
        53: ('ENEMY', 'SAFE'), # Gurkha
        55: ('ENEMY', 'SAFE'), # Blade
        57: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        62: ('ENEMY', 'SAFE'), # Gorgon
        71: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        72: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        74: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        75: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        76: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        79: ('UNIDENTIFIED', 'ERROR'), # Blue Door
        40977: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        41033: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Castle Center': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Castle Entrance': {
        8: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        11: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        12: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'ERROR'), # Background Effect, Lightning
        24: ('UNIDENTIFIED', 'WEIRD'), # Water
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'ERROR'),
        27: ('UNIDENTIFIED', 'ERROR'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'ERROR'), # Lever Platform
        31: ('UNIDENTIFIED', 'WEIRD'), # Wooden Wall 1
        32: ('UNIDENTIFIED', 'FATAL'),
        33: ('UNIDENTIFIED', 'FATAL'),
        34: ('UNIDENTIFIED', 'FATAL'),
        35: ('UNIDENTIFIED', 'WEIRD'), # Trapdoor
        36: ('UNIDENTIFIED', 'WEIRD'), # Left Breakable Rock
        37: ('UNIDENTIFIED', 'WEIRD'), # Right Breakable Rock
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'WEIRD'), # Pressure Plate
        44: ('UNIDENTIFIED', 'WEIRD'), # Wooden Wall 2
        52: ('UNIDENTIFIED', 'UNIDENTIFIED'), # Related to water?
        58: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        65: ('ENEMY', 'WEIRD'), # Merman
        69: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        70: ('ENEMY', 'SAFE'), # Bone Scimitar with Unique Drop
        72: ('ENEMY', 'SAFE'), # Bat
        74: ('ENEMY', 'SAFE'), # Warg
        77: ('UNIDENTIFIED', 'WEIRD'), # Floor Zombie Spawner
        78: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        79: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        80: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        81: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        82: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        83: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        84: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        85: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        86: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Forest Cutscene
        87: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        92: ('UNIDENTIFIED', 'WEIRD'), # Breakable Corner Block
        95: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Castle Entrance Revisited': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'ERROR'), # Background Effect, Lightning
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'FATAL'),
        33: ('UNIDENTIFIED', 'FATAL'),
        34: ('UNIDENTIFIED', 'FATAL'),
        35: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        50: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        57: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        61: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        64: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        67: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        69: ('ENEMY', 'SAFE'), # Owl (and Owl Knight?)
        72: ('ENEMY', 'SAFE'), # Bloody Zombie
        75: ('ENEMY', 'SAFE'), # Zombie
        78: ('ENEMY', 'SAFE'), # Slogra
        81: ('ENEMY', 'SAFE'), # Gaibon
        88: ('ENEMY', 'SAFE'), # Gurkha
        90: ('ENEMY', 'SAFE'), # Blade
    },
    'Castle Keep': {
        18: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'ERROR'),
        23: ('UNIDENTIFIED', 'ERROR'),
        24: ('UNIDENTIFIED', 'ERROR'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'ERROR'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('ENEMY', 'SAFE'), # Flea Rider
        34: ('UNIDENTIFIED', 'ERROR'),
        35: ('UNIDENTIFIED', 'ERROR'),
        40: ('ENEMY', 'SAFE'), # Axe Knight
    },
    'Catacombs': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'WEIRD'), # Dark Room Platform
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        46: ('ENEMY', 'SAFE'), # Discus Lord
        50: ('ENEMY', 'SAFE'), # Hellfire Beast
        55: ('ENEMY', 'SAFE'), # Bone Ark?
        62: ('ENEMY', 'SAFE'), # Lossoth
        67: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        68: ('ENEMY', 'SAFE'), # Grave Keeper
        71: ('ENEMY', 'SAFE'), # Gremlin
        74: ('ENEMY', 'SAFE'), # Large Slime?
        76: ('ENEMY', 'SAFE'), # Slime
        78: ('ENEMY', 'SAFE'), # Wereskeleton
        81: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Cave': {
        22: ('ENEMY', 'SAFE'), # Slogra
        25: ('ENEMY', 'SAFE'), # Gaibon
        30: ('UNIDENTIFIED', 'WEIRD'), # Demon Switch Wall
        31: ('UNIDENTIFIED', 'WARNING'), # Demon Switch
        32: ('UNIDENTIFIED', 'WEIRD'), # Breakable Wall
        34: ('ENEMY', 'SAFE'), # Thornweed
        37: ('ENEMY', 'SAFE'), # Bat?
    },
    'Clock Tower': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        18: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'WEIRD'), # Pendulum?
        34: ('UNIDENTIFIED', 'WEIRD'), # Breakable Wall
        36: ('UNIDENTIFIED', 'UNCERTAIN'), # Invisible Room Transition Entity
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        46: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        50: ('ENEMY', 'SAFE'), # Skull Lord
        54: ('ENEMY', 'SAFE'), # Harpy
        59: ('ENEMY', 'SAFE'), # Cloaked Knight
        63: ('ENEMY', 'SAFE'), # Sword Lord
        68: ('ENEMY', 'SAFE'), # Phantom Skull
        70: ('ENEMY', 'SAFE'), # Flail Guard
        72: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        73: ('ENEMY', 'SAFE'), # Flea Armor
        77: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Karasuman's Room
        86: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Colosseum': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'WEIRD'), # Background Detail 1?
        23: ('UNIDENTIFIED', 'WEIRD'), # Background Detail 2?
        24: ('UNIDENTIFIED', 'WEIRD'), # Stone Barrier
        25: ('UNIDENTIFIED', 'WEIRD'), # Pressure Plate
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'WEIRD'), # Elevator Hatch
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'WEIRD'), # Breakable Ceiling
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('ENEMY', 'SAFE'), # Blade Master
        38: ('ENEMY', 'SAFE'), # Blade Soldier
        41: ('ENEMY', 'SAFE'), # Bone Musket
        44: ('ENEMY', 'SAFE'), # Owl Knight
        47: ('ENEMY', 'SAFE'), # Valhalla Knight
        50: ('ENEMY', 'SAFE'), # Axe Knight
        54: ('ENEMY', 'SAFE'), # Armor Lord
        58: ('ENEMY', 'SAFE'), # Hunting Girl
        60: ('ENEMY', 'SAFE'), # Paranthropus
        67: ('ENEMY', 'SAFE'), # Bone Scimitar
        69: ('ENEMY', 'SAFE'), # Plate Lord
        75: ('ENEMY', 'SAFE'), # Grave Keeper
        77: ('UNIDENTIFIED', 'WEIRD'), # Mist Gate
    },
    "Death Wing's Lair": {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'WEIRD'), # Breakable Wall
        35: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'ERROR'), # Boss Door
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('ENEMY', 'SAFE'), # Malachi
        47: ('ENEMY', 'SAFE'), # Karasuman
        53: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        57: ('ENEMY', 'SAFE'), # Azaghal
        60: ('ENEMY', 'SAFE'), # Ghost Dancer
        61: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Floating Catacombs': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('ENEMY', 'SAFE'), # Frozen Half
        40: ('ENEMY', 'SAFE'), # Salome
        45: ('UNIDENTIFIED', 'WEIRD'), # Breakable Wall
        46: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        50: ('ENEMY', 'SAFE'), # Skeleton
        53: ('ENEMY', 'SAFE'), # Blood Skeleton
        54: ('ENEMY', 'SAFE'), # Bat
    },
    'Forbidden Library': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('ENEMY', 'SAFE'), # Lion
        31: ('ENEMY', 'SAFE'), # Tin Man
        36: ('ENEMY', 'SAFE'), # Scarecrow
        39: ('ENEMY', 'SAFE'), # Schmoo
        41: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Long Library': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        18: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Spellbook Area
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Spellbook Area
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Spellbook Area
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Bookcase Room
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Shop
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Shop
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Shop
        48: ('ENEMY', 'SAFE'), # Spellbook
        50: ('ENEMY', 'SAFE'), # Magic Tome
        51: ('ENEMY', 'SAFE'), # Dhuron
        55: ('ENEMY', 'SAFE'), # Ectoplasm
        58: ('ENEMY', 'SAFE'), # Thornweed
        61: ('UNIDENTIFIED', 'WEIRD'), # Candle Table
        64: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Lesser Demon Area
        65: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Lesser Demon Area
        70: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Bookcase Room
        73: ('UNIDENTIFIED', 'UNIDENTIFIED'), # UNIDENTIFIED in Lesser Demon Area
        74: ('ENEMY', 'SAFE'), # Flea Armor
        76: ('ENEMY', 'SAFE'), # Flea Man
    },
    'Marble Gallery': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        18: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('ENEMY', 'SAFE'), # Diplocephalus
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        41: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'WEIRD'), # Pressure Plate
        45: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        46: ('ENEMY', 'SAFE'), # Skelerang
        49: ('ENEMY', 'SAFE'), # Plate Lord
        56: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        57: ('ENEMY', 'SAFE'), # Marionette
        58: ('ENEMY', 'SAFE'), # Slinger
        61: ('ENEMY', 'SAFE'), # Stone Rose
        66: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        67: ('ENEMY', 'SAFE'), # Ctulhu
        71: ('ENEMY', 'SAFE'), # Axe Knight
        74: ('ENEMY', 'SAFE'), # Ouija Table
        76: ('ENEMY', 'SAFE'), # Flea Man
        77: ('ENEMY', 'SAFE'), # Skeleton
        81: ('UNIDENTIFIED', 'ERROR'), # Blue Door
        40977: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        41003: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Necromancy Laboratory': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'SAFE'), # Spike Contraption
        27: ('ENEMY', 'SAFE'), # Ctulhu
        31: ('ENEMY', 'SAFE'), # Fire Demon
        35: ('ENEMY', 'SAFE'), # Lesser Demon
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        41: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        48: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        49: ('ENEMY', 'SAFE'), # Bitterfly
        50: ('ENEMY', 'SAFE'), # Imp
        52: ('ENEMY', 'SAFE'), # Gremlin
        55: ('ENEMY', 'SAFE'), # Salem Witch
    },
    "Olrox's Quarters": {
        22: ('ENEMY', 'SAFE'), # Skelerang
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'WEIRD'), # Prisoner
        45: ('ENEMY', 'SAFE'), # Bloody Zombie
        51: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        52: ('ENEMY', 'SAFE'), # Valhalla Knight
        55: ('ENEMY', 'SAFE'), # Hammer
        60: ('ENEMY', 'SAFE'), # Blade
        62: ('ENEMY', 'SAFE'), # Spectral Sword
    },
    'Outer Wall': {
        17: ('UNIDENTIFIED', 'ERROR'), # Elevator Switch Parts 1?
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'), # Rain Effects 1?
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'), # Rain Effects 2?
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'WEIRD'), # Bird's Nest?
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('ENEMY', 'SAFE'), # Blue Axe Knight?
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'WEIRD'), # Telescope?
        41: ('UNIDENTIFIED', 'WARNING'), # Elevator Cage?
        43: ('UNIDENTIFIED', 'WARNING'), # Elevator Shaft Parts?
        46: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        50: ('UNIDENTIFIED', 'WARNING'), # Elevator Switch Parts 2?
        51: ('UNIDENTIFIED', 'WARNING'), # Elevator Switch
        53: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        55: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        59: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        61: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        62: ('ENEMY', 'SAFE'), # Skeleton
        68: ('ENEMY', 'SAFE'), # Bone Archer
        70: ('ENEMY', 'SAFE'), # Bone Musket
        72: ('ENEMY', 'SAFE'), # Sword Lord
        74: ('ENEMY', 'SAFE'), # Armor Lord
        79: ('ENEMY', 'SAFE'), # Spear Guard
        83: ('ENEMY', 'SAFE'), # Skeleton Ape
        87: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        89: ('UNIDENTIFIED', 'UNCERTAIN'), # Medusa Head Spawner
        93: ('UNIDENTIFIED', 'UNCERTAIN'), # Mist Door
    },
    'Reverse Castle Center': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Reverse Caverns': {
        10: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        35: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        41: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        52: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        55: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        57: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        58: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        61: ('ENEMY', 'SAFE'), # Dark Octopus
        64: ('ENEMY', 'SAFE'), # Cave Troll
        67: ('ENEMY', 'SAFE'), # Blue Venus Weed
        72: ('ENEMY', 'SAFE'), # Rock Knight
        79: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        80: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        81: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        83: ('ENEMY', 'SAFE'), # Jack O'Bones
        86: ('ENEMY', 'SAFE'), # Nova Skeleton
        90: ('ENEMY', 'SAFE'), # Imp
        92: ('ENEMY', 'SAFE'), # Balloon Pod
        94: ('ENEMY', 'SAFE'), # Killer Fish
    },
    'Reverse Clock Tower': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        18: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        35: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        51: ('ENEMY', 'SAFE'), # Darkwing Bat
        54: ('ENEMY', 'SAFE'), # Cloaked Knight
        58: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        62: ('ENEMY', 'SAFE'), # Valhalla Knight
        65: ('ENEMY', 'SAFE'), # Bomb Knight
        74: ('ENEMY', 'WEIRD'), # Spike Chandelier
    },
    'Reverse Colosseum': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('ENEMY', 'SAFE'), # Minotaur
        26: ('ENEMY', 'SAFE'), # Werewolf
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('ENEMY', 'SAFE'), # Azaghal
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('ENEMY', 'UNIDENTIFIED'), # White Dragon
        42: ('ENEMY', 'SAFE'), # Stone Skull
    },
    'Reverse Entrance': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('ENEMY', 'SAFE'), # Warg Rider
        36: ('ENEMY', 'SAFE'), # Jack O'Bones
        39: ('ENEMY', 'SAFE'), # Nova Skeleton
        43: ('ENEMY', 'SAFE'), # Oruburos
        48: ('ENEMY', 'SAFE'), # Dragon Rider
        52: ('ENEMY', 'SAFE'), # Blue Venus Weed
        59: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        62: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        65: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        66: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        67: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        69: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        71: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        72: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        78: ('ENEMY', 'SAFE'), # Dodo Bird
    },
    'Reverse Keep': {
        18: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        26: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        27: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('ENEMY', 'SAFE'), # Yorick
        37: ('ENEMY', 'SAFE'), # Tombstone
        38: ('ENEMY', 'SAFE'), # Skull Lord
    },
    'Reverse Outer Wall': {
        17: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('ENEMY', 'SAFE'), # Paranthropus
        29: ('ENEMY', 'SAFE'), # Stone Skull
        30: ('ENEMY', 'SAFE'), # Jack O'Bones
        33: ('ENEMY', 'SAFE'), # Nova Skeleton
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        45: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        47: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Reverse Warp Rooms': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Royal Chapel': {
        22: ('UNIDENTIFIED', 'UNCERTAIN'), # Invisible Room Transition Entity
        23: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        24: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        25: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'UNIDENTIFIED'), # Confessional Booth?
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        39: ('ENEMY', 'SAFE'), # Corner Guard
        41: ('ENEMY', 'SAFE'), # Bone Pillar
        45: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        46: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        50: ('ENEMY', 'SAFE'), # Bone Halberd
        55: ('ENEMY', 'SAFE'), # Bat
        56: ('ENEMY', 'SAFE'), # Black Crow
        57: ('ENEMY', 'SAFE'), # Blue Raven
        58: ('ENEMY', 'SAFE'), # Skelerang
        61: ('ENEMY', 'SAFE'), # Hunting Girl
        63: ('ENEMY', 'SAFE'), # Puppet Sword
        66: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        67: ('ENEMY', 'UNCERTAIN'), # Spike Ball
        69: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        72: ('UNIDENTIFIED', 'UNIDENTIFIED'),
    },
    'Underground Caverns': {
        17: ('UNIDENTIFIED', 'WEIRD'), # Mooring Post
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        28: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        29: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        30: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        31: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        32: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        33: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        34: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        35: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        36: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        37: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        38: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        39: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        40: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        41: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        42: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        43: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        44: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        45: ('UNIDENTIFIED', 'UNCERTAIN'), # Ferryman
        47: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        48: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        54: ('UNIDENTIFIED', 'UNCERTAIN'), # Movable Crate
        55: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        56: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        57: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        58: ('ENEMY', 'SAFE'), # Spear Guard, Trapped
        60: ('ENEMY', 'SAFE'), # Toad
        61: ('ENEMY', 'SAFE'), # Frog
        63: ('ENEMY', 'SAFE'), # Fishhead
        68: ('ENEMY', 'SAFE'), # Bat
        69: ('ENEMY', 'SAFE'), # Frozen Shade
        73: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        74: ('ENEMY', 'SAFE'), # Spear Guard
        76: ('ENEMY', 'SAFE'), # Bone Archer
        78: ('UNIDENTIFIED', 'UNCERTAIN'), # Water Barrier
        80: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        81: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        83: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        85: ('ENEMY', 'SAFE'), # Killer Fish
        91: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        93: ('UNIDENTIFIED', 'UNCERTAIN'), # DK Bridge Button
        94: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        95: ('UNIDENTIFIED', 'UNIDENTIFIED'),
        96: ('UNIDENTIFIED', 'UNCERTAIN'), # DK Bridge
    },
    'Warp Rooms': {
        22: ('UNIDENTIFIED', 'UNIDENTIFIED'),
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
        shuffle_percents = {
            'SAFE':    1.00,
            'WEIRD':   0.50,
            'UNIDENTIFIED': 0.25,
            'UNCERTAIN': 0.25,
            'WARNING': 0.10,
            'ERROR':   0.00,
            'FATAL':   0.00,
        }
        error_status = 'UNIDENTIFIED'
        if entity['Entity Type ID'] in entity_types['GLOBAL']:
            (_, error_status) = entity_types['GLOBAL'][entity['Entity Type ID']]
        elif entity['Entity Type ID'] in entity_types[stage_name]:
            (_, error_status) = entity_types[stage_name][entity['Entity Type ID']]
        shuffle_ind = rng.random() < shuffle_percents[error_status]
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

def shuffle_relics_and_items(changes: dict, seed: int):
    rng = random.Random(seed)
    # Extract entities in pool type from their original positions and add them to the base object layouts
    object_layouts = {}
    for stage_name in sorted(changes['Stages'].keys()):
        object_layouts[stage_name] = {}
        for room_name in sorted(changes['Stages'][stage_name]['Rooms'].keys()):
            room_id = str(getID(aliases, ('Rooms', room_name)))
            room_extract = extraction['Stages'][stage_name]['Rooms'][room_id]
            if 'Object Layout - Horizontal' not in room_extract:
                continue
            object_layouts[stage_name][room_name] = copy.deepcopy(room_extract['Object Layout - Horizontal']['Data'][1:-1])
    for pool_type in (
        'RELIC_ORB', # ('RELIC_ORB', 'GLOBAL'),
        'ITEM_DROP', # ('ITEM_DROP', 'GLOBAL'),
        # 'ENEMY', # ('ENEMY', 'Abandoned Mine'),
        # 'ENEMY', # ('ENEMY', 'Alchemy Laboratory'),
    ):
        print('', pool_type)
        pooled_entities = []
        # Extract entities in pool type from their original positions and add them to the pool
        for stage_name in sorted(object_layouts.keys()):
            for room_name in sorted(object_layouts[stage_name].keys()):
                for base_entity in object_layouts[stage_name][room_name]:
                    entity_type = entity_types.get(stage_name, {}).get(base_entity['Entity Type ID'], ('UNIDENTIFIED', 'UNIDENTIFIED'))
                    if entity_type == ('UNIDENTIFIED', 'UNIDENTIFIED'):
                        entity_type = entity_types.get('GLOBAL', {}).get(base_entity['Entity Type ID'], ('UNIDENTIFIED', 'UNIDENTIFIED'))
                    if entity_type == (pool_type, 'SAFE'):
                        print('*** Entity added to pool!', entity_type, base_entity)
                        pooled_entity = {
                            'Entity Room Index': base_entity.pop('Entity Room Index'),
                            'Entity Type ID': base_entity.pop('Entity Type ID'),
                            'Params': base_entity.pop('Params'),
                        }
                        pooled_entities.append(pooled_entity)
        # Shuffle the pool of entities around
        rng.shuffle(pooled_entities)
        # Reassign the now-shuffled pool of entities in order
        for stage_name in sorted(object_layouts.keys()):
            for room_name in sorted(object_layouts[stage_name].keys()):
                for base_entity in object_layouts[stage_name][room_name]:
                    if 'Entity Type ID' not in base_entity:
                        pooled_entity = pooled_entities.pop()
                        base_entity['Entity Room Index'] = pooled_entity['Entity Room Index']
                        base_entity['Entity Type ID'] = pooled_entity['Entity Type ID']
                        base_entity['Params'] = pooled_entity['Params']
        assert len(pooled_entities) < 1
    # Sort the new entity lists by X and Y and add them to the horizontal and vertical lists, respectively
    for stage_name in sorted(object_layouts.keys()):
        for room_name in sorted(object_layouts[stage_name].keys()):
            room_object_layouts = {
                'Object Layout - Horizontal': {},
                'Object Layout - Vertical': {},
            }
            horizontal_object_layout = list(sorted(
                object_layouts[stage_name][room_name],
                key=lambda x: (x['X'], x['Y'], x['Entity Room Index'], x['Entity Type ID'], x['Params'])
            ))
            vertical_object_layout = list(sorted(
                object_layouts[stage_name][room_name],
                key=lambda x: (x['Y'], x['X'], x['Entity Room Index'], x['Entity Type ID'], x['Params'])
            ))
            assert len(horizontal_object_layout) == len(vertical_object_layout)
            for i in range(len(horizontal_object_layout)):
                # NOTE(sestren): Add +1 to the changes key to account for the sentinel entity at the start of every entity list
                room_object_layouts['Object Layout - Horizontal'][str(i + 1)] = horizontal_object_layout[i]
                room_object_layouts['Object Layout - Vertical'][str(i + 1)] = vertical_object_layout[i]
            changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Horizontal'] = room_object_layouts['Object Layout - Horizontal']
            changes['Stages'][stage_name]['Rooms'][room_name]['Object Layout - Vertical'] = room_object_layouts['Object Layout - Vertical']

if __name__ == '__main__':
    '''
    Usage
    python entity_shuffler.py EXTRACTION CHANGES ALIASES --seed SEED

    - Shuffle all Relic Orbs across both castles
    - Shuffle all Unique Item Drops across both castles
    - Shuffle all enemies within each stage

    Iterate over all stages
    - If condition met, pop (stage_name, room_name, x, y) from entity and add it to pool
    - 
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
    # For each stage, shuffle enemies within each stage
    global_rng = random.Random(initial_seed)
    seed = global_rng.randint(MIN_SEED, MAX_SEED)
    shuffle_relics_and_items(changes, seed)
    with open(os.path.join('build', 'shuffler', 'april-fools.json'), 'w') as changes_json:
        json.dump(changes, changes_json, indent='    ', sort_keys=True, default=str)
