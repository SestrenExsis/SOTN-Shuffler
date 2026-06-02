import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

function getMovement(requirementName, section, time) {
    const result = {
        section: section,
        costs: {
            time: time,
        },
    }
    switch (requirementName) {
        case 'basic':
            result.costs.movement = 'basic'
            break
        case 'batForm':
        case 'batFormDiagonal':
            result.progressionBatTransformation = true
            result.costs.movement = 'batDiagonal'
            break
        case 'batFormHorizontal':
            result.progressionBatTransformation = true
            result.costs.movement = 'batHorizontal'
            break
        case 'batFormVertical':
            result.progressionBatTransformation = true
            result.costs.movement = 'batVertical'
            break
        case 'bladeDash':
            result.progressionBladeDash = true
            result.techniqueBladeDash = true
            result.costs.movement = 'bladeDash'
            break
        case 'chainedRisingUppercuts':
            result.progressionRisingUppercut = true
            result.techniqueRisingUppercut = true
            result.techniqueChainedRisingUppercuts = true
            result.costs.movement = 'risingUppercut'
            break
        case 'doubleJump':
            result.progressionDoubleJump = true
            result.statusDoubleJumpUsed = false
            result.costs.movement = 'jump'
            result.costs.statusDoubleJumpUsed = true
            break
        case 'doubleJumpAndLand':
            result.progressionDoubleJump = true
            result.statusDoubleJumpUsed = false
            result.costs.movement = 'jump'
            result.costs.statusDoubleJumpUsed = false
            break
        case 'fall':
            result.costs.movement = 'fall'
            break
        case 'jump':
            result.costs.movement = 'jump'
            break
        case 'poweredMist':
        case 'poweredMistForm':
            result.progressionMistTransformation = true
            result.progressionLongerMistDuration = true
            result.costs.movement = 'mist'
            break
        case 'risingUppercut':
            result.progressionRisingUppercut = true
            result.techniqueRisingUppercut = true
            result.costs.movement = 'risingUppercut'
            break
        case 'wolfMistRise':
        case 'wolfMistRiseShort':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueShortWolfMistRise = true
            result.costs.movement = 'wolfMistRise'
            break
        case 'wolfMistRiseLong':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueLongWolfMistRise = true
            result.costs.movement = 'wolfMistRise'
            break
        case 'wolfMistRiseVeryLong':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueVeryLongWolfMistRise = true
            result.costs.movement = 'wolfMistRise'
            break
        default:
            result.costs.movement = 'walk'
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
            positionX: 88,
            positionY: 185,
            locationDemonCard: true,
        },
        requirements: [
            {
                stage: 'abandonedMine',
                room: 'demonCardRoom',
                locationDemonCard: false,
            },
        ],
    },
    locationBatCard: {
        outcome: {
            positionX: 120,
            positionY: 147,
            locationBatCard: true,
        },
        requirements: [
            {
                stage: 'alchemyLaboratory',
                room: 'batCardRoom',
                locationBatCard: false,
            },
        ],
    },
    locationCubeOfZoe: {
        outcome: {
            positionX: 272,
            positionY: 114,
            locationCubeOfZoe: true,
        },
        requirements: [
            {
                stage: 'castleEntrance',
                room: 'cubeOfZoeRoom',
                locationCubeOfZoe: false,
            },
        ],
    },
    locationPowerOfWolf: {
        outcome: {
            positionX: 272,
            positionY: 192,
            locationPowerOfWolf: true,
        },
        requirements: [
            {
                stage: 'castleEntrance',
                room: 'afterDrawbridge',
                locationPowerOfWolf: false,
            },
        ],
    },
    locationPowerOfMist: {
        outcome: {
            positionX: 412,
            positionY: 1220,
            locationPowerOfMist: true,
        },
        requirements: [
            {
                stage: 'castleKeep',
                room: 'keepArea',
                locationPowerOfMist: false,
            },
        ],
    },
    locationLeapStone: {
        outcome: {
            positionX: 412,
            positionY: 1220,
            locationLeapStone: true,
        },
        requirements: [
            {
                stage: 'castleKeep',
                room: 'keepArea',
                locationLeapStone: false,
            },
        ],
    },
    locationGhostCard: {
        outcome: {
            positionX: 352,
            positionY: 672,
            locationGhostCard: true,
        },
        requirements: [
            {
                stage: 'castleKeep',
                room: 'ghostCardRoom',
                locationGhostCard: false,
            },
        ],
    },
    locationSpikeBreaker: {
        outcome: {
            positionX: 47,
            positionY: 153,
            locationSpikeBreaker: true,
        },
        requirements: [
            {
                stage: 'catacombs',
                room: 'spikeBreakerRoom',
                locationSpikeBreaker: false,
            },
        ],
    },
    locationFireOfBat: {
        outcome: {
            positionX: 200,
            positionY: 196,
            locationFireOfBat: true,
        },
        requirements: [
            {
                stage: 'clockTower',
                room: 'fireOfBatRoom',
                locationFireOfBat: false,
            },
        ],
    },
    locationFormOfMist: {
        outcome: {
            positionX: 232,
            positionY: 144,
            locationFormOfMist: true,
        },
        requirements: [
            {
                stage: 'colosseum',
                room: 'topOfElevatorShaft',
                locationFormOfMist: false,
            },
        ],
    },
    locationGasCloud: {
        outcome: {
            positionX: 32,
            positionY: 128,
            locationGasCloud: true,
        },
        requirements: [
            {
                stage: 'floatingCatacombs',
                room: 'mormegilRoom',
                locationGasCloud: false,
            },
        ],
    },
    locationFaerieScroll: {
        outcome: {
            positionX: 1680,
            positionY: 176,
            locationFaerieScroll: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'spellbookArea',
                locationFaerieScroll: false,
            },
        ],
    },
    locationFaerieCard: {
        outcome: {
            positionX: 48,
            positionY: 177,
            locationFaerieCard: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'faerieCardRoom',
                locationFaerieCard: false,
            },
        ],
    },
    locationSoulOfBat: {
        outcome: {
            positionX: 1056,
            positionY: 928,
            locationSoulOfBat: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'lesserDemonArea',
                locationSoulOfBat: false,
            },
        ],
    },
    locationGravityBoots: {
        outcome: {
            positionX: 1168,
            positionY: 176,
            locationGravityBoots: true,
        },
        requirements: [
            {
                stage: 'marbleGallery',
                room: 'gravityBootsRoom',
                locationGravityBoots: false,
            },
        ],
    },
    locationSpiritOrb: {
        outcome: {
            positionX: 128,
            positionY: 1008,
            locationSpiritOrb: true,
        },
        requirements: [
            {
                stage: 'marbleGallery',
                room: 'spiritOrbRoom',
                locationSpiritOrb: false,
            },
        ],
    },
    locationSwordCard: {
        outcome: {
            positionX: 368,
            positionY: 148,
            locationSwordCard: true,
        },
        requirements: [
            {
                stage: 'olroxsQuarters',
                room: 'swordCardRoom',
                locationSwordCard: false,
            },
        ],
    },
    locationEchoOfBat: {
        outcome: {
            positionX: 128,
            positionY: 148,
            locationEchoOfBat: true,
        },
        requirements: [
            {
                stage: 'olroxsQuarters',
                room: 'echoOfBatRoom',
                locationEchoOfBat: false,
            },
        ],
    },
    locationSoulOfWolf: {
        outcome: {
            positionX: 392,
            positionY: 808,
            locationSoulOfWolf: true,
        },
        requirements: [
            {
                stage: 'outerWall',
                room: 'elevatorShaftRoom',
                locationSoulOfWolf: false,
            },
        ],
    },
    locationForceOfEcho: {
        outcome: {
            positionX: 112,
            positionY: 128,
            locationForceOfEcho: true,
        },
        requirements: [
            {
                stage: 'reverseCaverns',
                room: 'holySymbolRoom',
                locationForceOfEcho: false,
            },
        ],
    },
    locationSilverRing: {
        outcome: {
            positionX: 180,
            positionY: 164,
            locationSilverRing: true,
        },
        requirements: [
            {
                stage: 'royalChapel',
                room: 'silverRingRoom',
                locationSilverRing: false,
            },
        ],
    },
    locationHolySymbol: {
        outcome: {
            positionX: 144,
            positionY: 180,
            locationHolySymbol: true,
        },
        requirements: [
            {
                stage: 'undergroundCaverns',
                room: 'holySymbolRoom',
                locationHolySymbol: false,
            },
        ],
    },
    locationMermanStatue: {
        outcome: {
            positionX: 96,
            positionY: 176,
            locationMermanStatue: true,
        },
        requirements: [
            {
                stage: 'undergroundCaverns',
                room: 'mermanStatueRoom',
                locationMermanStatue: false,
            },
        ],
    },
}

