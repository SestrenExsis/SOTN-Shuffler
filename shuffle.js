import fs from 'fs'
import yargs from 'yargs'
import { inspect } from 'node:util'

import {
    analyzeLogic,
    validate,
} from './src/analyze-logic.js'

import {
    arrangeStages,
    hashedObject,
} from './src/common.js'

import {
    TELEPORTERS,
} from './src/constants.js'

import {
    getSeedName,
} from './src/generate-words.js'

import {
    getSongChanges,
    shuffleSongs,
} from './src/shuffle-music.js'

import {
    combineNodeGroups,
    getMapPixels,
    getRoomChanges,
    getVanillaStageNodeGroups,
    MAP_PIXELS,
    NODE_GROUPS,
    shuffleRooms,
} from './src/shuffle-rooms.js'

import {
    getTeleporterChanges,
    getVanillaStageLinks,
    shuffleStages,
} from './src/shuffle-stages.js'

import {
    shuffleRewards,
    getRewardChanges,
} from './src/shuffle-rewards.js'

// NOTE(sestren): Proposed order of operations:
//   - Shuffle the rooms within each stage
//   - Shuffle the stage connections
//   - Assign warp rooms to the stage they connect to
//   - Arrange stages on the map

const MIN_MAP_COL = 1
const MIN_MAP_ROW = 5

const STAGE_NAMES = [
    'abandonedMine',
    'alchemyLaboratory',
    'castleEntrance',
    'castleKeep',
    'catacombs',
    'clockTower',
    'colosseum',
    'longLibrary',
    'marbleGallery',
    'olroxsQuarters',
    'outerWall',
    'royalChapel',
    'undergroundCaverns',
]

