import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

function getRequirement(requirementName, section, time) {
    const result = {
        section: section,
        outcome: {
            time: time,
        },
    }
    switch (requirementName) {
        case 'basic':
            result.outcome.movement = 'basic'
            break
        case 'batForm':
        case 'batFormDiagonal':
            result.progressionBatTransformation = true
            result.outcome.movement = 'batDiagonal'
            break
        case 'batFormHorizontal':
            result.progressionBatTransformation = true
            result.outcome.movement = 'batHorizontal'
            break
        case 'batFormVertical':
            result.progressionBatTransformation = true
            result.outcome.movement = 'batVertical'
            break
        case 'bladeDash':
            result.progressionBladeDash = true
            result.techniqueBladeDash = true
            result.outcome.movement = 'bladeDash'
            break
        case 'chainedRisingUppercuts':
            result.progressionRisingUppercut = true
            result.techniqueRisingUppercut = true
            result.techniqueChainedRisingUppercuts = true
            result.outcome.movement = 'risingUppercut'
            break
        case 'doubleJump':
            result.progressionDoubleJump = true
            result.statusDoubleJumpUsed = false
            result.outcome.movement = 'jump'
            result.outcome.statusDoubleJumpUsed = true
            break
        case 'doubleJumpAndLand':
            result.progressionDoubleJump = true
            result.statusDoubleJumpUsed = false
            result.outcome.movement = 'jump'
            result.outcome.statusDoubleJumpUsed = false
            break
        case 'fall':
            result.outcome.movement = 'fall'
            break
        case 'jump':
            result.outcome.movement = 'jump'
            break
        case 'poweredMist':
        case 'poweredMistForm':
            result.progressionMistTransformation = true
            result.progressionLongerMistDuration = true
            result.outcome.movement = 'mist'
            break
        case 'risingUppercut':
            result.progressionRisingUppercut = true
            result.techniqueRisingUppercut = true
            result.outcome.movement = 'risingUppercut'
            break
        case 'wolfMistRise':
        case 'wolfMistRiseShort':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueShortWolfMistRise = true
            result.outcome.movement = 'wolfMistRise'
            break
        case 'wolfMistRiseLong':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueLongWolfMistRise = true
            result.outcome.movement = 'wolfMistRise'
            break
        case 'wolfMistRiseVeryLong':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueVeryLongWolfMistRise = true
            result.outcome.movement = 'wolfMistRise'
            break
        default:
            result.outcome.movement = 'walk'
            break
    }
    return result
}

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
        { // 00 - afterDrawbridge
            roomInfo: {
                roomName: 'afterDrawbridge',
                width: 512,
                height: 768,
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
                        getRequirement('basic', 'main', -4.999),
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
                        getRequirement('fall', 'beneathTrapdoor', -1.999),
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
                        getRequirement('doubleJumpAndLand', 'beneathTrapdoor', -0.7),
                    ],
                },
                fromMainToParapet: {
                    outcome: {
                        positionX: 288,
                        positionY: 160,
                        // section: 'parapet',
                    },
                    requirements: [
                        getRequirement('batFormVertical', 'main', -7.5),
                        getRequirement('poweredMistForm', 'main', -10.5),
                    ],
                },
                fromMainToBeneathTrapdoor: {
                    outcome: {
                        positionX: 128,
                        positionY: 720,
                        // section: 'beneathTrapdoor',
                    },
                    requirements: [
                        { // Normal Movement with Trapdoor opened
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
                        getRequirement('fall', 'parapet', -1.7),
                    ],
                },
            },
        },
        { // 01 - dropUnderPortcullis
            roomInfo: {
                roomName: 'dropUnderPortcullis',
                width: 256,
                height: 512,
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
                        positionY: 0 - 56,
                        statusDoubleJumpUsed: false,
                    },
                    requirements: [
                        getRequirement('jump', 'upperLedge', -0.7),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 240,
                        positionY: 384,
                        // section: 'main',
                    },
                    requirements: [
                        getRequirement('fall', 'upperLedge', -1.999),
                    ],
                },
                toUpperLedge: {
                    outcome: {
                        positionX: 128,
                        positionY: 32,
                        // section: 'upperLedge',
                    },
                    requirements: [
                        getRequirement('doubleJumpAndLand', 'beneathTrapdoor', -1.999),
                    ],
                },
            },
        },
        { // 02 - zombieHallway
            roomInfo: {
                roomName: 'zombieHallway',
                width: 1792,
                height: 256,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 1792,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1792 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 03 - holyMailRoom
            roomInfo: {
                roomName: 'holyMailRoom',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 48,
                        top: 48,
                        width: 64,
                        height: 48,
                    },
                    outcome: {
                        section: 'ledge',
                    },
                },
                {
                    region: {
                        left: 48,
                        top: 96,
                        width: 208,
                        height: 112,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                toLedge: {
                    outcome: {
                        positionX: 80,
                        positionY: 72,
                        // section: 'ledge',
                    },
                    requirements: [
                        getRequirement('bladeDash', 'main', -1.999),
                        getRequirement('risingUppercut', 'main', -1.999),
                        getRequirement('doubleJump', 'main', -1.999),
                        getRequirement('batFormDiagonal', 'main', -1.999),
                        getRequirement('poweredMist', 'main', -1.999),
                        getRequirement('wolfMistRise', 'main', -1.999),
                        { // Precise Corner Mist
                            section: 'main',
                            progressionMistTransformation: true,
                            techniquePreciseCornerMist: true,
                            outcome: {
                                time: -1.999,
                                movement: 'mist',
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 232,
                        positionY: 128,
                        // section: 'main',
                    },
                    requirements: [
                        getRequirement('fall', 'ledge', -1.999),
                    ],
                },
            },
        },
        { // 04 - atticStaircase
            roomInfo: {
                roomName: 'atticStaircase',
                width: 256,
                height: 512,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 512,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 05 - atticHallway
            roomInfo: {
                roomName: 'atticHallway',
                width: 1024,
                height: 256,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 1024,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 06 - atticEntrance
            roomInfo: {
                roomName: 'atticEntrance',
                width: 256,
                height: 256,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: -8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 8,
                        // statusTookLogicalRisk: true,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 07 - mermanRoom
            roomInfo: {
                roomName: 'mermanRoom',
                width: 768,
                height: 512,
            },
            regions: [
                {
                    region: {
                        left: 96,
                        top: 16,
                        width: 32,
                        height: 32,
                    },
                    outcome: {
                        section: 'holeInCeiling',
                    },
                },
                {
                    region: {
                        left: 0,
                        top: 352,
                        width: 16,
                        height: 64,
                    },
                    outcome: {
                        section: 'secretPassage',
                    },
                },
                {
                    region: {
                        left: 0,
                        top: 48,
                        width: 768,
                        height: 368,
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
                        positionY: 0 - 56,
                    },
                    requirements: [
                        getRequirement('doubleJump', 'holeInCeiling', -1.999),
                        getRequirement('batFormVertical', 'holeInCeiling', -1.999),
                        getRequirement('risingUppercut', 'holeInCeiling', -1.999),
                        getRequirement('poweredMistForm', 'holeInCeiling', -1.999),
                        getRequirement('wolfMistRise', 'holeInCeiling', -1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'secretPassage', -1.999),
                    ],
                },
                fromMainToSecretPassage: {
                    outcome: {
                        positionX: 8,
                        positionY: 384,
                        // section: 'secretPassage',
                    },
                    requirements: [
                        { // After Opening Secret Passage
                            section: 'main',
                            progressionBatTransformation: true,
                            progressionWolfTransformation: true,
                            outcome: {
                                statusSecretWallInMermanRoomOpened: true,
                                time: -1.999,
                                movement: 'basic',
                            },
                        },
                    ],
                },
                fromSecretPassageToMain: {
                    outcome: {
                        positionX: 64,
                        positionY: 384,
                        // section: 'main',
                    },
                    requirements: [
                        { // After Opening Secret Passage
                            section: 'secretPassage',
                            statusSecretWallInMermanRoomOpened: true,
                            outcome: {
                                time: -1.999,
                                movement: 'basic',
                            },
                        },
                    ],
                },
                fromMainToHoleInCeiling: {
                    outcome: {
                        positionX: 112,
                        positionY: 176,
                        // section: 'holeInCeiling',
                    },
                    requirements: [
                        getRequirement('batFormVertical', 'main', -1.999),
                        getRequirement('poweredMist', 'main', -1.999),
                        getRequirement('wolfMistRiseLong', 'main', -1.999),
                        { // Dive Kicking off of the Bats
                            section: 'main',
                            progressionDoubleJump: true,
                            statusDoubleJumpUsed: false,
                            techniqueEnemyDiveKick: true,
                            outcome: {
                                statusDoubleJumpUsed: false, // Dive Kicking off of an enemy resets the Double Jump
                                time: -1.999,
                                movement: 'jump',
                            },
                        },
                    ],
                },
                fromHoleInCeilingToMain: {
                    outcome: {
                        positionX: 112,
                        positionY: 176,
                        // section: 'main',
                    },
                    requirements: [
                        getRequirement('fall', 'holeInCeiling', -1.999),
                    ],
                },
            },
        },
        { // 08 - jewelSwordRoom
            roomInfo: {
                roomName: 'jewelSwordRoom',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 32,
                        top: 64,
                        width: 224,
                        height: 160,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 09 - wargHallway
            roomInfo: {
                roomName: 'wargHallway',
                width: 1536,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 48,
                        width: 1536,
                        height: 176,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1536 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 10 - shortcutToUndergroundCaverns
            roomInfo: {
                roomName: 'shortcutToUndergroundCaverns',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 48,
                        width: 96,
                        height: 64,
                    },
                    outcome: {
                        section: 'leftSide',
                    },
                },
                {
                    region: {
                        left: 112,
                        top: 64,
                        width: 144,
                        height: 144,
                    },
                    outcome: {
                        section: 'rightSide',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'leftSide', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'rightSide', -1.999),
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 80,
                        positionY: 128,
                        // section: 'rightSide',
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'leftSide',
                            statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                            outcome: {
                                time: -1.999,
                                movement: 'basic',
                            },
                        },
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 224,
                        positionY: 128,
                        statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                        // section: 'leftSide',
                    },
                    requirements: [
                        { // Opening Path
                            section: 'rightSide',
                            outcome: {
                                time: -1.999,
                                movement: 'basic',
                            },
                        },
                    ],
                },
            },
        },
        { // 11 - meetingRoomWithDeath
            roomInfo: {
                roomName: 'meetingRoomWithDeath',
                width: 256,
                height: 512,
            },
            regions: [
                {
                    region: {
                        left: 32,
                        top: 16,
                        width: 192,
                        height: 64,
                    },
                    outcome: {
                        section: 'highInTheAir',
                    },
                },
                {
                    region: {
                        left: 0,
                        top: 96,
                        width: 64,
                        height: 64,
                    },
                    outcome: {
                        section: 'upperLeftLedge',
                    },
                },
                {
                    region: {
                        left: 0,
                        top: 352,
                        width: 256,
                        height: 128,
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
                        positionY: 0 - 56,
                    },
                    requirements: [
                        getRequirement('doubleJump', 'highIntheAir', -1.999),
                        getRequirement('batFormVertical', 'highIntheAir', -1.999),
                        getRequirement('risingUppercut', 'highIntheAir', -1.999),
                        getRequirement('poweredMistForm', 'highIntheAir', -1.999),
                        getRequirement('wolfMistRise', 'highIntheAir', -1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'upperLeftLedge', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                toHighInTheAir: {
                    outcome: {
                        positionX: 128,
                        positionY: 48,
                    },
                    requirements: [
                        getRequirement('batFormVertical', 'main', -1.999),
                        getRequirement('chainedRisingUppercuts', 'main', -1.999),
                        getRequirement('multipleGravityJumps', 'main', -1.999),
                        getRequirement('poweredMistForm', 'main', -1.999),
                        getRequirement('wolfMistRiseVeryLong', 'main', -1.999),
                        getRequirement('batFormVertical', 'upperLeftLedge', -1.999),
                        getRequirement('chainedRisingUppercuts', 'upperLeftLedge', -1.999),
                        getRequirement('multipleGravityJumps', 'upperLeftLedge', -1.999),
                        getRequirement('poweredMistForm', 'upperLeftLedge', -1.999),
                        getRequirement('wolfMistRiseLong', 'upperLeftLedge', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 128,
                        positionY: 448,
                    },
                    requirements: [
                        getRequirement('basic', 'upperLeftLedge', -1.999),
                        getRequirement('basic', 'highInTheAir', -1.999),
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: 32,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('fall', 'highInTheAir', -1.999),
                        getRequirement('batFormVertical', 'main', -1.999),
                        getRequirement('chainedRisingUppercuts', 'main', -1.999),
                        getRequirement('poweredMistForm', 'main', -1.999),
                        getRequirement('wolfMistRiseLong', 'main', -1.999),
                    ],
                },
            },
        },
        { // 12 - stairwellAfterDeath
            roomInfo: {
                roomName: 'stairwellAfterDeath',
                width: 256,
                height: 768,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 768,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 13 - gargoyleRoom
            roomInfo: {
                roomName: 'gargoyleRoom',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 96,
                        width: 256,
                        height: 64,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getRequirement('fall', 'pit', -1.999),
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 128,
                        positionY: 224,
                    },
                    requirements: [
                        getRequirement('fall', 'main', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 128,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('batFormVertical', 'pit', -1.999),
                        getRequirement('chainedRisingUppercuts', 'pit', -1.999),
                        getRequirement('multipleGravityJumps', 'pit', -1.999),
                        getRequirement('poweredMistForm', 'pit', -1.999),
                        getRequirement('wolfMistRise', 'pit', -1.999),
                    ],
                },
            },
        },
        { // 14 - heartMaxUpRoom
            roomInfo: {
                roomName: 'heartMaxUpRoom',
                width: 256,
                height: 256,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 15 - cubeOfZoeRoom
            roomInfo: {
                roomName: 'cubeOfZoeRoom',
                width: 512,
                height: 768,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 304,
                        height: 672,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 304,
                        top: 544,
                        width: 208,
                        height: 144,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
                {
                    region: {
                        left: 432,
                        top: 96,
                        width: 80,
                        height: 64,
                    },
                    outcome: {
                        section: 'upperRightLedge',
                    },
                },
                {
                    region: {
                        left: 464,
                        top: 352,
                        width: 48,
                        height: 64,
                    },
                    outcome: {
                        section: 'middleRightLedge',
                    },
                },
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'upperRightLedge', -1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getRequirement('basic', 'middleRightLedge', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 480,
                        positionY: 128,
                        // section: 'upperRightLedge',
                    },
                    requirements: [
                        getRequirement('chainedRisingUppercuts', 'main', -1.999),
                        getRequirement('batFormVertical', 'main', -1.999),
                        getRequirement('poweredMist', 'main', -1.999),
                        getRequirement('multipleGravityJumps', 'main', -1.999),
                        getRequirement('wolfMistRise', 'main', -1.999),
                        { // Main - Using Shortcut
                            section: 'main',
                            outcome: {
                                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                                time: -1.999,
                                movement: 'walk',
                            },
                        },
                    ],
                },
                toMiddleRightLedge: {
                    outcome: {
                        positionX: 488,
                        positionY: 384,
                        // section: 'middleRightLedge',
                    },
                    requirements: [
                        getRequirement('risingUppercut', 'main', -1.999),
                        getRequirement('batFormVertical', 'main', -1.999),
                        getRequirement('poweredMist', 'main', -1.999),
                        getRequirement('gravityJump', 'main', -1.999),
                        getRequirement('wolfMistRise', 'main', -1.999),
                        { // Main - Candle Dive Kick (Forgiving)
                            section: 'main',
                            progressionDoubleJump: true,
                            techniqueForgivingCandleDiveKick: true,
                            outcome: {
                                time: -1.999,
                                movement: 'jump',
                            },
                        },
                        { // Upper Right Ledge - Precise Fall and Precise Jump Using Shortcut
                            section: 'upperRightLedge',
                            techniquePreciseJump: true,
                            outcome: {
                                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                                time: -1.999,
                                movement: 'jump',
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 480,
                        positionY: 640,
                        // section: 'main',
                    },
                    requirements: [
                        getRequirement('fall', 'upperRightLedge', -1.999),
                        getRequirement('fall', 'middleRightLedge', -1.999),
                    ],
                },
                actionOpenShortcut: {
                    outcome: {
                        statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                    },
                    requirements: [
                        {
                            section: 'upperRightLedge',
                            outcome: {
                                statusPassageFromCastleEntranceToMarbleGalleryOpened: false,
                                time: -1.999,
                                movement: 'special',
                            },
                        },
                    ],
                },
            },
        },
        { // 16 - shortcutToWarpRooms
            roomInfo: {
                roomName: 'shortcutToWarpRooms',
                width: 256,
                height: 256,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 128,
                        height: 256,
                    },
                    outcome: {
                        section: 'leftSide',
                    },
                },
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 144,
                        top: 0,
                        width: 112,
                        height: 256,
                    },
                    outcome: {
                        section: 'rightSide',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('leftSide', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('rightSide', 'main', -1.999),
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 80,
                        positionY: 128,
                        statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                        // section: 'rightSide',
                    },
                    requirements: [
                        { // Opening Path
                            section: 'leftSide',
                            outcome: {
                                time: -1.999,
                                movement: 'basic',
                            },
                        },
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 224,
                        positionY: 128,
                        // section: 'leftSide',
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'rightSide',
                            statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                            outcome: {
                                time: -1.999,
                                movement: 'basic',
                            },
                        },
                    ],
                },
            },
        },
        { // 17 - lifeMaxUpRoom
            roomInfo: {
                roomName: 'lifeMaxUpRoom',
                width: 256,
                height: 256,
            },
            regions: [
                { // NOTE(sestren): This region has been intentionally over-simplified as a shortcut
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 21 - loadingRoomToMarbleGallery
            roomInfo: {
                roomName: 'loadingRoomToMarbleGallery',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 22 - loadingRoomToWarpRooms
            roomInfo: {
                roomName: 'loadingRoomToWarpRooms',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 23 - loadingRoomToAlchemyLaboratory
            roomInfo: {
                roomName: 'loadingRoomToAlchemyLaboratory',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 24 - loadingRoomToUndergroundCaverns
            roomInfo: {
                roomName: 'loadingRoomToUndergroundCaverns',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 22 - loadingRoomToWarpRooms
            roomInfo: {
                roomName: 'loadingRoomToWarpRooms',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 25 - saveRoomA
            roomInfo: {
                roomName: 'saveRoomA',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 26 - saveRoomB
            roomInfo: {
                roomName: 'saveRoomB',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 27 - saveRoomC
            roomInfo: {
                roomName: 'saveRoomC',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getRequirement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        { // 28 - triggerTeleporterToAlchemyLaboratory
            roomInfo: {
                roomName: 'triggerTeleporterToAlchemyLaboratory',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {},
        },
        { // 29 - triggerTeleporterToMarbleGallery
            roomInfo: {
                roomName: 'triggerTeleporterToMarbleGallery',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {},
        },
        { // 30 - triggerTeleporterToWarpRooms
            roomInfo: {
                roomName: 'triggerTeleporterToWarpRooms',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {},
        },
        { // 31 - triggerTeleporterToUndergroundCaverns
            roomInfo: {
                roomName: 'triggerTeleporterToUndergroundCaverns',
                width: 256,
                height: 256,
            },
            regions: [
                {
                    region: {
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256,
                    },
                    outcome: {
                        section: 'main',
                    },
                },
            ],
            commands: {},
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
// settings = {
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