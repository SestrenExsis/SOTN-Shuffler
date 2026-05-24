import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

const locationsInfo = {
    locationDemonCard: {
        outcome: {
            locationDemonCard: true,
        },
        requirements: [
            {
                stage: 'abandonedMine',
                room: 'demonCardRoom',
                positionX: 88,
                positionY: 185,
                locationDemonCard: false,
            },
        ],
    },
    locationBatCard: {
        outcome: {
            locationBatCard: true,
        },
        requirements: [
            {
                stage: 'alchemyLaboratory',
                room: 'batCardRoom',
                positionX: 120,
                positionY: 147,
                locationBatCard: false,
            },
        ],
    },
    locationCubeOfZoe: {
        outcome: {
            locationCubeOfZoe: true,
        },
        requirements: [
            {
                stage: 'castleEntrance',
                room: 'cubeOfZoeRoom',
                positionX: 272,
                positionY: 114,
                locationCubeOfZoe: false,
            },
        ],
    },
    locationPowerOfWolf: {
        outcome: {
            locationPowerOfWolf: true,
        },
        requirements: [
            {
                stage: 'castleEntrance',
                room: 'afterDrawbridge',
                positionX: 272,
                positionY: 192,
                locationPowerOfWolf: false,
            },
        ],
    },
    locationPowerOfMist: {
        outcome: {
            locationPowerOfMist: true,
        },
        requirements: [
            {
                stage: 'castleKeep',
                room: 'keepArea',
                positionX: 412,
                positionY: 1220,
                locationPowerOfMist: false,
            },
        ],
    },
    locationLeapStone: {
        outcome: {
            locationLeapStone: true,
        },
        requirements: [
            {
                stage: 'castleKeep',
                room: 'keepArea',
                positionX: 412,
                positionY: 1220,
                locationLeapStone: false,
            },
        ],
    },
    locationGhostCard: {
        outcome: {
            locationGhostCard: true,
        },
        requirements: [
            {
                stage: 'castleKeep',
                room: 'ghostCardRoom',
                positionX: 352,
                positionY: 672,
                locationGhostCard: false,
            },
        ],
    },
    locationSpikeBreaker: {
        outcome: {
            locationSpikeBreaker: true,
        },
        requirements: [
            {
                stage: 'catacombs',
                room: 'spikeBreakerRoom',
                positionX: 47,
                positionY: 153,
                locationSpikeBreaker: false,
            },
        ],
    },
    locationFireOfBat: {
        outcome: {
            locationFireOfBat: true,
        },
        requirements: [
            {
                stage: 'clockTower',
                room: 'fireOfBatRoom',
                positionX: 200,
                positionY: 196,
                locationFireOfBat: false,
            },
        ],
    },
    locationFormOfMist: {
        outcome: {
            locationFormOfMist: true,
        },
        requirements: [
            {
                stage: 'colosseum',
                room: 'topOfElevatorShaft',
                positionX: 232,
                positionY: 144,
                locationFormOfMist: false,
            },
        ],
    },
    locationGasCloud: {
        outcome: {
            locationGasCloud: true,
        },
        requirements: [
            {
                stage: 'floatingCatacombs',
                room: 'mormegilRoom',
                positionX: 32,
                positionY: 128,
                locationGasCloud: false,
            },
        ],
    },
    locationFaerieScroll: {
        outcome: {
            locationFaerieScroll: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'spellbookArea',
                positionX: 1680,
                positionY: 176,
                locationFaerieScroll: false,
            },
        ],
    },
    locationFaerieCard: {
        outcome: {
            locationFaerieCard: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'faerieCardRoom',
                positionX: 48,
                positionY: 177,
                locationFaerieCard: false,
            },
        ],
    },
    locationSoulOfBat: {
        outcome: {
            locationSoulOfBat: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'lesserDemonArea',
                positionX: 1056,
                positionY: 928,
                locationSoulOfBat: false,
            },
        ],
    },
    locationGravityBoots: {
        outcome: {
            locationGravityBoots: true,
        },
        requirements: [
            {
                stage: 'marbleGallery',
                room: 'gravityBootsRoom',
                positionX: 1168,
                positionY: 176,
                locationGravityBoots: false,
            },
        ],
    },
    locationSpiritOrb: {
        outcome: {
            locationSpiritOrb: true,
        },
        requirements: [
            {
                stage: 'marbleGallery',
                room: 'spiritOrbRoom',
                positionX: 128,
                positionY: 1008,
                locationSpiritOrb: false,
            },
        ],
    },
    locationSwordCard: {
        outcome: {
            locationSwordCard: true,
        },
        requirements: [
            {
                stage: 'olroxsQuarters',
                room: 'swordCardRoom',
                positionX: 368,
                positionY: 148,
                locationSwordCard: false,
            },
        ],
    },
    locationEchoOfBat: {
        outcome: {
            locationEchoOfBat: true,
        },
        requirements: [
            {
                stage: 'olroxsQuarters',
                room: 'echoOfBatRoom',
                positionX: 128,
                positionY: 148,
                locationEchoOfBat: false,
            },
        ],
    },
    locationSoulOfWolf: {
        outcome: {
            locationSoulOfWolf: true,
        },
        requirements: [
            {
                stage: 'outerWall',
                room: 'elevatorShaftRoom',
                positionX: 392,
                positionY: 808,
                locationSoulOfWolf: false,
            },
        ],
    },
    locationForceOfEcho: {
        outcome: {
            locationForceOfEcho: true,
        },
        requirements: [
            {
                stage: 'reverseCaverns',
                room: 'holySymbolRoom',
                positionX: 112,
                positionY: 128,
                locationForceOfEcho: false,
            },
        ],
    },
    locationSilverRing: {
        outcome: {
            locationSilverRing: true,
        },
        requirements: [
            {
                stage: 'royalChapel',
                room: 'silverRingRoom',
                positionX: 180,
                positionY: 164,
                locationSilverRing: false,
            },
        ],
    },
    locationHolySymbol: {
        outcome: {
            locationHolySymbol: true,
        },
        requirements: [
            {
                stage: 'undergroundCaverns',
                room: 'holySymbolRoom',
                positionX: 144,
                positionY: 180,
                locationHolySymbol: false,
            },
        ],
    },
    locationMermanStatue: {
        outcome: {
            locationMermanStatue: true,
        },
        requirements: [
            {
                stage: 'undergroundCaverns',
                room: 'mermanStatueRoom',
                positionX: 96,
                positionY: 176,
                locationMermanStatue: false,
            },
        ],
    },
}