const VALIDATIONS = {
    abandonedMine: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionSummonDemonFamiliar: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusDemonSwitchActivated: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionSummonDemonFamiliar: true,
                statusDemonSwitchActivated: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationDemonCard: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionSummonDemonFamiliar: true,
                statusDemonSwitchActivated: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'abandonedMine',
                room: 'cerberusRoom',
                section: 'main',
            },
            goalType: 'required',
        },
    ],
    alchemyLaboratory: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionUnlockBlueDoors: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusCannonActivated: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionUnlockBlueDoors: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationBatCard: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionUnlockBlueDoors: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSkillOfWolf: true,
            },
            goalType: 'required',
        },
    ],
    castleEntrance: [
        {
            startingState: {
                stage: 'castleEntrance',
                room: 'afterDrawbridge',
                section: 'main',
                debugEnableElsewhere: true,
                time: 360.0,
            },
            goalState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                statusMetDeathInCastleEntrance: false,
            },
            goalType: 'forbidden',
        },
        {
            startingState: {
                stage: 'castleEntrance',
                room: 'afterDrawbridge',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionWolfTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionWolfTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionWolfTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusPassageFromCastleEntranceToWarpRoomsOpened: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionWolfTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusSecretWallInMermanRoomOpened: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionWolfTransformation: true,
                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                statusSecretWallInMermanRoomOpened: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationCubeOfZoe: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionWolfTransformation: true,
                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                statusSecretWallInMermanRoomOpened: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationPowerOfWolf: true,
            },
            goalType: 'required',
        },
    ],
    castleKeep: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationGhostCard: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationLeapStone: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationPowerOfMist: true,
            },
            goalType: 'required',
        },
    ],
    catacombs: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                itemSpikeBreaker: 1,
                progressionBatTransformation: true,
                progressionEcholocation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSpikeBreaker: true,
            },
            goalType: 'required',
        },
    ],
    clockTower: [
        // {
        //     startingState: {
        //         stage: 'elsewhere',
        //         room: 'hub',
        //         section: 'main',
        //         progressionBatTransformation: true,
        //         debugEnableElsewhere: true,
        //         time: 120.0,
        //     },
        //     goalState: {
        //         statusLeftGearRoomSolved: true,
        //     },
        //     goalType: 'required',
        // },
        // {
        //     startingState: {
        //         stage: 'elsewhere',
        //         room: 'hub',
        //         section: 'main',
        //         progressionBatTransformation: true,
        //         debugEnableElsewhere: true,
        //         time: 120.0,
        //     },
        //     goalState: {
        //         statusRightGearRoomSolved: true,
        //     },
        //     goalType: 'required',
        // },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                statusLeftGearRoomSolved: true,
                statusRightGearRoomSolved: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationFireOfBat: true,
            },
            goalType: 'required',
        },
        // NOTE(sestren): It should be possible to traverse the stage both ways without solving the Gear Puzzle
        {
            startingState: {
                stage: 'clockTower',
                room: 'loadingRoomToOuterWall',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: false,
                time: 120.0,
            },
            goalState: {
                stage: 'clockTower',
                room: 'loadingRoomToCastleKeep',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'clockTower',
                room: 'loadingRoomToCastleKeep',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: false,
                time: 120.0,
            },
            goalState: {
                stage: 'clockTower',
                room: 'loadingRoomToOuterWall',
                section: 'main',
            },
            goalType: 'required',
        },
    ],
    colosseum: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationFormOfMist: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusBarrierInColosseumOpened: true,
            },
            goalType: 'required',
        },
    ],
    longLibrary: [
        {
            startingState: {
                stage: 'longLibrary',
                room: 'outsideShop',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'longLibrary',
                room: 'outsideShop',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'longLibrary',
                room: 'threeLayerRoom',
                section: 'topLayer',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'longLibrary',
                room: 'threeLayerRoom',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'longLibrary',
                room: 'threeLayerRoom',
                section: 'bottomLayer',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationFaerieCard: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationFaerieScroll: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationJewelOfOpen: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionDoubleJump: true,
                progressionMistTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSoulOfBat: true,
            },
            goalType: 'required',
        },
    ],
    marbleGallery: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionItemMaterialization: true,
                progressionUnlockBlueDoors: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusPressurePlateInMarbleGalleryActivated: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionItemMaterialization: true,
                progressionUnlockBlueDoors: true,
                statusPressurePlateInMarbleGalleryActivated: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationGravityBoots: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionItemMaterialization: true,
                progressionUnlockBlueDoors: true,
                statusPressurePlateInMarbleGalleryActivated: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSpiritOrb: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionItemMaterialization: true,
                progressionUnlockBlueDoors: true,
                statusPressurePlateInMarbleGalleryActivated: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'marbleGallery',
                room: 'clockRoom',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'marbleGallery',
                room: 'clockRoom',
                section: 'main',
            },
            goalType: 'required',
        },
    ],
    olroxsQuarters: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationEchoOfBat: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSwordCard: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'olroxsQuarters',
                room: 'olroxsRoom',
                section: 'main',
            },
            goalType: 'required',
        },
    ],
    outerWall: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'outerWall',
                room: 'doppelgangerRoom',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSoulOfWolf: true,
            },
            goalType: 'required',
        },
    ],
    royalChapel: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                itemSpikeBreaker: 1,
                progressionBatTransformation: true,
                progressionMistTransformation: true,
                progressionUnlockBlueDoors: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusStatueInRoyalChapelMoved: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                itemSpikeBreaker: 1,
                progressionBatTransformation: true,
                progressionMistTransformation: true,
                progressionUnlockBlueDoors: true,
                statusStatueInRoyalChapelMoved: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                stage: 'royalChapel',
                room: 'hippogryphRoom',
                section: 'main',
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                itemSpikeBreaker: 1,
                progressionBatTransformation: true,
                progressionMistTransformation: true,
                progressionUnlockBlueDoors: true,
                statusStatueInRoyalChapelMoved: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationSilverRing: true,
            },
            goalType: 'required',
        },
    ],
    undergroundCaverns: [
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionProtectionFromWater: true,
                progressionSummonFerryman: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationGoldRing: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionProtectionFromWater: true,
                progressionSummonFerryman: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationHolySymbol: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionProtectionFromWater: true,
                progressionSummonFerryman: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                locationMermanStatue: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionProtectionFromWater: true,
                progressionSummonFerryman: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusButtonInUndergroundCavernsActivated: true,
            },
            goalType: 'required',
        },
        {
            startingState: {
                stage: 'elsewhere',
                room: 'hub',
                section: 'main',
                progressionBatTransformation: true,
                progressionProtectionFromWater: true,
                progressionSummonFerryman: true,
                statusButtonInUndergroundCavernsActivated: true,
                debugEnableElsewhere: true,
                time: 120.0,
            },
            goalState: {
                statusBridgeInUndergroundCavernsBroken: true,
            },
            goalType: 'required',
        },
    ],
}

