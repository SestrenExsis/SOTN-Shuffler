import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

function getMovement(requirementName, section, time) {
    const result = {
        section: section,
        outcome: {
            time: {
                add: time,
            },
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

function getRegion(section, left, top, width, height) {
    const result = {
        requirements: [
            {
                positionX: {
                    minimum: left,
                    maximum: left + width - 1,
                },
                positionY: {
                    minimum: top,
                    maximum: top + height - 1,
                },
            }
        ],
        outcome: {
            section: section,
        },
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
                getRegion('beneathTrapdoor', 112, 688, 32, 64),
                getRegion('main', 96, 608, 416, 64),
                getRegion('parapet', 192, 112, 192, 96),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 512 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -4.999),
                    ],
                },
                exitRightWithReverseShiftLine: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 512 + 256 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
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
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 768 + 24,
                        },
                    },
                    requirements: [
                        getMovement('fall', 'beneathTrapdoor', -1.999),
                    ],
                },
                fromBeneathTrapdoorToMain: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 160,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'beneathTrapdoor', -0.7),
                    ],
                },
                toParapet: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 288,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 160,
                        },
                        // section: 'parapet',
                    },
                    requirements: [
                        getMovement('batFormVertical', 'main', -7.5),
                        getMovement('poweredMistForm', 'main', -10.5),
                    ],
                },
                toBeneathTrapdoor: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 720,
                        },
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
                        positionX: {
                            operation: 'replace',
                            value: 304,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'parapet', -1.7),
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
                getRegion('top', 112, 16, 32, 48),
                getRegion('main', 208, 352, 48, 64),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 0 - 56,
                        },
                        statusDoubleJumpUsed: false,
                    },
                    requirements: [
                        getMovement('jump', 'upperLedge', -0.7),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 240,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'upperLedge', -1.999),
                    ],
                },
                toUpperLedge: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 32,
                        },
                        // section: 'upperLedge',
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'beneathTrapdoor', -1.999),
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
                getRegion('main', 0, 0, 1792, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 1792 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('ledge', 48, 48, 64, 48),
                getRegion('main', 48, 96, 208, 112),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toLedge: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 80,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 72,
                        },
                        // section: 'ledge',
                    },
                    requirements: [
                        getMovement('bladeDash', 'main', -1.999),
                        getMovement('risingUppercut', 'main', -1.999),
                        getMovement('doubleJump', 'main', -1.999),
                        getMovement('batFormDiagonal', 'main', -1.999),
                        getMovement('poweredMist', 'main', -1.999),
                        getMovement('wolfMistRise', 'main', -1.999),
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
                        positionX: {
                            operation: 'replace',
                            value: 232,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'ledge', -1.999),
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
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 1024, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 1024 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: -8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        // statusTookLogicalRisk: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('holeInCeiling', 96, 16, 32, 32),
                getRegion('secretPassage', 0, 352, 16, 64),
                getRegion('main', 0, 48, 768, 368),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 0 - 56,
                        },
                    },
                    requirements: [
                        getMovement('doubleJump', 'holeInCeiling', -1.999),
                        getMovement('batFormVertical', 'holeInCeiling', -1.999),
                        getMovement('risingUppercut', 'holeInCeiling', -1.999),
                        getMovement('poweredMistForm', 'holeInCeiling', -1.999),
                        getMovement('wolfMistRise', 'holeInCeiling', -1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 768 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 768 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'secretPassage', -1.999),
                    ],
                },
                fromMainToSecretPassage: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
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
                        positionX: {
                            operation: 'replace',
                            value: 64,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
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
                        positionX: {
                            operation: 'replace',
                            value: 112,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 176,
                        },
                        // section: 'holeInCeiling',
                    },
                    requirements: [
                        getMovement('batFormVertical', 'main', -1.999),
                        getMovement('poweredMist', 'main', -1.999),
                        getMovement('wolfMistRiseLong', 'main', -1.999),
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
                        positionX: {
                            operation: 'replace',
                            value: 112,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 176,
                        },
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'holeInCeiling', -1.999),
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
                getRegion('main', 32, 64, 224, 160),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 48, 1536, 176),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 1536 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('leftSide', 0, 48, 96, 64),
                getRegion('rightSide', 112, 64, 144, 144),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'leftSide', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'rightSide', -1.999),
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 80,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
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
                        positionX: {
                            operation: 'replace',
                            value: 224,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
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
                getRegion('highInTheAir', 32, 16, 192, 64),
                getRegion('upperLeftLedge', 0, 96, 64, 64),
                getRegion('main', 0, 352, 256, 128),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 0 - 56,
                        },
                    },
                    requirements: [
                        getMovement('doubleJump', 'highIntheAir', -1.999),
                        getMovement('batFormVertical', 'highIntheAir', -1.999),
                        getMovement('risingUppercut', 'highIntheAir', -1.999),
                        getMovement('poweredMistForm', 'highIntheAir', -1.999),
                        getMovement('wolfMistRise', 'highIntheAir', -1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toHighInTheAir: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 48,
                        },
                    },
                    requirements: [
                        getMovement('batFormVertical', 'main', -1.999),
                        getMovement('chainedRisingUppercuts', 'main', -1.999),
                        getMovement('multipleGravityJumps', 'main', -1.999),
                        getMovement('poweredMistForm', 'main', -1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', -1.999),
                        getMovement('batFormVertical', 'upperLeftLedge', -1.999),
                        getMovement('chainedRisingUppercuts', 'upperLeftLedge', -1.999),
                        getMovement('multipleGravityJumps', 'upperLeftLedge', -1.999),
                        getMovement('poweredMistForm', 'upperLeftLedge', -1.999),
                        getMovement('wolfMistRiseLong', 'upperLeftLedge', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 448,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', -1.999),
                        getMovement('basic', 'highInTheAir', -1.999),
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 32,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('fall', 'highInTheAir', -1.999),
                        getMovement('batFormVertical', 'main', -1.999),
                        getMovement('chainedRisingUppercuts', 'main', -1.999),
                        getMovement('poweredMistForm', 'main', -1.999),
                        getMovement('wolfMistRiseLong', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 96, 256, 64),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 256 + 24,
                        },
                    },
                    requirements: [
                        getMovement('fall', 'pit', -1.999),
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 224,
                        },
                    },
                    requirements: [
                        getMovement('fall', 'main', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 128,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('batFormVertical', 'pit', -1.999),
                        getMovement('chainedRisingUppercuts', 'pit', -1.999),
                        getMovement('multipleGravityJumps', 'pit', -1.999),
                        getMovement('poweredMistForm', 'pit', -1.999),
                        getMovement('wolfMistRise', 'pit', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 304, 672),
                getRegion('main', 304, 544, 208, 144),
                getRegion('upperRightLedge', 432, 96, 80, 64),
                getRegion('middleRightLedge', 464, 352, 48, 64),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 512 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', -1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 512 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'middleRightLedge', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 512 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 480,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                        // section: 'upperRightLedge',
                    },
                    requirements: [
                        getMovement('chainedRisingUppercuts', 'main', -1.999),
                        getMovement('batFormVertical', 'main', -1.999),
                        getMovement('poweredMist', 'main', -1.999),
                        getMovement('multipleGravityJumps', 'main', -1.999),
                        getMovement('wolfMistRise', 'main', -1.999),
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
                        positionX: {
                            operation: 'replace',
                            value: 488,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 384,
                        },
                        // section: 'middleRightLedge',
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', -1.999),
                        getMovement('batFormVertical', 'main', -1.999),
                        getMovement('poweredMist', 'main', -1.999),
                        getMovement('gravityJump', 'main', -1.999),
                        getMovement('wolfMistRise', 'main', -1.999),
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
                        positionX: {
                            operation: 'replace',
                            value: 480,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 640,
                        },
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'upperRightLedge', -1.999),
                        getMovement('fall', 'middleRightLedge', -1.999),
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
                getRegion('leftSide', 0, 0, 128, 256),
                getRegion('rightSide', 144, 0, 112, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('leftSide', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('rightSide', 'main', -1.999),
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 80,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
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
                        positionX: {
                            operation: 'replace',
                            value: 224,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 0 - 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: {
                            operation: 'replace',
                            value: 256 + 8,
                        },
                        positionY: {
                            operation: 'replace',
                            value: 128,
                        },
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
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
                getRegion('main', 0, 0, 256, 256),
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
                getRegion('main', 0, 0, 256, 256),
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
                getRegion('main', 0, 0, 256, 256),
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
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
    ],
}

function updateLogicWithOutcome(logic, outcome) {
    Object.entries(outcome)
    .forEach(([propertyKey, propertyInfo]) => {
        console.log(propertyKey, propertyInfo)
        switch (typeof propertyInfo) {
            case 'boolean':
            case 'number':
            case 'string':
                logic.state[propertyKey] = propertyInfo
                break
            case 'object':
                switch (propertyInfo.operation) {
                    case 'replace':
                        logic.state[propertyKey] = propertyInfo.value
                        break
                    case 'add':
                        if (!(propertyKey in logic.state)) {
                            logic.state[propertyKey] = 0
                        }
                        logic.state[propertyKey] += propertyInfo.value
                        break
                    default:
                        console.log('Unhandled key-value pair: ' + propertyKey + ', ' + propertyInfo)
                        break
                }
                break
            default:
                console.log('Unhandled key-value pair: ' + propertyKey + ', ' + propertyInfo)
                break
        }
    })
}

// Find the player's global position on the map
function getGlobalPosition(logic, settings) {
    const result = {
        x: 0,
        y: 0,
    }
    roomsInfo[logic.state.stage].find((roomInfo) => {
        if (roomInfo.roomInfo.roomName !== logic.state.room) {
            return false
        }
        settings.roomPositions.find((roomPosition) => {
            if (
                roomPosition.stage !== logic.state.stage ||
                roomPosition.room !== logic.state.room
            ) {
                return false
            }
            result.x = 256 * roomPosition.column + logic.state.positionX
            result.y = 256 * roomPosition.row + logic.state.positionY
        })
    })
    return result
}

// Update the player's room-relative position on the map and find their section
function updateRoomPosition(logic, settings) {
    settings.roomPositions.find((roomPosition) => {
        const roomRegion = {
            left: 256 * roomPosition.column,
            top: 256 * roomPosition.row,
        }
        if (
            logic.globalPosition.x < roomRegion.left ||
            logic.globalPosition.y < roomRegion.top
        ) {
            return false
        }
        roomsInfo[logic.state.stage]
        .find((roomInfo) => {
            if (roomInfo.roomInfo.roomName !== roomPosition.room) {
                return false
            }
            roomRegion.right = roomRegion.left + roomInfo.roomInfo.width
            roomRegion.bottom = roomRegion.top + roomInfo.roomInfo.height
            if (
                logic.globalPosition.x >= roomRegion.right ||
                logic.globalPosition.y >= roomRegion.bottom
            ) {
                return false
            }
            logic.state.room = roomInfo.roomInfo.roomName
            logic.state.positionX = logic.globalPosition.x - roomRegion.left
            logic.state.positionY = logic.globalPosition.y - roomRegion.top
            logic.state.section = 'NONE'
            // Use the first requirement that is satisfied
            roomInfo.regions
            .find((regionInfo) => {
                const validRequirement = Object.entries(regionInfo)
                .every(([propertyKey, propertyInfo]) => {
                    let stateValue
                    let validInd = true
                    switch (typeof propertyInfo) {
                        case 'boolean':
                            stateValue = false
                            if (propertyKey in logic.state) {
                                stateValue = logic.state[propertyKey]
                            }
                            validInd = (stateValue === propertyInfo)
                        case 'string':
                            stateValue = 'NONE'
                            if (propertyKey in logic.state) {
                                stateValue = logic.state[propertyKey]
                            }
                            validInd = (stateValue === propertyInfo)
                            break
                        case 'object':
                            stateValue = 0
                            if (propertyKey in logic.state) {
                                stateValue = logic.state[propertyKey]
                            }
                            if ('minimum' in propertyInfo) {
                                if (stateValue < propertyInfo.minimum) {
                                    validInd = false
                                }
                            }
                            if ('maximum' in propertyInfo) {
                                if (stateValue > propertyInfo.maximum) {
                                    validInd = false
                                }
                            }
                            break
                        default:
                            console.log('Unhandled key-value pair: ' + propertyKey + ', ' + propertyInfo)
                            break
                    }
                    return validInd
                })
                if (validRequirement) {
                    updateLogicWithOutcome(logic, regionInfo.outcome)
                    return true
                }
                return false
            })
            return true
        })
    })
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
    const logic = {
        state: {
            stage: 'castleEntrance',
            room: 'afterDrawbridge',
            positionX: 136,
            positionY: 640,
        },
    }
    // console.log('locationRewards:', settings.locationRewards)
    console.log('')
    console.log('init')
    console.log('logic:', logic)

    console.log('')
    console.log('getGlobalPosition')
    logic.globalPosition = getGlobalPosition(logic, settings)
    console.log('logic:', logic)

    console.log('')
    console.log('updateRoomPosition')
    updateRoomPosition(logic, settings)
    console.log('logic:', logic)

    // Use an arbitrary command
    const commandInfo = roomsInfo.castleEntrance[0].commands.exitRight
    const outcome = JSON.parse(JSON.stringify(commandInfo.outcome))
    Object.entries(commandInfo.requirements[0].outcome).forEach(([key, value]) => {
        outcome[key] = value
    })
    console.log('')
    console.log('outcome:', outcome)
    updateLogicWithOutcome(logic, outcome)
    console.log('logic:', logic)

    // Update the player's room-relative position on the map
    console.log('')
    console.log('getGlobalPosition')
    logic.globalPosition = getGlobalPosition(logic, settings)
    console.log('logic:', logic)
    console.log('')
    console.log('updateRoomPosition')
    updateRoomPosition(logic, settings)
    console.log('logic:', logic)
    // Update the player's section (set to 'NONE' if one can't be found)
            // roomInfo.regions.find((regionInfo) => {
            //     if (regionInfo.) {
            //         return false
            //     }
            // })
    if ((10 * rng()) < settings.solverAttemptCount) {
        result.solvable = true
    }
    console.log('')
    return result
}