const rewardsInfo = {
    relicSoulOfBat: {
        outcome: {
            relicSoulOfBat: true,
            progressionBatTransformation: true,
            progressionMidAirReset: true,
        },
        requirements: [
            {
                relicSoulOfBat: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicSoulOfBat: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicFireOfBat: {
        outcome: {
            relicFireOfBat: true,
        },
        requirements: [
            {
                relicFireOfBat: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicFireOfBat: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicEchoOfBat: {
        outcome: {
            relicEchoOfBat: true,
            progressionEcholocation: true,
        },
        requirements: [
            {
                relicEchoOfBat: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicEchoOfBat: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicForceOfEcho: {
        outcome: {
            relicForceOfEcho: true,
        },
        requirements: [
            {
                relicForceOfEcho: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicForceOfEcho: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicSoulOfWolf: {
        outcome: {
            relicSoulOfWolf: true,
            progressionMidAirReset: true,
            progressionWolfTransformation: true,
        },
        requirements: [
            {
                relicSoulOfWolf: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicSoulOfWolf: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicPowerOfWolf: {
        outcome: {
            progressionFasterWolfRunSpeed: true,
            relicPowerOfWolf: true,
        },
        requirements: [
            {
                relicPowerOfWolf: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicPowerOfWolf: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicSkillOfWolf: {
        outcome: {
            relicSkillOfWolf: true,
            progressionWolfChargeAttack: true,
            progressionWolfSwimMovement: true,
        },
        requirements: [
            {
                relicSkillOfWolf: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicSkillOfWolf: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicFormOfMist: {
        outcome: {
            relicFormOfMist: true,
            progressionMidAirReset: true,
            progressionMistTransformation: true,
        },
        requirements: [
            {
                relicFormOfMist: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicFormOfMist: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicPowerOfMist: {
        outcome: {
            relicPowerOfMist: true,
            progressionLongerMistDuration: true,
        },
        requirements: [
            {
                relicPowerOfMist: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicPowerOfMist: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicGasCloud: {
        outcome: {
            relicGasCloud: true,
        },
        requirements: [
            {
                relicGasCloud: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicGasCloud: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicCubeOfZoe: {
        outcome: {
            progressionItemMaterialization: true,
            relicCubeOfZoe: true,
        },
        requirements: [
            {
                relicCubeOfZoe: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicCubeOfZoe: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicSpiritOrb: {
        outcome: {
            relicSpiritOrb: true,
        },
        requirements: [
            {
                relicSpiritOrb: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicSpiritOrb: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicGravityBoots: {
        outcome: {
            relicGravityBoots: true,
            progressionGravityJump: true,
        },
        requirements: [
            {
                relicGravityBoots: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicGravityBoots: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicLeapStone: {
        outcome: {
            relicLeapStone: true,
            progressionDoubleJump: true,
            progressionMidAirReset: true,
        },
        requirements: [
            {
                relicLeapStone: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicLeapStone: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicHolySymbol: {
        outcome: {
            relicHolySymbol: true,
            progressionProtectionFromWater: true,
        },
        requirements: [
            {
                relicHolySymbol: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicHolySymbol: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicFaerieScroll: {
        outcome: {
            relicFaerieScroll: true,
        },
        requirements: [
            {
                relicFaerieScroll: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicFaerieScroll: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicJewelOfOpen: {
        outcome: {
            relicJewelOfOpen: true,
            progressionUnlockBlueDoors: true,
        },
        requirements: [
            {
                relicJewelOfOpen: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicJewelOfOpen: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicMermanStatue: {
        outcome: {
            relicMermanStatue: true,
            progressionSummonFerryman: true,
        },
        requirements: [
            {
                relicMermanStatue: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicMermanStatue: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicBatCard: {
        outcome: {
            relicBatCard: true,
        },
        requirements: [
            {
                relicBatCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicBatCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicGhostCard: {
        outcome: {
            relicGhostCard: true,
        },
        requirements: [
            {
                relicGhostCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicGhostCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicFaerieCard: {
        outcome: {
            relicFaerieCard: true,
        },
        requirements: [
            {
                relicFaerieCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicFaerieCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicDemonCard: {
        outcome: {
            relicDemonCard: true,
            progressionSummonDemonFamiliar: true,
        },
        requirements: [
            {
                relicDemonCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicDemonCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicSwordCard: {
        outcome: {
            relicSwordCard: true,
        },
        requirements: [
            {
                relicSwordCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicSwordCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicSpriteCard: {
        outcome: {
            relicSpriteCard: true,
        },
        requirements: [
            {
                relicSpriteCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicSpriteCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicNosedevilCard: {
        outcome: {
            relicNosedevilCard: true,
            progressionSummonDemonFamiliar: true,
        },
        requirements: [
            {
                relicNosedevilCard: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicNosedevilCard: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicHeartOfVlad: {
        outcome: {
            relicHeartOfVlad: true,
        },
        requirements: [
            {
                relicHeartOfVlad: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicHeartOfVlad: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicToothOfVlad: {
        outcome: {
            relicToothOfVlad: true,
        },
        requirements: [
            {
                relicToothOfVlad: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicToothOfVlad: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicRibOfVlad: {
        outcome: {
            relicRibOfVlad: true,
        },
        requirements: [
            {
                relicRibOfVlad: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicRibOfVlad: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicRingOfVlad: {
        outcome: {
            relicRingOfVlad: true,
        },
        requirements: [
            {
                relicRingOfVlad: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicRingOfVlad: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    relicEyeOfVlad: {
        outcome: {
            relicEyeOfVlad: true,
        },
        requirements: [
            {
                relicEyeOfVlad: false,
                time: {
                    cost: 3.0,
                },
            },
            {
                relicEyeOfVlad: false,
                techniqueQuickGrab: true,
                time: {
                    cost: 2.5,
                },
            },
        ],
    },
    itemSpikeBreaker: {
        outcome: {
            itemSpikeBreaker: 1,
        },
        requirements: [
            {
                time: {
                    cost: 1.0,
                },
            },
        ],
    },
    itemGoldRing: {
        outcome: {
            itemInscribedRing: 1,
        },
        requirements: [
            {
                time: {
                    cost: 1.0,
                },
            },
        ],
    },
    itemSilverRing: {
        outcome: {
            itemInscribedRing: 1,
        },
        requirements: [
            {
                time: {
                    cost: 1.0,
                },
            },
        ],
    },
}

// NOTE(sestren): The order of rooms within a stage is determined by their room index, and is important to the game for determining where to send you during room transitions
const roomsInfo = {
    castleEntrance: [
        { // afterDrawbridge
            roomInfo: {
                roomName: 'afterDrawbridge',
                height: 768,
                width: 512,
            },
            regions: [
                {
                    region: {
                        left: 112,
                        top: 688,
                        width: 32,
                        height: 64,
                    },
                    outcome: {
                        section: 'beneathTrapdoor',
                    },
                },
                {
                    region: {
                        left: 96,
                        top: 608,
                        width: 416,
                        height: 64,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
                {
                    region: {
                        left: 192,
                        top: 112,
                        width: 192,
                        height: 96,
                    },
                    outcome: {
                        section: 'parapet',
                    },
                },
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        {
                            section: 'main',
                            outcome: {
                                time: -4.999,
                                movement: 'walk',
                            },
                        },
                    ],
                },
                exitRightWithReverseShiftLine: {
                    outcome: {
                        positionX: 512 + 256 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        { // Reverse Shift Line using Heart Refresh
                            section: 'main',
                            techniqueReverseShiftLineUsingHeartRefresh: true,
                            outcome: {
                                time: -9.999,
                                movement: 'special',
                            },
                            itemHeartRefresh: {
                                cost: 1,
                            },
                        },
                        { // Reverse Shift Line using Heart Refresh and Duplicator
                            section: 'main',
                            techniqueReverseShiftLineUsingHeartRefresh: true,
                            outcome: {
                                time: -9.999,
                                movement: 'special',
                            },
                            itemHeartRefresh: {
                                minimum: 1,
                            },
                            itemDuplicator: {
                                minimum: 1,
                            },
                        },
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 768 + 24,
                    },
                    requirements: [
                        {
                            section: 'beneathTrapdoor',
                            outcome: {
                                time: -1.999,
                                movement: 'fall',
                            },
                        },
                    ],
                },
                fromBeneathTrapdoorToMain: {
                    outcome: {
                        positionX: 160,
                        positionY: 640,
                        // section: 'main',
                        statusDoubleJumpUsed: false, // Reset double jump after landing
                    },
                    requirements: [
                        {
                            section: 'beneathTrapdoor',
                            progressionDoubleJump: true,
                            statusDoubleJumpUsed: false,
                            outcome: {
                                time: -0.7,
                                movement: 'jump',
                            },
                        },
                    ],
                },
                fromMainToParapet: {
                    outcome: {
                        positionX: 288,
                        positionY: 160,
                        // section: 'parapet',
                    },
                    requirements: [
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            outcome: {
                                time: -7.5,
                                movement: 'batVertical',
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            outcome: {
                                time: -10.5,
                                movement: 'mist',
                            },
                        },
                    ],
                },
                fromMainToBeneathTrapdoor: {
                    outcome: {
                        positionX: 128,
                        positionY: 720,
                        // section: 'beneathTrapdoor',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusTrapdoorAfterDrawbridgeOpened: true,
                            outcome: {
                                time: -0.5,
                                movement: 'fall',
                            },
                        },
                    ],
                },
                fromParapetToMain: {
                    outcome: {
                        positionX: 304,
                        positionY: 640,
                        // section: 'main',
                    },
                    requirements: [
                        {
                            section: 'parapet',
                            outcome: {
                                time: -1.7,
                                movement: 'fall',
                            },
                        },
                    ],
                },
            },
        },
        { // dropUnderPortcullis
            roomInfo: {
                roomName: 'dropUnderPortcullis',
                height: 512,
                width: 256,
            },
            regions: [
                {
                    region: {
                        left: 112,
                        top: 16,
                        width: 32,
                        height: 48,
                    },
                    outcome: {
                        section: 'top',
                    },
                },
                {
                    region: {
                        left: 208,
                        top: 352,
                        width: 48,
                        height: 64,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: -56,
                        statusDoubleJumpUsed: false,
                    },
                    requirements: [
                        {
                            section: 'top',
                            outcome: {
                                time: -0.7,
                                movement: 'jump',
                            },
                        },
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        {
                            section: 'main',
                            outcome: {
                                time: -1.999,
                                movement: 'walk',
                            },
                        },
                    ],
                },
                fromTopToMain: {
                    outcome: {
                        positionX: 240,
                        positionY: 384,
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'top',
                            outcome: {
                                time: -1.999,
                                movement: 'fall',
                            },
                        },
                    ],
                },
                fromMainToTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 32,
                        section: 'top',
                    },
                    requirements: [
                        {
                            section: 'main',
                            outcome: {
                                time: -1.999,
                                movement: 'jump',
                            },
                        },
                    ],
                },
            },
        },
    ],
}

// 128, 704 (Normal Jump) -72, -120 if through a screen transition??
// 128, 640 (Double Jump) -124

const logic = {
    state: {
        stage: 'castleEntrance',
        room: 'afterDrawbridge',
        positionX: 136,
        positionY: 614,
    },
}
// {
//     solverAttemptCount: shuffleData.debugInfo.solverAttemptCount,
//     locationRewards: questRewards.locations,
//     stageLinks: stageConnections.links,
//     roomPositions: roomArrangements.rooms,
// }
export function analyzeLogic(seed, settings) {
    const rng = seedrandom(seed)
    const result = {
        solvable: false,
    }
    console.log('locationRewards:', settings.locationRewards)
    if ((10 * rng()) < settings.solverAttemptCount) {
        result.solvable = true
    }
    return result
}