const argv = yargs(process.argv.slice(2))
    .command({ // multi
        command: 'multi',
        describe: 'Combine multiple randomization options into one patch',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
        // Hinter options
            .option('hinter.seedName', {
                describe: 'Whether or not to display the seed value on the file select screen',
                type: 'boolean',
            })
            .option('hinter.settings', {
                describe: 'Whether or not to display a hash value of the settings used on the file select screen',
                type: 'boolean',
                // The hash value can be used to demonstrate that two separate PPFs were very likely generated with the same settings.
                // It is only meant to help in catching accidental settings changes, and may not help in catching well-crafted, malicious ones.
            })
            .option('hinter.stageLinks', {
                describe: 'Whether or not to add a label identifying each pair of loading rooms on the castle map; will only apply to loading room pairs that do not occupy the same map position already',
                type: 'boolean',
            })
        // Music shuffler options
            .option('musicShuffler.on', {
                describe: 'Whether or not to enable shuffling of in-game music; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            .option('musicShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the music shuffler',
                type: 'string',
            })
        // Patcher options
            // IDEA(sestren): Add ability to specify relative or absolute filepath
            // IDEA(sestren): Add ability to specify shallow or deep copy of patch
            .option('patcher.on', {
                describe: 'Whether or not to apply the given list of patches',
                type: 'boolean',
            })
            .option('patcher.list', {
                describe: 'A list of filepaths of patches to apply, in order',
                type: 'array',
            })
        // Reward shuffler options
            .option('rewardShuffler.on', {
                describe: 'Whether or not to shuffle quest rewards (aka, items and relicss). If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('rewardShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the reward shuffler',
                type: 'string',
            })
        // Room shuffler options
            .option('roomShuffler.on', {
                describe: 'Whether or not to shuffle how rooms within a stage connect. If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('roomShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the room shuffler',
                type: 'string',
            })
        // Solver options
            .option('solver.on', {
                describe: 'Whether or not to verify that all the other configurations result in a gameplay experience that should be completable; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            .option('solver.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the solver',
                type: 'string',
            })
            .option('solver.maxAttempts', {
                describe: 'The maximum number of attempts before the solver will give up',
                type: 'number',
                default: 1000000,
            })
        // Stage shuffler options
            .option('stageShuffler.on', {
                describe: 'Whether or not to shuffle the connections between stages (aka, teleporters). If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('stageShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the stage shuffler',
                type: 'string',
            })
        // The following options must be declared
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            // TODO(sestren): Add ability to turn room and stage-shuffling on or off independently of one another
            console.log(argv)
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                debugInfo: {
                    finalSeedsUsed: {},
                },
                description: [
                    'Shuffle various things',
                ],
                settings: {},
            }
            // Translate arguments into settings
            let seedName = argv.seed
            if (seedName) {
                shuffleData.settings.seedName = argv.seed
            }
            else {
                const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                seedName = getSeedName(seed)
            }
            shuffleData.debugInfo.seedName = seedName
            if (argv.hinter) {
                shuffleData.settings.hinter = argv.hinter
            }
            if (argv.musicShuffler?.on) {
                shuffleData.settings.musicShuffler = argv.musicShuffler
            }
            if (argv.patcher?.on) {
                shuffleData.settings.patcher = argv.patcher
            }
            if (argv.rewardShuffler?.on) {
                shuffleData.settings.rewardShuffler = argv.rewardShuffler
            }
            if (argv.roomShuffler?.on) {
                shuffleData.settings.roomShuffler = argv.roomShuffler
            }
            if (argv.stageShuffler?.on) {
                shuffleData.settings.stageShuffler = argv.stageShuffler
            }
            if (argv.solver?.on) {
                shuffleData.settings.solver = argv.solver
            }
            // Apply all enabled modules
            console.log('seedName:', seedName)
            // Patcher
            if (argv.patcher.on) {
                const patches = argv.patcher.list ?? []
                for (let i = 0; i < patches.length; i++) {
                    const patch = JSON.parse(fs.readFileSync(patches.at(i), 'utf8'))
                    for (let j = 0; j < patch.authors.length; j++) {
                        const element = patch.authors[j]
                        if (!shuffleData.authors.includes(element)) {
                            shuffleData.authors.push(element)
                        }
                    }
                    for (let j = 0; j < patch.description.length; j++) {
                        shuffleData.description.push(patch.description[j])
                    }
                    for (let j = 0; j < patch.changes.length; j++) {
                        shuffleData.changes.push(patch.changes[j])
                    }
                }
            }
            if (argv.musicShuffler?.on) {
                const seed = argv.musicShuffler.seed ?? (seedName + '.musicShuffler')
                const shuffledSongs = shuffleSongs(seed)
                const songChanges = getSongChanges(shuffledSongs)
                shuffleData.changes.push(songChanges)
                shuffleData.debugInfo.finalSeedsUsed.musicShuffler = seed
            }
            shuffleData.debugInfo.solverAttemptId = -1
            let changesToAdd = []
            let stageConnections = getVanillaStageLinks()
            let roomArrangements = {}
            let questRewards = {}
            let logicAnalysis = {
                solved: false,
                scenarios: [],
            }
            // Some modules (those that modify or depend on logic) must be run inside a loop because the solver must verify them
            while (!logicAnalysis.solved) {
                shuffleData.debugInfo.solverAttemptId += 1
                console.log('solverAttemptId:', shuffleData.debugInfo.solverAttemptId)
                changesToAdd = []
                if (argv.stageShuffler?.on) {
                    const seed = argv.stageShuffler.seed ?? (seedName + '.stageShuffler.' + shuffleData.debugInfo.solverAttemptId)
                    stageConnections = shuffleStages(seed)
                    const teleporterChanges = getTeleporterChanges(extraction, stageConnections.links)
                    changesToAdd.push(teleporterChanges)
                    shuffleData.debugInfo.finalSeedsUsed.stageShuffler = seed
                }
                const debug = {}
                if (argv.roomShuffler?.on || argv.stageShuffler?.on) {
                    let stageNodeGroups = {}
                    if (argv.roomShuffler?.on) {
                        const seed = argv.roomShuffler.seed ?? (seedName + '.roomShuffler.' + shuffleData.debugInfo.solverAttemptId)
                        shuffleData.debugInfo.finalSeedsUsed.stages = {}
                        STAGE_NAMES
                        .forEach((stageName) => {
                            let stageAttemptCount = 0
                            while (true) {
                                const stageSeed = seed + '.' + stageName + '.' + stageAttemptCount
                                // console.log('stageSeed:', stageSeed)
                                const shuffledRooms = shuffleRooms(stageSeed, stageName, true)
                                let validInd = true
                                if (stageName in VALIDATIONS) {
                                    // console.log('stageName:', stageName)
                                    validInd = VALIDATIONS[stageName]
                                    .every((validation) => {
                                        const logicSettings = {
                                            solverAttemptId: shuffleData.debugInfo.solverAttemptId,
                                            locationRewards: {},
                                            stageLinks: {},
                                            roomPositions: shuffledRooms.rooms,
                                        }
                                        return validate(logicSettings, validation)
                                    })
                                }
                                if (validInd) {
                                    stageNodeGroups[stageName] = shuffledRooms
                                    debug[stageName] = stageNodeGroups[stageName].cells
                                    shuffleData.debugInfo.finalSeedsUsed.stages[stageName] = stageSeed
                                    break
                                }
                                stageAttemptCount += 1
                            }
                        })
                        console.log('debug:', inspect(debug, { depth: 4 }))
                        shuffleData.debugInfo.finalSeedsUsed.roomShuffler = seed
                    }
                    else {
                        stageNodeGroups = getVanillaStageNodeGroups(extraction)
                    }
                    // Attach warpRooms to the stages they lead to
                    Object.entries(stageConnections.links)
                    .filter(([teleporterSource, teleporterTarget]) => {
                        return teleporterSource.startsWith('fromWarpRoomsTo')
                    })
                    .forEach(([teleporterSource, teleporterTarget]) => {
                        const stageName = TELEPORTERS[teleporterTarget].sourceStage
                        const targetStage = TELEPORTERS[teleporterTarget].targetStage
                        const roomName = 'loadingRoomTo' + targetStage.at(0).toUpperCase() + targetStage.slice(1)
                        // NOTE(sestren): Centering on the loading room is a reliable way to match the rooms without having to know the direction
                        let matchingRoomCount = 0
                        stageNodeGroups[stageName].rooms
                        .filter((roomInfo) => {
                            return (roomInfo.stage === stageName) && (roomInfo.room === roomName)
                        })
                        .forEach((roomInfo) => {
                            matchingRoomCount += 1
                            const rowOffset = roomInfo.row
                            const columnOffset = roomInfo.column - 1
                            const warpRoomGroupName = 'warpRoomTo' + teleporterSource.split('WarpRoomsTo').at(1)
                            const warpRoomGroup = NODE_GROUPS.warpRooms[warpRoomGroupName]
                            stageNodeGroups[stageName] = combineNodeGroups(stageNodeGroups[stageName], warpRoomGroup, rowOffset, columnOffset, { allowOverlaps: true })
                        })
                        if (matchingRoomCount < 1)  {
                            throw Error(`Room not found for stage '${stageName}' and room '${roomName}'`)
                        }
                    })
                    const seed = seedName + '.stageArranger'
                    roomArrangements = arrangeStages(seed, stageNodeGroups)
                    const roomChanges = getRoomChanges(roomArrangements.rooms, MIN_MAP_ROW, MIN_MAP_COL)
                    changesToAdd.push(roomChanges)
                }
                if (argv.rewardShuffler?.on) {
                    const seed = argv.rewardShuffler.seed ?? (seedName + '.rewardShuffler.' + shuffleData.debugInfo.solverAttemptId)
                    questRewards = shuffleRewards(seed)
                    const rewardChanges = getRewardChanges(questRewards.locations)
                    changesToAdd.push(rewardChanges)
                    shuffleData.debugInfo.finalSeedsUsed.rewardShuffler = seed
                }
                if (argv.solver?.on) {
                    console.log('seedsUsedWhenSolving', shuffleData.debugInfo.finalSeedsUsed)
                    shuffleData.debugInfo.solvable = false
                    const seed = argv.solver.seed ?? (seedName + '.solver.' + shuffleData.debugInfo.solverAttemptId)
                    const logicSettings = {
                        solverAttemptId: shuffleData.debugInfo.solverAttemptId,
                        locationRewards: questRewards.locations,
                        stageLinks: stageConnections.links,
                        roomPositions: roomArrangements.rooms,
                    }
                    const startingState = {
                        stage: 'castleEntrance',
                        room: 'afterDrawbridge',
                        section: 'main',
                        positionX: 136,
                        positionY: 640,
                        time: 120.0,
                        techniqueSolveBoxPuzzle: true,
                    }
                    logicAnalysis.scenarios = []
                    logicAnalysis.scenarios.push({
                        name: 'Start with no checks and verify that all checks are reachable',
                        result: analyzeLogic(logicSettings, {
                            startingState: startingState,
                            startingNodeTypes: [],
                            goalState: {},
                            goalNodeTypes: [
                                'check'
                            ],
                        }),
                    })
                    if (logicAnalysis.scenarios.at(-1).result.solved) {
                        logicAnalysis.scenarios.push({
                            name: 'Start with all checks and actions and verify that all warps are reachable',
                            result: analyzeLogic(logicSettings, {
                                startingState: startingState,
                                startingNodeTypes: [
                                    'check',
                                    'action',
                                ],
                                goalState: {
                                    statusWarpRoomToAbandonedMineUnlocked: true,
                                    statusWarpRoomToOuterWallUnlocked: true,
                                    statusWarpRoomToCastleKeepUnlocked: true,
                                    statusWarpRoomToOlroxsQuartersUnlocked: true,
                                },
                                goalNodeTypes: [],
                            }),
                        })
                        logicAnalysis.scenarios.push({
                            name: 'Start with all checks and verify that all actions are reachable',
                            result: analyzeLogic(logicSettings, {
                                startingState: startingState,
                                startingNodeTypes: [
                                    'check',
                                ],
                                goalState: {},
                                goalNodeTypes: [
                                    'action'
                                ],
                            }),
                        })
                    }
                    logicAnalysis.solved = logicAnalysis.scenarios
                    .every((scenario) => {
                        return scenario.result.solved
                    })
                    console.log('logicAnalysis:', inspect(logicAnalysis, { depth: 4 }))
                    console.log('')
                    shuffleData.debugInfo.solved = logicAnalysis.solved
                    shuffleData.debugInfo.finalSeedsUsed.solver = seed
                }
                else {
                    logicAnalysis.solved = true
                }
                if (shuffleData.debugInfo.solverAttemptId > argv.solver.maxAttempts)  {
                    console.log('Took too many attempts to solve, abandoning ...')
                    break
                }
            }
            // Add labels to map
            let mapPixels = MAP_PIXELS
            if (argv.hinter?.stageLinks && (
                argv.stageShuffler?.on || argv.roomShuffler?.on
            )) {
                mapPixels = getMapPixels(stageConnections.links, roomArrangements.rooms)
            }
            // Redraw map
            const mapGrid = []
            for (let row = 0; row < 256; row++) {
                const rowData = '0'.repeat(256)
                mapGrid.push(rowData)
            }
            roomArrangements.rooms
            .filter((roomInfo) => {
                return (
                    roomInfo.stage in mapPixels &&
                    roomInfo.room in mapPixels[roomInfo.stage]
                )
            })
            .forEach((roomInfo) => {
                for (let fillIndex = 0; fillIndex < mapPixels[roomInfo.stage][roomInfo.room].length; fillIndex++) {
                    const fillData = mapPixels[roomInfo.stage][roomInfo.room].at(fillIndex)
                    switch (fillData.command) {
                        case 'fillRect':
                            const pixelRow = 4 * (MIN_MAP_ROW + roomInfo.row) + fillData.parameters.top
                            const pixelColumn = 4 * (MIN_MAP_COL + roomInfo.column) + fillData.parameters.left
                            for (let rowOffset = 0; rowOffset < fillData.parameters.rows; rowOffset++) {
                                const leftSide = mapGrid.at(pixelRow + rowOffset).slice(0, pixelColumn)
                                const rightSide = mapGrid.at(pixelRow + rowOffset).slice(pixelColumn + fillData.parameters.columns)
                                mapGrid[pixelRow + rowOffset] = leftSide + fillData.parameters.colorIndex.repeat(fillData.parameters.columns) + rightSide
                            }
                            break
                        case 'drawGlyph':
                            fillData.parameters.glyph
                            .forEach((rowData, rowOffset) => {
                                Array.from(rowData)
                                .forEach((char, colOffset) => {
                                    if (char === '.') {
                                        return
                                    }
                                    const pixelRow = 4 * (MIN_MAP_ROW + roomInfo.row) + rowOffset + fillData.parameters.top
                                    const pixelColumn = 4 * (MIN_MAP_COL + roomInfo.column) + colOffset + fillData.parameters.left
                                    const leftSide = mapGrid.at(pixelRow).slice(0, pixelColumn)
                                    const rightSide = mapGrid.at(pixelRow).slice(pixelColumn + 1)
                                    mapGrid[pixelRow] = leftSide + fillData.parameters.colorIndex + rightSide
                                })
                            })
                            break
                        default:
                            console.log(`WARNING: Unknown value for command property: ${fillData.command}`)
                            break
                    }
                }
            })
            const mapChanges = {
                changeType: 'merge',
                merge: {
                    'castleMap.data=': mapGrid,
                },
            }
            changesToAdd.push(mapChanges)
            // Recalculate castle map reveals
            const cellsToReveal = new Map()
            let minRevealRow = 63
            let minRevealColumn = 63
            let maxRevealRow = 0
            let maxRevealColumn = 0
            for (let row = 0; row < mapGrid.length; row++) {
                for (let column = 0; column < mapGrid.at(row).length; column++) {
                    if (mapGrid.at(row).at(column) !== '0') {
                        const revealRow = Math.floor(row / 4)
                        const revealColumn = Math.floor(column / 4)
                        const cellToReveal = [revealRow, revealColumn].join(',')
                        cellsToReveal.set(cellToReveal, true)
                        minRevealRow = Math.min(minRevealRow, revealRow)
                        minRevealColumn = Math.min(minRevealColumn, revealColumn)
                        maxRevealRow = Math.max(maxRevealRow, revealRow)
                        maxRevealColumn = Math.max(maxRevealColumn, revealColumn)
                    }
                }
            }
            const bytesPerRow = Math.ceil((1 + maxRevealColumn - minRevealColumn) / 8)
            const revealRows = Math.min(64, (1 + maxRevealRow - minRevealRow), Math.floor(2432 / (8 * bytesPerRow)))
            const castleMapReveals = {
                bytesPerRow: bytesPerRow,
                grid: [],
                left: Math.max(0, 1 + maxRevealColumn - (bytesPerRow * 8)),
                rows: revealRows,
                top: Math.max(0, 1 + maxRevealRow - revealRows),
            }
            for (let row = 0; row < revealRows; row++) {
                castleMapReveals.grid.push(' '.repeat(8 * bytesPerRow))
            }
            cellsToReveal
            .forEach((value, key) => {
                const coordinate = key.split(',')
                const row = coordinate.at(0) - castleMapReveals.top
                const column = coordinate.at(1) - castleMapReveals.left
                if (
                    (row >= 0) &&
                    (row < castleMapReveals.rows) &&
                    (column >= 0) &&
                    (column < (8 * bytesPerRow))
                ) {
                    const leftSide = castleMapReveals.grid.at(row).slice(0, column)
                    const rightSide = castleMapReveals.grid.at(row).slice(column + 1)
                    castleMapReveals.grid[row] = leftSide + '#' + rightSide
                }
            })
            console.log('castleMapReveals:', inspect(castleMapReveals, { depth: 4 }))
            const mapRevealChanges = {
                changeType: 'merge',
                merge: {
                    'castleMapReveals.data=': castleMapReveals,
                },
            }
            console.log('mapRevealChanges:', mapRevealChanges)
            changesToAdd.push(mapRevealChanges)
            // Add hints to the file select menu
            if (argv.hinter?.seedName || argv.hinter?.settings) {
                const hintMessages = [
                    (argv.hinter?.seedName) ? seedName : '',
                    (argv.hinter?.settings) ? hashedObject(shuffleData.settings, ['seedName']) : '',
                ]
                const hintChanges = {
                    changeType: 'merge',
                    merge: {
                        'messages.richterModeInstructions1.data=': hintMessages.at(0),
                        'messages.richterModeInstructions2.data=': hintMessages.at(1),
                    },
                }
                changesToAdd.push(hintChanges)
            }
            // Transfer accumulated changes
            for (let index = 0; index < changesToAdd.length; index++) {
                shuffleData.changes.push(changesToAdd.at(index))
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // map
        command: 'map',
        describe: 'Customize castle map',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            // .option('shuffleRooms', {
            //     describe: 'Whether or not to shuffle how rooms within a stage connect',
            //     type: 'boolean',
            // })
            // .option('shuffleStages', {
            //     describe: 'Whether or not to shuffle the connections between stages (aka, teleporters)',
            //     type: 'boolean',
            // })
            .demandOption(['extraction'])
        },
        handler: (argv) => {
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            let seedName
            if (argv.seed) {
                seedName = argv.seed
            }
            else {
                const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                seedName = getSeedName(seed)
            }
            const stageNodeGroups = {}
            STAGE_NAMES
            .forEach((stageName) => {
                let stageAttemptCount = 0
                while (true) {
                    const stageSeed = seed + '.' + stageName + '.' + stageAttemptCount
                    console.log('stageSeed:', stageSeed)
                    const shuffledRooms = shuffleRooms(stageSeed, stageName, true)
                    let validInd = true
                    if (stageName in VALIDATIONS) {
                        // console.log('stageName:', stageName)
                        validInd = VALIDATIONS[stageName]
                        .every((validation) => {
                            console.log('validation:', validation)
                            console.log('stage:', validation.startingState.stage)
                            console.log('room:', validation.startingState.room)
                            const logicSettings = {
                                solverAttemptId: shuffleData.debugInfo.solverAttemptId,
                                locationRewards: {},
                                stageLinks: {},
                                roomPositions: shuffledRooms.rooms,
                            }
                            return validate(logicSettings, validation)
                        })
                    }
                    if (validInd) {
                        stageNodeGroups[stageName] = shuffledRooms
                        shuffleData.debugInfo.finalSeedsUsed.stages[stageName] = stageSeed
                        break
                    }
                    stageAttemptCount += 1
                }
            })
            const shuffledStages = shuffleStages(seedName + '.stageShuffler')
            // Attach warpRooms to the stages they lead to
            Object.entries(shuffledStages.links)
                .filter(([teleporterSource, teleporterTarget]) => {
                    return teleporterSource.startsWith('fromWarpRoomsTo')
                })
                .forEach(([teleporterSource, teleporterTarget]) => {
                    const stageName = TELEPORTERS[teleporterTarget].sourceStage
                    const targetStage = TELEPORTERS[teleporterTarget].targetStage
                    const roomName = 'loadingRoomTo' + targetStage.at(0).toUpperCase() + targetStage.slice(1)
                    // NOTE(sestren): Centering on the loading room is a reliable way to match the rooms without having to know the direction
                    let matchingRoomCount = 0
                    stageNodeGroups[stageName].rooms
                        .filter((roomInfo) => {
                            return (roomInfo.stage === stageName) && (roomInfo.room === roomName)
                        })
                        .forEach((roomInfo) => {
                            matchingRoomCount += 1
                            const rowOffset = roomInfo.row
                            const columnOffset = roomInfo.column - 1
                            const warpRoomGroupName = 'warpRoomTo' + teleporterSource.split('WarpRoomsTo').at(1)
                            const warpRoomGroup = NODE_GROUPS.warpRooms[warpRoomGroupName]
                            stageNodeGroups[stageName] = combineNodeGroups(stageNodeGroups[stageName], warpRoomGroup, rowOffset, columnOffset, { allowOverlaps: true })
                        })
                    if (matchingRoomCount < 1)  {
                        throw Error(`Room not found for stage '${stageName}' and room '${roomName}'`)
                    }
                })
            const stageArrangements = arrangeStages(seedName + '.stageArranger', stageNodeGroups)
            console.log('shuffledStages.links', shuffledStages.links)
            console.log('stageArrangements.rooms[castleEntrance]:', stageArrangements.rooms
                .filter((roomInfo) => {
                    return roomInfo.stage === 'castleEntrance'
                })
            )
            const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
            // TODO(sestren): Populate changes
            // changesToAdd.push(teleporterChanges)
        }
    })
    .command({ // seed
        command: 'seed',
        describe: 'Generate random seed name',
        builder: (yargs) => {
            return yargs
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .demandOption([])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const seedName = getSeedName(seed)
            console.log(seedName)
        }
    })
    .command({ // room
        command: 'room',
        describe: 'Shuffle rooms within stages',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .option('stage', {
                describe: 'Name of stage to shuffle rooms in',
                type: 'string',
            })
            .option('norm', {
                describe: 'Whether or not to apply normalization to room connections before shuffling',
                type: 'boolean',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle rooms',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledRooms = shuffleRooms(seed, argv.stage, argv.norm)
            console.log('shuffledRooms:', shuffledRooms)
            // const roomChanges = getRoomChanges(extraction, shuffledRooms.rooms, 16, 16)
            // shuffleData.changes.push(roomChanges)
            // fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // stage
        command: 'stage',
        describe: 'Shuffle connections between stages',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle teleporters',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledStages = shuffleStages(seed)
            const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
            shuffleData.changes.push(teleporterChanges)
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // music
        command: 'music',
        describe: 'Shuffle music',
        builder: (yargs) => {
            return yargs
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .demandOption(['out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle songs',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const shuffledSongs = shuffleSongs(seed)
            const songChanges = getSongChanges(shuffledSongs)
            shuffleData.changes.push(songChanges)
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // reward
        command: 'reward',
        describe: 'Shuffle rewards',
        builder: (yargs) => {
            return yargs
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .demandOption(['out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle rewards',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const shuffledRewards = shuffleRewards(seed)
            const rewardChanges = getRewardChanges(shuffledRewards.locations)
            shuffleData.changes.push(rewardChanges)
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .demandCommand(1)
    .help()
    .parse()