const COST_PICKUP_ITEM = 1.0
const COST_PICKUP_RELIC = 3.0
const COST_QUICKGRAB_RELIC = 2.5

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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicSoulOfBat: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicFireOfBat: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicEchoOfBat: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicForceOfEcho: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicSoulOfWolf: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicPowerOfWolf: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicSkillOfWolf: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicFormOfMist: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicPowerOfMist: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicGasCloud: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicCubeOfZoe: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicSpiritOrb: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicGravityBoots: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicLeapStone: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicHolySymbol: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicFaerieScroll: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicJewelOfOpen: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicMermanStatue: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicBatCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicGhostCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicFaerieCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicDemonCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicSwordCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicSpriteCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicNosedevilCard: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicHeartOfVlad: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicToothOfVlad: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicRibOfVlad: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicRingOfVlad: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_RELIC,
                },
            },
            {
                relicEyeOfVlad: false,
                techniqueQuickGrab: true,
                costs: {
                    time: COST_QUICKGRAB_RELIC,
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
                costs: {
                    time: COST_PICKUP_ITEM,
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
                costs: {
                    time: COST_PICKUP_ITEM,
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
                costs: {
                    time: COST_PICKUP_ITEM,
                },
            },
        ],
    },
}

// {
//     section: 'main',
//     costs: {
//         time: 1.999,
//         movement: 'walk',
//     },
// },

const roomPriority = {
    castleEntrance: [
        'afterDrawbridge',
        'dropUnderPortcullis',
        'zombieHallway',
        'holyMailRoom',
        'atticStaircase',
        'atticEntrance',
        'mermanRoom',
        'jewelSwordRoom',
        'wargHallway',
        'shortcutToUndergroundCaverns',
        'meetingRoomWithDeath',
        'stairwellAfterDeath',
        'gargoyleRoom',
        'heartMaxUpRoom',
        'cubeOfZoeRoom',
        'shortcutToWarpRooms',
        'lifeMaxUpRoom',
        'loadingRoomToMarbleGallery',
        'loadingRoomToWarpRooms',
        'loadingRoomToAlchemyLaboratory',
        'loadingRoomToUndergroundCaverns',
        'saveRoomA',
        'saveRoomB',
        'saveRoomC',
        'triggerTeleporterToAlchemyLaboratory',
        'triggerTeleporterToMarbleGallery',
        'triggerTeleporterToWarpRooms',
        'triggerTeleporterToUndergroundCaverns',
    ]
}

const roomsInfo = {
    castleEntrance: {
        afterDrawbridge: {
            roomInfo: {
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
                        positionX: 512 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', -4.999),
                    ],
                },
                exitRightWithReverseShiftLine: {
                    outcome: {
                        positionX: 512 + 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        { // Reverse Shift Line using Heart Refresh
                            section: 'main',
                            techniqueReverseShiftLineUsingHeartRefresh: true,
                            costs: {
                                time: -9.999,
                                itemHeartRefresh: 1
                            },
                        },
                        { // Reverse Shift Line using Heart Refresh and Duplicator
                            section: 'main',
                            techniqueReverseShiftLineUsingHeartRefresh: true,
                            costs: {
                                time: -9.999,
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
                        getMovement('fall', 'beneathTrapdoor', -1.999),
                    ],
                },
                fromBeneathTrapdoorToMain: {
                    outcome: {
                        positionX: 160,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'beneathTrapdoor', -0.7),
                    ],
                },
                toParapet: {
                    outcome: {
                        positionX: 288,
                        positionY: 160,
                    },
                    requirements: [
                        getMovement('batFormVertical', 'main', -7.5),
                        getMovement('poweredMistForm', 'main', -10.5),
                    ],
                },
                toBeneathTrapdoor: {
                    outcome: {
                        positionX: 128,
                        positionY: 720,
                    },
                    requirements: [
                        { // Normal Movement with Trapdoor opened
                            section: 'main',
                            statusTrapdoorAfterDrawbridgeOpened: true,
                            costs: {
                                time: -0.5,
                            },
                        },
                    ],
                },
                fromParapetToMain: {
                    outcome: {
                        positionX: 304,
                        positionY: 640,
                        // section: main,
                    },
                    requirements: [
                        getMovement('fall', 'parapet', -1.7),
                    ],
                },
            },
        },
        dropUnderPortcullis: {
            roomInfo: {
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
                        positionX: 128,
                        positionY: 0 - 56,
                        statusDoubleJumpUsed: false,
                    },
                    requirements: [
                        getMovement('jump', 'upperLedge', -0.7),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 240,
                        positionY: 384,
                        // section: main,
                    },
                    requirements: [
                        getMovement('fall', 'upperLedge', -1.999),
                    ],
                },
                toUpperLedge: {
                    outcome: {
                        positionX: 128,
                        positionY: 32,
                        // section: upperLedge,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'beneathTrapdoor', -1.999),
                    ],
                },
            },
        },
        zombieHallway: {
            roomInfo: {
                width: 1792,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1792, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1792 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        holyMailRoom: {
            roomInfo: {
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
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toLedge: {
                    outcome: {
                        positionX: 80,
                        positionY: 72,
                        // section: ledge,
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
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 232,
                        positionY: 128,
                        // section: main,
                    },
                    requirements: [
                        getMovement('fall', 'ledge', -1.999),
                    ],
                },
            },
        },
        atticStaircase: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        atticHallway: {
            roomInfo: {
                width: 1024,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1024, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        atticEntrance: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: -8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 8,
                        // statusTookLogicalRisk: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        mermanRoom: {
            roomInfo: {
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
                        positionX: 128,
                        positionY: 0 - 56,
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
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'secretPassage', -1.999),
                    ],
                },
                openSecretPassage: {
                    outcome: {
                        statusSecretWallInMermanRoomOpened: true,
                    },
                    requirements: [
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            progressionWolfTransformation: true,
                            statusSecretWallInMermanRoomOpened: false,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                fromMainToSecretPassage: {
                    outcome: {
                        positionX: 8,
                        positionY: 384,
                        // section: secretPassage,
                    },
                    requirements: [
                        { // After Opening Secret Passage
                            section: 'main',
                            statusSecretWallInMermanRoomOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                fromSecretPassageToMain: {
                    outcome: {
                        positionX: 64,
                        positionY: 384,
                        // section: main,
                    },
                    requirements: [
                        { // After Opening Secret Passage
                            section: 'secretPassage',
                            statusSecretWallInMermanRoomOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                fromMainToHoleInCeiling: {
                    outcome: {
                        positionX: 112,
                        positionY: 176,
                        // section: holeInCeiling,
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
                            costs: {
                                time: -1.999,
                            },
                            // Dive Kicking off of an enemy resets the Double Jump
                        },
                    ],
                },
                fromHoleInCeilingToMain: {
                    outcome: {
                        positionX: 112,
                        positionY: 176,
                        // section: main,
                    },
                    requirements: [
                        getMovement('fall', 'holeInCeiling', -1.999),
                    ],
                },
            },
        },
        jewelSwordRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 32, 64, 224, 160),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        wargHallway: {
            roomInfo: {
                width: 1536,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 48, 1536, 176),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1536 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        shortcutToUndergroundCaverns: {
            roomInfo: {
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
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftSide', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'rightSide', -1.999),
                    ],
                },
                openShortcut: {
                    outcome: {
                        statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                    },
                    requirements: [
                        {
                            section: 'rightSide',
                            statusPassageFromCastleEntranceToUndergroundCavernsOpened: false,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 80,
                        positionY: 128,
                        // section: rightSide,
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'leftSide',
                            statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 224,
                        positionY: 128,
                        // section: leftSide,
                    },
                    requirements: [
                        { // Opening Path
                            section: 'rightSide',
                            statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
            },
        },
        meetingRoomWithDeath: {
            roomInfo: {
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
                        positionX: 128,
                        positionY: 0 - 56,
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
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toHighInTheAir: {
                    outcome: {
                        positionX: 128,
                        positionY: 48,
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
                        positionX: 128,
                        positionY: 448,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', -1.999),
                        getMovement('basic', 'highInTheAir', -1.999),
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: 32,
                        positionY: 128,
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
        stairwellAfterDeath: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        gargoyleRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 96, 256, 64),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('fall', 'pit', -1.999),
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 128,
                        positionY: 224,
                    },
                    requirements: [
                        getMovement('fall', 'main', -1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 128,
                        positionY: 128,
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
        heartMaxUpRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        cubeOfZoeRoom: {
            roomInfo: {
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
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', -1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'middleRightLedge', -1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 480,
                        positionY: 128,
                        // section: upperRightLedge,
                    },
                    requirements: [
                        getMovement('chainedRisingUppercuts', 'main', -1.999),
                        getMovement('batFormVertical', 'main', -1.999),
                        getMovement('poweredMist', 'main', -1.999),
                        getMovement('multipleGravityJumps', 'main', -1.999),
                        getMovement('wolfMistRise', 'main', -1.999),
                        { // Main - Using Shortcut
                            section: 'main',
                            statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                toMiddleRightLedge: {
                    outcome: {
                        positionX: 488,
                        positionY: 384,
                        // section: middleRightLedge,
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
                            costs: {
                                time: -1.999,
                            },
                        },
                        { // Upper Right Ledge - Precise Fall and Precise Jump Using Shortcut
                            section: 'upperRightLedge',
                            techniquePreciseJump: true,
                            statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 480,
                        positionY: 640,
                        // section: main,
                    },
                    requirements: [
                        getMovement('fall', 'upperRightLedge', -1.999),
                        getMovement('fall', 'middleRightLedge', -1.999),
                    ],
                },
                openShortcut: {
                    outcome: {
                        statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                    },
                    requirements: [
                        {
                            section: 'upperRightLedge',
                            statusPassageFromCastleEntranceToMarbleGalleryOpened: false,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
            },
        },
        shortcutToWarpRooms: {
            roomInfo: {
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
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('leftSide', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('rightSide', 'main', -1.999),
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 80,
                        positionY: 128,
                        // section: rightSide,
                    },
                    requirements: [
                        { // Opening Path
                            section: 'leftSide',
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 224,
                        positionY: 128,
                        // section: leftSide,
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'rightSide',
                            statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
                openShortcut: {
                    outcome: {
                        statusPassageFromCastleEntranceToWarpRoomsOpened: false,
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'leftSide',
                            statusPassageFromCastleEntranceToWarpRoomsOpened: false,
                            costs: {
                                time: -1.999,
                            },
                        },
                    ],
                },
            },
        },
        lifeMaxUpRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        loadingRoomToMarbleGallery: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        loadingRoomToWarpRooms: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        loadingRoomToAlchemyLaboratory: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        loadingRoomToUndergroundCaverns: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        saveRoomA: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        saveRoomB: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        saveRoomC: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', -1.999),
                    ],
                },
            },
        },
        triggerTeleporterToAlchemyLaboratory: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToMarbleGallery: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToWarpRooms: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToUndergroundCaverns: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
    },
}

function updateStateWithOutcome(state, outcome) {
    // console.log('state:', state)
    // console.log('outcome:', outcome)
    Object.entries(outcome)
    .forEach(([propertyKey, propertyInfo]) => {
        console.log(JSON.stringify(propertyKey), JSON.stringify(propertyInfo))
        switch (typeof propertyInfo) {
            case 'boolean':
            case 'number':
            case 'string':
                state[propertyKey] = propertyInfo
                break
            case 'object':
                // Objects are assumed to modify numbers
                switch (propertyInfo.operation) {
                    case 'replace':
                        state[propertyKey] = propertyInfo.value
                        break
                    case 'add':
                        if (!(propertyKey in state)) {
                            state[propertyKey] = 0
                        }
                        state[propertyKey] += propertyInfo.value
                        break
                    default:
                        console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                        break
                }
                break
            default:
                console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                break
        }
    })
    // console.log('state:', state)
}

function getRoomDimensions(roomPositions) {
    const result = {}
    Object.entries(roomsInfo)
    .forEach(([stageName, stageInfo]) => {
        if (!(stageName in result)) {
            result[stageName] = {}
        }
        Object.entries(stageInfo)
        .forEach(([roomName, roomInfo]) => {
            if (!(roomName in result[stageName])) {
                result[stageName][roomName] = {
                    width: roomInfo.roomInfo.width,
                    height: roomInfo.roomInfo.height,
                }
            }
        })
    })
    roomPositions
    .filter((roomPosition) => {
        const validInd = (
            roomPosition.stage in result && 
            roomPosition.room in result[roomPosition.stage]
        )
        return validInd
    })
    .forEach((roomPosition) => {
        const roomInfo = result[roomPosition.stage][roomPosition.room]
        roomInfo.left = 256 * roomPosition.column
        roomInfo.top = 256 * roomPosition.row
        roomInfo.right = roomInfo.left + roomInfo.width
        roomInfo.bottom = roomInfo.top + roomInfo.height
    })
    return result
}

function processLocation(state, settings) {
    const result = {
        stage: state.stage,
        room: state.room,
        section: state.section,
        positionX: state.positionX,
        positionY: state.positionY,
    }
    // Calculate global position
    const globalPosition = {
        x: 0,
        y: 0,
    }
    settings.roomPositions
    .find((roomPosition) => {
        if (
            roomPosition.stage === result.stage &&
            roomPosition.room === result.room
        ) {
            globalPosition.x = 256 * roomPosition.column + result.positionX
            globalPosition.y = 256 * roomPosition.row + result.positionY
            return true
        }
        return false
    })
    const roomDimensions = getRoomDimensions(settings.roomPositions)
    // Find first room in the priority list that overlaps the global position
    roomPriority[result.stage]
    .find((roomName) => {
        const roomDimension = roomDimensions[result.stage][roomName]
        if (
            globalPosition.x >= roomDimension.left &&
            globalPosition.x < roomDimension.right &&
            globalPosition.y >= roomDimension.top &&
            globalPosition.y < roomDimension.bottom
        ) {
            result.room = roomName
            result.positionX = globalPosition.x - roomDimension.left
            result.positionY = globalPosition.y - roomDimension.top
            return true
        }
        return false
    })
    // Find first section that satisfies requirements for the room-relative position
    roomsInfo[result.stage][result.room].regions
    .find((regionInfo) => {
        result.section = 'NONE'
        const validRequirement = Object.entries(regionInfo)
        .every(([propertyKey, propertyInfo]) => {
            let validInd = true
            let stateValue
            switch (typeof propertyInfo) {
                case 'boolean':
                    stateValue = false
                    if (propertyKey in result) {
                        stateValue = result[propertyKey]
                    }
                    validInd = (stateValue === propertyInfo)
                case 'string':
                    stateValue = 'NONE'
                    if (propertyKey in result) {
                        stateValue = result[propertyKey]
                    }
                    validInd = (stateValue === propertyInfo)
                    break
                case 'object':
                    stateValue = 0
                    if (propertyKey in result) {
                        stateValue = result[propertyKey]
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
                    console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                    break
            }
            return validInd
        })
        if (validRequirement) {
            updateStateWithOutcome(result, regionInfo.outcome)
            return true
        }
        return false
    })
    return result
}

// Whenever the player's positionX or postionY are updated,
// check if their section changes, and 
// if they are outside the bounds of the room

function getPreprocessedLogic(settings) {
    const result = {
        global: {},
    }
    // For every room command, preprocess the outcome
    Object.entries(roomsInfo)
    .forEach(([stageName, stageInfo]) => {
        result[stageName] = {}
        Object.entries(stageInfo)
        .forEach(([roomName, roomInfo]) => {
            result[stageName][roomName] = []
            Object.entries(roomInfo.commands)
            .forEach(([commandName, commandInfo]) => {
                commandInfo.requirements
                .forEach((requirementInfo) => {
                    const currentState = {
                        stage: stageName,
                        room: roomName,
                        section: 'NONE',
                        positionX: 0,
                        positionY: 0,
                    }
                    let nextState = JSON.parse(JSON.stringify(currentState))
                    updateStateWithOutcome(nextState, commandInfo.outcome)
                    nextState = processLocation(nextState, settings)
                    const command = {
                        outcome: {},
                        requirement: {},
                    }
                    Object.entries(nextState)
                    .forEach(([propertyKey, propertyInfo]) => {
                        if (propertyKey in currentState) {
                            // Properties in current state are all location-based
                            if (propertyInfo != currentState[propertyKey])
                            {
                                command.outcome[propertyKey] = propertyInfo
                            }
                        }
                        else {
                            command.outcome[propertyKey] = commandInfo.outcome[propertyKey]
                        }
                    })
                    Object.entries(requirementInfo)
                    .forEach(([propertyKey, propertyInfo]) => {
                        if (propertyKey == 'costs') {
                            Object.entries(propertyInfo)
                            .forEach(([costKey, costValue]) => {
                                switch (typeof costValue) {
                                    case 'number':
                                        command.requirement[costKey] = {
                                            minimum: costValue,
                                        }
                                        console.log(command)
                                        command.outcome[costKey] = {
                                            operation: 'add',
                                            value: -1 * costValue,
                                        }
                                        break
                                    default:
                                        command.outcome[costKey] = costValue
                                        break
                                }
                            })
                        }
                        else {
                            command.requirement[propertyKey] = propertyInfo
                        }
                    })
                    result[stageName][roomName].push(command)
                })
            })
        })
    })
    return result
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
    const state = {
        stage: 'castleEntrance',
        room: 'afterDrawbridge',
        positionX: 136,
        positionY: 640,
    }
    const logic = getPreprocessedLogic(settings)
    console.log(logic[state.stage][state.room])
    if ((10 * rng()) < settings.solverAttemptCount) {
        result.solvable = true
    }
    console.log('')
    return result
}