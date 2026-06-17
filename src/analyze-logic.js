import seedrandom from 'seedrandom'

function getMovement(requirementName, section, time) {
    const result = {
        section: section,
        costs: {
            time: time,
        },
    }
    switch (requirementName) {
        case 'basic':
        case 'fall':
        case 'jump':
            break
        case 'preciseJump':
            result.techniquePreciseJump = true
            break
        case 'batForm':
            result.progressionBatTransformation = true
            break
        case 'bladeDash':
            result.progressionBladeDash = true
            result.techniqueBladeDash = true
            break
        case 'chainedRisingUppercuts':
            result.progressionRisingUppercut = true
            result.techniqueRisingUppercut = true
            result.techniqueChainedRisingUppercuts = true
            break
        case 'doubleJump':
            result.progressionDoubleJump = true
            result.statusDoubleJumpUsed = false
            result.costs.statusDoubleJumpUsed = true
            break
        case 'doubleJumpAndLand':
            result.progressionDoubleJump = true
            result.statusDoubleJumpUsed = false
            result.costs.statusDoubleJumpUsed = false
            break
        case 'gravityJump':
            result.progressionGravityJump = true
            break
        case 'mistForm':
            result.progressionMistTransformation = true
            break
        case 'multipleGravityJumps':
        case 'multipleGravityJumpsWithDoubleJump':
            result.progressionDoubleJump = true
            result.progressionGravityJump = true
            break
        case 'poweredMist':
        case 'poweredMistForm':
            result.progressionMistTransformation = true
            result.progressionLongerMistDuration = true
            break
        case 'risingUppercut':
            result.progressionRisingUppercut = true
            result.techniqueRisingUppercut = true
            break
        case 'wolfMistRise':
        case 'wolfMistRiseShort':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueShortWolfMistRise = true
            break
        case 'wolfMistRiseLong':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueLongWolfMistRise = true
            break
        case 'wolfMistRiseVeryLong':
            result.progressionWolfTransformation = true
            result.progressionMistTransformation = true
            result.techniqueVeryLongWolfMistRise = true
            break
        default:
            result.UNKNOWN_MOVEMENT_REQUIREMENT = true
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
    locationDemonCard: {
        outcome: {
            positionX: 88,
            positionY: 185,
            locationDemonCard: true,
        },
        requirements: [
            {
                stage: 'abandonedMine',
                room: 'demonCard',
                locationDemonCard: false,
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
    locationGoldRing: {
        outcome: {
            positionX: 128,
            positionY: 128,
            locationGoldRing: true,
        },
        requirements: [
            {
                stage: 'undergroundCaverns',
                room: 'falseSaveRoom',
                locationGoldRing: false,
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
    locationJewelOfOpen: {
        outcome: {
            positionX: 128,
            positionY: 128,
            locationJewelOfOpen: true,
        },
        requirements: [
            {
                stage: 'longLibrary',
                room: 'shop',
                locationJewelOfOpen: false,
            },
        ],
    },
    locationLeapStone: {
        outcome: {
            positionX: 416,
            positionY: 1824,
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
    locationSkillOfWolf: {
        outcome: {
            positionX: 128,
            positionY: 128,
            locationSkillOfWolf: true,
        },
        requirements: [
            {
                stage: 'alchemyLaboratory',
                room: 'skillOfWolfRoom',
                locationSkillOfWolf: false,
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
            itemInscribedRing: {
                operation: 'add',
                value: 1,
            },
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
            itemInscribedRing: {
                operation: 'add',
                value: 1,
            },
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

const roomPriority = {
    abandonedMine: [
        'wolfsHeadColumn',
        'wellLitSkullRoom',
        'cerberusRoom',
        'demonSwitch',
        'venusWeedRoom',
        'snakeColumn',
        'peanutsRoom',
        'fourWayIntersection',
        'lowerStairwell',
        'karmaCoinRoom',
        'bend',
        'demonCard',
        'loadingRoomToCatacombs',
        'loadingRoomToWarpRooms',
        'loadingRoomToUndergroundCaverns',
        'saveRoom',
        'triggerTeleporterToUndergroundCaverns',
        'triggerTeleporterToWarpRooms',
        'triggerTeleporterToCatacombs',
    ],
    alchemyLaboratory: [
        'batCardRoom',
        'exitToRoyalChapel',
        'blueDoorHallway',
        'bloodyZombieHallway',
        'cannonRoom',
        'clothCapeRoom',
        'sunglassesRoom',
        'glassVats',
        'skillOfWolfRoom',
        'heartMaxUpRoom',
        'entryway',
        'tallSpittleboneRoom',
        'emptyZigZagRoom',
        'shortZigZagRoom',
        'tallZigZagRoom',
        'secretLifeMaxUpRoom',
        'slograAndGaibonRoom',
        'boxPuzzleRoom',
        'redSkeletonLiftRoom',
        'tetrominoRoom',
        'exitToMarbleGallery',
        'corridorToElevator',
        'elevatorShaft',
        'saveRoomA',
        'saveRoomB',
        'saveRoomC',
        'loadingRoomToMarbleGallery',
        'loadingRoomToRoyalChapel',
        'loadingRoomToCastleEntrance',
        'triggerTeleporterToMarbleGallery',
        'triggerTeleporterToRoyalChapel',
        'triggerTeleporterToCastleEntrance',
    ],
    castleEntrance: [
        'afterDrawbridge',
        'dropUnderPortcullis',
        'zombieHallway',
        'holyMailRoom',
        'atticStaircase',
        'atticHallway',
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
    ],
    castleKeep: [
        'upperAttic',
        'lowerAttic',
        'keepArea',
        'ghostCardRoom',
        'bend',
        'falchionRoom',
        'lionTorchPlatform',
        'dualPlatforms',
        'tyrfingRoom',
        'saveRoomA',
        'loadingRoomToClockTower',
        'loadingRoomToWarpRooms',
        'loadingRoomToRoyalChapel',
        'triggerTeleporterToClockTower',
        'triggerTeleporterToRoyalChapel',
        'triggerTeleporterToWarpRooms',
    ],
    catacombs: [
        'roomId00',
        'mormegilRoom',
        'roomId02',
        'granfaloonsLair',
        'roomId04',
        'roomId05',
        'smallGremlinRoom',
        'saveRoomA',
        'walkArmorRoom',
        'icebrandRoom',
        'leftLavaPath',
        'ballroomMaskRoom',
        'rightLavaPath',
        'catEyeCircletRoom',
        'roomId14',
        'saveRoomB',
        'hellfireBeastRoom',
        'exitToAbandonedMine',
        'boneArkRoom',
        'roomId19',
        'roomId20',
        'roomId21',
        'roomId22',
        'roomId23',
        'pitchBlackSpikeMaze',
        'roomId25',
        'roomId26',
        'spikeBreakerRoom',
        'loadingRoomToAbandonedMine',
        'triggerTeleporterToAbandonedMine',
    ],
    clockTower: [
        'karasumansRoom',
        'pathToKarasuman',
        'healingMailRoom',
        'pendulumRoom',
        'spire',
        'hiddenArmory',
        'leftGearRoom',
        'rightGearRoom',
        'exitToCourtyard',
        'belfry',
        'openCourtyard',
        'stairwellToOuterWall',
        'fireOfBatRoom',
        'loadingRoomToOuterWall',
        'loadingRoomToCastleKeep',
        'triggerTeleporterToCastleKeep',
        'triggerTeleporterToOuterWall',
    ],
    colosseum: [
        'holySwordRoom',
        'topOfLeftSpiralStaircase',
        'bladeMasterRoom',
        'topOfRightSpiralStaircase',
        'passagewayBetweenArenaAndRoyalChapel',
        'arena',
        'topOfElevatorShaft',
        'spiralStaircases',
        'valhallaKnightRoom',
        'fountainRoom',
        'bloodCloakRoom',
        'bottomOfElevatorShaft',
        'leftSideArmory',
        'rightSideArmory',
        'loadingRoomToRoyalChapel',
        'loadingRoomToOlroxsQuarters',
        'saveRoomA',
        'saveRoomB',
        'triggerTeleporterToRoyalChapel',
        'triggerTeleporterToOlroxsQuarters',
    ],
    longLibrary: [
        'lesserDemonArea',
        'secretBookcaseRoom',
        'holyRodRoom',
        'dhuronAndFleaArmorRoom',
        'shop',
        'outsideShop',
        'fleaManRoom',
        'faerieCardRoom',
        'threeLayerRoom',
        'spellbookArea',
        'dhuronAndFleaManRoom',
        'footOfStaircase',
        'exitToOuterWall',
        'loadingRoomToOuterWall',
        'saveRoomA',
        'triggerTeleporterToOuterWall',
    ],
    marbleGallery: [
        'sShapedHallways',
        'tallStainedGlassWindows',
        'spiritOrbRoom',
        'stainedGlassCorner',
        'beneathDropoff',
        'dropoff',
        'entrance',
        'stopwatchRoom',
        'longHallway',
        'clockRoom',
        'leftOfClockRoom',
        'emptyRoom',
        'blueDoorRoom',
        'pathwayAfterLeftStatue',
        'pathwayAfterRightStatue',
        'ouijaTableStairway',
        'threePaths',
        'stairwellToUndergroundCaverns',
        'slingerStaircase',
        'rightOfClockRoom',
        'gravityBootsRoom',
        'elevatorRoom',
        'powerUpRoom',
        'beneathLeftTrapdoor',
        'beneathRightTrapdoor',
        'alucartRoom',
        'loadingRoomToOuterWall',
        'loadingRoomToUndergroundCaverns',
        'loadingRoomToAlchemyLaboratory',
        'loadingRoomToOlroxsQuarters',
        'loadingRoomToCastleEntrance',
        'saveRoomA',
        'saveRoomB',
        'triggerTeleporterToOlroxsQuarters',
        'triggerTeleporterToOuterWall',
        'triggerTeleporterToAlchemyLaboratory',
        'triggerTeleporterToUndergroundCaverns',
        'triggerTeleporterToCastleCenter',
        'triggerTeleporterToCastleEntrance',
    ],
    olroxsQuarters: [
        'skelerangRoom',
        'bottomOfStairwell',
        'grandStaircase',
        'secretOnyxRoom',
        'hammerAndBladeRoom',
        'emptyRoom',
        'tallShaft',
        'prison',
        'openCourtyard',
        'emptyCells',
        'garnetRoom',
        'narrowHallwayToOlrox',
        'olroxsRoom',
        'echoOfBatRoom',
        'swordCardRoom',
        'catwalkCrypt',
        'saveRoomA',
        'loadingRoomToMarbleGallery',
        'loadingRoomToColosseum',
        'loadingRoomToWarpRooms',
        'loadingRoomToRoyalChapel',
        'triggerTeleporterToRoyalChapel',
        'triggerTeleporterToWarpRooms',
        'triggerTeleporterToColosseum',
        'triggerTeleporterToMarbleGallery',
    ],
    outerWall: [
        'loadingRoomToWarpRooms',
        'topOfOuterWall',
        'exitToClockTower',
        'telescopeRoom',
        'lowerMedusaRoom',
        'jewelKnucklesRoom',
        'secretPlatformRoom',
        'exitToMarbleGallery',
        'garnetVaseRoom',
        'blueAxeKnightRoom',
        'garlicRoom',
        'doppelgangerRoom',
        'gladiusRoom',
        'elevatorShaftRoom',
        'saveRoomA',
        'loadingRoomToClockTower',
        'loadingRoomToLongLibrary',
        'saveRoomB',
        'loadingRoomToMarbleGallery',
        'triggerTeleporterToClockTower',
        'triggerTeleporterToWarpRooms',
        'triggerTeleporterToLongLibrary',
        'triggerTeleporterToMarbleGallery',
    ],
    royalChapel: [
        'silverRingRoom',
        'spikeHallway',
        'walkwayBetweenTowers',
        'walkwayLeftOfHippogryph',
        'hippogryphRoom',
        'walkwayRightOfHippogryph',
        'pushingStatueShortcut',
        'confessionalBooth',
        'gogglesRoom',
        'nave',
        'emptyRoom',
        'chapelStaircase',
        'statueLedge',
        'leftTower',
        'middleTower',
        'loadingRoomToCastleKeep',
        'saveRoomB',
        'rightTower',
        'saveRoomA',
        'loadingRoomToAlchemyLaboratory',
        'loadingRoomToColosseum',
        'loadingRoomToOlroxsQuarters',
        'triggerTeleporterToCastleKeep',
        'triggerTeleporterToOlroxsQuarters',
        'triggerTeleporterToColosseum',
        'triggerTeleporterToAlchemyLaboratory',
    ],
    undergroundCaverns: [
        'longDrop',
        'hiddenCrystalEntrance',
        'crystalBend',
        'tallStairwell',
        'plaqueRoomWithLifeMaxUp',
        'smallStairwell',
        'claymoreStairwell',
        'mealTicketsAndMoonstoneRoom',
        'plaqueRoomWithBreakableWall',
        'roomId09',
        'roomId10',
        'roomId11',
        'roomId12',
        'holySymbolRoom',
        'pentagramRoom',
        'dKBridge',
        'exitToAbandonedMine',
        'dKButton',
        'roomId18',
        'roomId19',
        'exitToCastleEntrance',
        'mermanStatueRoom',
        'iceFloeRoom',
        'rightFerrymanRoute',
        'crystalCloakRoom',
        'leftFerrymanRoute',
        'waterfall',
        'scyllaRoom',
        'scyllaWyrmRoom',
        'risingWaterRoom',
        'bandannaRoom',
        'loadingRoomToCastleEntrance',
        'loadingRoomToMarbleGallery',
        'loadingRoomToAbandonedMine',
        'saveRoomA',
        'saveRoomB',
        'saveRoomC',
        'falseSaveRoom',
        'triggerTeleporterToMarbleGallery',
        'triggerTeleporterToBossSuccubus',
        'triggerTeleporterToAbandonedMine',
        'triggerTeleporterToCastleEntrance',
    ],
    warpRooms: [
        'warpRoomToCastleKeep',
        'warpRoomToOlroxsQuarters',
        'warpRoomToOuterWall',
        'warpRoomToCastleEntrance',
        'warpRoomToAbandonedMine',
        'loadingRoomToAbandonedMine',
        'loadingRoomToCastleEntrance',
        'loadingRoomToOlroxsQuarters',
        'loadingRoomToOuterWall',
        'loadingRoomToCastleKeep',
        'triggerTeleporterToCastleKeep',
        'triggerTeleporterToOuterWall',
        'triggerTeleporterToOlroxsQuarters',
        'triggerTeleporterToCastleEntrance',
        'triggerTeleporterToAbandonedMine',
    ],
}

const roomsInfo = {
    abandonedMine: {
        bend: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        cerberusRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        demonSwitch: {
            roomInfo: {
                width: 256,
                height: 1024,
            },
            regions: [
                getRegion('blockArea', 208, 96, 48, 64),
                getRegion('upperLeftLedge', 0, 64, 208, 144),
                getRegion('zigZagLedges', 16, 208, 224, 336),
                getRegion('crumblingStairwell', 16, 544, 208, 160),
                getRegion('tinyLedges', 16, 704, 208, 144),
                getRegion('main', 16, 848, 208, 176),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'blockArea', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 1024 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'lowerLedges', 1.999),
                    ],
                },
                toBlockArea: {
                    outcome: {
                        positionX: 232,
                        positionY: 128,
                        // section: blockArea,
                    },
                    requirements: [
                        { // After Activating Demon Switch
                            section: 'upperLeftLedge',
                            statusDemonSwitchActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: 24,
                        positionY: 128,
                        // section: upperLeftLedge,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'zigZagLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'zigZagLedges', 1.999),
                        getMovement('batForm', 'zigZagLedges', 1.999),
                        getMovement('poweredMist', 'zigZagLedges', 1.999),
                        getMovement('wolfMistRise', 'zigZagLedges', 1.999),
                    ],
                },
                toZigZagLedges: {
                    outcome: {
                        positionX: 216,
                        positionY: 256,
                        // section: zigZagLedges,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'upperLeftLedge', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'upperLeftLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'upperLeftLedge', 1.999),
                        getMovement('batForm', 'upperLeftLedge', 1.999),
                        getMovement('poweredMist', 'upperLeftLedge', 1.999),
                        getMovement('wolfMistRise', 'upperLeftLedge', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'crumblingStairwell', 1.999),
                        getMovement('doubleJumpAndLand', 'crumblingStairwell', 1.999),
                        getMovement('batForm', 'crumblingStairwell', 1.999),
                        getMovement('poweredMist', 'crumblingStairwell', 1.999),
                        getMovement('wolfMistRise', 'crumblingStairwell', 1.999),
                    ],
                },
                toCrumblingStairwell: {
                    outcome: {
                        positionX: 96,
                        positionY: 656,
                        // section: crumblingStairwell,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'zigZagLedges', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'zigZagLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'zigZagLedges', 1.999),
                        getMovement('batForm', 'zigZagLedges', 1.999),
                        getMovement('poweredMist', 'zigZagLedges', 1.999),
                        getMovement('wolfMistRise', 'zigZagLedges', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'tinyLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'tinyLedges', 1.999),
                        getMovement('batForm', 'tinyLedges', 1.999),
                        getMovement('poweredMist', 'tinyLedges', 1.999),
                        getMovement('wolfMistRise', 'tinyLedges', 1.999),
                    ],
                },
                toTinyLedges: {
                    outcome: {
                        positionX: 128,
                        positionY: 800,
                        // section: tinyLedges,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'crumblingStairwell', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'crumblingStairwell', 1.999),
                        getMovement('doubleJumpAndLand', 'crumblingStairwell', 1.999),
                        getMovement('batForm', 'crumblingStairwell', 1.999),
                        getMovement('poweredMist', 'crumblingStairwell', 1.999),
                        getMovement('wolfMistRise', 'crumblingStairwell', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 192,
                        positionY: 944,
                        // section: main,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'tinyLedges', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'tinyLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'tinyLedges', 1.999),
                        getMovement('batForm', 'tinyLedges', 1.999),
                        getMovement('poweredMist', 'tinyLedges', 1.999),
                        getMovement('wolfMistRise', 'tinyLedges', 1.999),
                    ],
                },
                activateDemonSwitch: {
                    outcome: {
                        statusDemonSwitchActivated: true,
                    },
                    requirements: [
                        {
                            section: 'blockArea',
                            progressionSummonDemonFamiliar: true,
                            statusDemonSwitchActivated: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'upperLeftLedge',
                            progressionSummonDemonFamiliar: true,
                            statusDemonSwitchActivated: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        demonCard: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        fourWayIntersection: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 0 - 24,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 384,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        karmaCoinRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCatacombs: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        lowerStairwell: {
            roomInfo: {
                width: 256,
                height: 1024,
            },
            regions: [
                getRegion('layer0', 96, 0, 64, 96),
                getRegion('layer1', 16, 96, 224, 240),
                getRegion('layer2', 32, 336, 208, 176),
                getRegion('layer3', 0, 512, 256, 224),
                getRegion('main', 0, 736, 256, 288),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'layer0', 1.999),
                    ],
                },
                toLayer0: {
                    outcome: {
                        positionX: 128,
                        positionY: 48,
                        // section: layer0,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'layer1', 1.999),
                        getMovement('doubleJumpAndLand', 'layer1', 1.999),
                        getMovement('batForm', 'layer1', 1.999),
                        getMovement('poweredMist', 'layer1', 1.999),
                        getMovement('wolfMistRise', 'layer1', 1.999),
                    ],
                },
                toLayer1: {
                    outcome: {
                        positionX: 32,
                        positionY: 144,
                        // section: layer1,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer0', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer0', 1.999),
                        getMovement('doubleJumpAndLand', 'layer0', 1.999),
                        getMovement('batForm', 'layer0', 1.999),
                        getMovement('poweredMist', 'layer0', 1.999),
                        getMovement('wolfMistRise', 'layer0', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'layer2', 1.999),
                        getMovement('doubleJumpAndLand', 'layer2', 1.999),
                        getMovement('batForm', 'layer2', 1.999),
                        getMovement('poweredMist', 'layer2', 1.999),
                        getMovement('wolfMistRise', 'layer2', 1.999),
                    ],
                },
                toLayer2: {
                    outcome: {
                        positionX: 48,
                        positionY: 384,
                        // section: layer2,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer1', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer1', 1.999),
                        getMovement('doubleJumpAndLand', 'layer1', 1.999),
                        getMovement('batForm', 'layer1', 1.999),
                        getMovement('poweredMist', 'layer1', 1.999),
                        getMovement('wolfMistRise', 'layer1', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'layer3', 1.999),
                        getMovement('doubleJumpAndLand', 'layer3', 1.999),
                        getMovement('batForm', 'layer3', 1.999),
                        getMovement('poweredMist', 'layer3', 1.999),
                        getMovement('wolfMistRise', 'layer3', 1.999),
                    ],
                },
                toLayer3: {
                    outcome: {
                        positionX: 24,
                        positionY: 640,
                        // section: layer3,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer2', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer2', 1.999),
                        getMovement('doubleJumpAndLand', 'layer2', 1.999),
                        getMovement('batForm', 'layer2', 1.999),
                        getMovement('poweredMist', 'layer2', 1.999),
                        getMovement('wolfMistRise', 'layer2', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 16,
                        positionY: 896,
                        // section: main,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer3', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer3', 1.999),
                        getMovement('doubleJumpAndLand', 'layer3', 1.999),
                        getMovement('batForm', 'layer3', 1.999),
                        getMovement('poweredMist', 'layer3', 1.999),
                        getMovement('wolfMistRise', 'layer3', 1.999),
                    ],
                },
            },
        },
        peanutsRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        saveRoom: {
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
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        snakeColumn: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('breakableWall', 0, 352, 48, 64),
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'breakableWall', 1.999),
                    ],
                },
                toBreakableWall: {
                    outcome: {
                        positionX: 24,
                        positionY: 384,
                        // section: breakableWall,
                    },
                    requirements: [
                        { // After Breaking Wall
                            section: 'main',
                            statusSecretPassageInSnakeColumnOpened: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 24,
                        positionY: 128,
                        // section: main,
                    },
                    requirements: [
                        { // After Breaking Wall
                            section: 'breakableWall',
                            statusSecretPassageInSnakeColumnOpened: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                openSecretPassage: {
                    outcome: {
                        statusSecretPassageInSnakeColumnOpened: true,
                    },
                    requirements: [
                        {
                            section: 'breakableWall',
                            statusSecretPassageInSnakeColumnOpened: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            statusSecretPassageInSnakeColumnOpened: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        triggerTeleporterToCatacombs: {
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
        venusWeedRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        wellLitSkullRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        wolfsHeadColumn: {
            roomInfo: {
                width: 256,
                height: 1024,
            },
            regions: [
                getRegion('layer0', 176, 96, 80, 64),
                getRegion('layer1', 16, 160, 208, 304),
                getRegion('layer2', 32, 464, 96, 160),
                getRegion('layer2', 32, 464, 208, 96),
                getRegion('layer3', 16, 608, 240, 240),
                getRegion('main', 32, 848, 224, 112),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'layer0', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'layer3', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLayer0: {
                    outcome: {
                        positionX: 216,
                        positionY: 128,
                        // section: layer0,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'layer1', 1.999),
                        getMovement('doubleJumpAndLand', 'layer1', 1.999),
                        getMovement('batForm', 'layer1', 1.999),
                        getMovement('poweredMist', 'layer1', 1.999),
                        getMovement('wolfMistRise', 'layer1', 1.999),
                    ],
                },
                toLayer1: {
                    outcome: {
                        positionX: 128,
                        positionY: 240,
                        // section: layer1,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer0', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer0', 1.999),
                        getMovement('doubleJumpAndLand', 'layer0', 1.999),
                        getMovement('batForm', 'layer0', 1.999),
                        getMovement('poweredMist', 'layer0', 1.999),
                        getMovement('wolfMistRise', 'layer0', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'layer2', 1.999),
                        getMovement('doubleJumpAndLand', 'layer2', 1.999),
                        getMovement('batForm', 'layer2', 1.999),
                        getMovement('poweredMist', 'layer2', 1.999),
                        getMovement('wolfMistRise', 'layer2', 1.999),
                    ],
                },
                toLayer2: {
                    outcome: {
                        positionX: 56,
                        positionY: 592,
                        // section: layer2,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer1', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer1', 1.999),
                        getMovement('doubleJumpAndLand', 'layer1', 1.999),
                        getMovement('batForm', 'layer1', 1.999),
                        getMovement('poweredMist', 'layer1', 1.999),
                        getMovement('wolfMistRise', 'layer1', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'layer3', 1.999),
                        getMovement('doubleJumpAndLand', 'layer3', 1.999),
                        getMovement('batForm', 'layer3', 1.999),
                        getMovement('poweredMist', 'layer3', 1.999),
                        getMovement('wolfMistRise', 'layer3', 1.999),
                    ],
                },
                toLayer3: {
                    outcome: {
                        positionX: 240,
                        positionY: 640,
                        // section: layer3,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer2', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer2', 1.999),
                        getMovement('doubleJumpAndLand', 'layer2', 1.999),
                        getMovement('batForm', 'layer2', 1.999),
                        getMovement('poweredMist', 'layer2', 1.999),
                        getMovement('wolfMistRise', 'layer2', 1.999),
                        // Moving upward
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 240,
                        positionY: 896,
                        // section: main,
                    },
                    requirements: [
                        // Moving downward, chance of return not guaranteed
                        getMovement('basicRisky', 'layer3', 1.999),
                        // Moving downward, chance of return guaranteed
                        getMovement('risingUppercut', 'layer3', 1.999),
                        getMovement('doubleJumpAndLand', 'layer3', 1.999),
                        getMovement('batForm', 'layer3', 1.999),
                        getMovement('poweredMist', 'layer3', 1.999),
                        getMovement('wolfMistRise', 'layer3', 1.999),
                    ],
                },
            },
        },
    },
    alchemyLaboratory: {
        batCardRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        bloodyZombieHallway: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        blueDoorHallway: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('leftSide', 0, 0, 240, 256),
                getRegion('rightSide', 256, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftSide', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'rightSide', 1.999),
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 24,
                        positionY: 128,
                        // section: leftSide,
                    },
                    requirements: [
                        { // Jewel of Open
                            section: 'rightSide',
                            progressionUnlockBlueDoors: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 488,
                        positionY: 128,
                        // section: rightSide,
                    },
                    requirements: [
                        { // Jewel of Open
                            section: 'leftSide',
                            progressionUnlockBlueDoors: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        boxPuzzleRoom: {
            roomInfo: {
                width: 512,
                height: 512,
            },
            regions: [
                getRegion('upperRightLedge', 240, 0, 272, 336),
                getRegion('main', 0, 0, 512, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 488,
                        positionY: 128,
                        // section: upperRightLedge,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                        { // Solve Box Puzzle
                            section: 'main',
                            techniqueSolveBoxPuzzle: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 488,
                        positionY: 384,
                        // section: main,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
            },
        },
        cannonRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('leftSide', 0, 0, 96, 256),
                getRegion('rightSide', 112, 0, 144, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftSide', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'rightSide', 1.999),
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 24,
                        positionY: 128,
                        statusCannonActivated: true,
                        // section: leftSide,
                    },
                    requirements: [
                        { // Jewel of Open
                            section: 'rightSide',
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 248,
                        positionY: 128,
                        // section: rightSide,
                    },
                    requirements: [
                        { // Cannon Activated
                            section: 'leftSide',
                            statusCannonActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        clothCapeRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        corridorToElevator: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        elevatorShaft: {
            roomInfo: {
                width: 256,
                height: 1792,
            },
            regions: [
                getRegion('main', 0, 0, 256, 1792),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 1664,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        emptyZigZagRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        entryway: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 384,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToMarbleGallery: {
            roomInfo: {
                width: 512,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 512, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToRoyalChapel: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        glassVats: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCastleEntrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToRoyalChapel: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        redSkeletonLiftRoom: {
            roomInfo: {
                width: 768,
                height: 512,
            },
            regions: [
                getRegion('holeInCeiling', 80, 0, 32, 48),
                getRegion('upperRightLedge', 640, 96, 128, 64),
                getRegion('main', 0, 0, 768, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'holeInCeiling', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 640,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 736,
                        positionY: 128,
                        // section: upperRightLedge,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                        { // Solve Red Skeleton Lift Puzzle
                            section: 'main',
                            techniqueSolveRedSkeletonLiftPuzzle: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 488,
                        positionY: 384,
                        // section: main,
                    },
                    requirements: [
                        getMovement('basic', 'holeInCeiling', 1.999),
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                toHoleInCeiling: {
                    outcome: {
                        positionX: 128,
                        positionY: 24,
                        // section: holeInCeiling,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
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
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        secretLifeMaxUpRoom: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        shortZigZagRoom: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        skillOfWolfRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        slograAndGaibonRoom: {
            roomInfo: {
                width: 1024,
                height: 512,
            },
            regions: [
                getRegion('alcove', 800, 0, 224, 160),
                getRegion('main', 0, 0, 1024, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'alcove', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        sunglassesRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        tallSpittleboneRoom: {
            roomInfo: {
                width: 256,
                height: 1280,
            },
            regions: [
                getRegion('main', 0, 0, 256, 1280),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        tallZigZagRoom: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        tetrominoRoom: {
            roomInfo: {
                width: 512,
                height: 768,
            },
            regions: [
                getRegion('batCardRoomDuplicate', 0, 0, 288, 512),
                getRegion('main', 0, 0, 512, 768),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'batCardRoomDuplicate', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToCastleEntrance: {
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
        triggerTeleporterToRoyalChapel: {
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
                        getMovement('basic', 'main', 4.999),
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
                                time: 9.999,
                                itemHeartRefresh: 1
                            },
                        },
                        { // Reverse Shift Line using Heart Refresh and Duplicator
                            section: 'main',
                            techniqueReverseShiftLineUsingHeartRefresh: true,
                            costs: {
                                time: 9.999,
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
                        getMovement('fall', 'beneathTrapdoor', 1.999),
                    ],
                },
                fromBeneathTrapdoorToMain: {
                    outcome: {
                        positionX: 160,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'beneathTrapdoor', 0.7),
                    ],
                },
                toParapet: {
                    outcome: {
                        positionX: 288,
                        positionY: 160,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 7.5),
                        getMovement('poweredMistForm', 'main', 10.5),
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
                                time: 0.5,
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
                        getMovement('fall', 'parapet', 1.7),
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
                        getMovement('jump', 'upperLedge', 0.7),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 240,
                        positionY: 384,
                        // section: main,
                    },
                    requirements: [
                        getMovement('fall', 'upperLedge', 1.999),
                    ],
                },
                toUpperLedge: {
                    outcome: {
                        positionX: 128,
                        positionY: 32,
                        // section: upperLedge,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'beneathTrapdoor', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1792 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLedge: {
                    outcome: {
                        positionX: 80,
                        positionY: 72,
                        // section: ledge,
                    },
                    requirements: [
                        getMovement('bladeDash', 'main', 1.999),
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                        { // Precise Corner Mist
                            section: 'main',
                            progressionMistTransformation: true,
                            techniquePreciseCornerMist: true,
                            costs: {
                                time: 1.999,
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
                        getMovement('fall', 'ledge', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                        // statusTookLogicalRisk: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                getRegion('holeInCeiling', 96, 16, 64, 32),
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
                        getMovement('doubleJump', 'holeInCeiling', 1.999),
                        getMovement('batForm', 'holeInCeiling', 1.999),
                        getMovement('risingUppercut', 'holeInCeiling', 1.999),
                        getMovement('poweredMistForm', 'holeInCeiling', 1.999),
                        getMovement('wolfMistRise', 'holeInCeiling', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'secretPassage', 1.999),
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
                                time: 1.999,
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
                                time: 1.999,
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
                                time: 1.999,
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
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseLong', 'main', 1.999),
                        { // Dive Kicking off of the Bats
                            section: 'main',
                            progressionDoubleJump: true,
                            statusDoubleJumpUsed: false,
                            techniqueEnemyDiveKick: true,
                            costs: {
                                time: 1.999,
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
                        getMovement('fall', 'holeInCeiling', 1.999),
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
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1536 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                getRegion('leftSide', 0, 96, 96, 64),
                getRegion('rightSide', 112, 64, 144, 144),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftSide', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'rightSide', 1.999),
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
                                time: 1.999,
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
                                time: 1.999,
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
                                time: 1.999,
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
                        getMovement('doubleJump', 'highIntheAir', 1.999),
                        getMovement('batForm', 'highIntheAir', 1.999),
                        getMovement('risingUppercut', 'highIntheAir', 1.999),
                        getMovement('poweredMistForm', 'highIntheAir', 1.999),
                        getMovement('wolfMistRise', 'highIntheAir', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toHighInTheAir: {
                    outcome: {
                        positionX: 128,
                        positionY: 48,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('chainedRisingUppercuts', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                        getMovement('batForm', 'upperLeftLedge', 1.999),
                        getMovement('chainedRisingUppercuts', 'upperLeftLedge', 1.999),
                        getMovement('multipleGravityJumps', 'upperLeftLedge', 1.999),
                        getMovement('poweredMistForm', 'upperLeftLedge', 1.999),
                        getMovement('wolfMistRiseLong', 'upperLeftLedge', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 128,
                        positionY: 448,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                        getMovement('basic', 'highInTheAir', 1.999),
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: 32,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('fall', 'highInTheAir', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('chainedRisingUppercuts', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                        getMovement('wolfMistRiseLong', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                getRegion('pit', 32, 176, 192, 64),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('fall', 'pit', 1.999),
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 128,
                        positionY: 224,
                    },
                    requirements: [
                        getMovement('fall', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 128,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('batForm', 'pit', 1.999),
                        getMovement('chainedRisingUppercuts', 'pit', 1.999),
                        getMovement('multipleGravityJumps', 'pit', 1.999),
                        getMovement('poweredMistForm', 'pit', 1.999),
                        getMovement('wolfMistRise', 'pit', 1.999),
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
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'middleRightLedge', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 480,
                        positionY: 128,
                        // section: upperRightLedge,
                    },
                    requirements: [
                        getMovement('chainedRisingUppercuts', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                        { // Main - Using Shortcut
                            section: 'main',
                            statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                            costs: {
                                time: 1.999,
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
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                        { // Main - Candle Dive Kick (Forgiving)
                            section: 'main',
                            progressionDoubleJump: true,
                            techniqueForgivingCandleDiveKick: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        { // Upper Right Ledge - Precise Fall and Precise Jump Using Shortcut
                            section: 'upperRightLedge',
                            techniquePreciseJump: true,
                            statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                            costs: {
                                time: 1.999,
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
                        getMovement('fall', 'upperRightLedge', 1.999),
                        getMovement('fall', 'middleRightLedge', 1.999),
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
                                time: 1.999,
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 224,
                        positionY: 128,
                        // section: rightSide,
                    },
                    requirements: [
                        { // Opening Path
                            section: 'leftSide',
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 80,
                        positionY: 128,
                        // section: leftSide,
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'rightSide',
                            statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                openShortcut: {
                    outcome: {
                        statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                    },
                    requirements: [
                        { // After Opening Path
                            section: 'leftSide',
                            statusPassageFromCastleEntranceToWarpRoomsOpened: false,
                            costs: {
                                time: 1.999,
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
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
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
    castleKeep: {
        bend: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 176,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        dualPlatforms: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('holeInCeiling', 16, 0, 64, 64),
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 48,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'holeInCeiling', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toHoleInCeiling: {
                    outcome: {
                        positionX: 48,
                        positionY: 32,
                        // section: holeInCeiling,
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 48,
                        positionY: 32,
                        // section: main,
                    },
                    requirements: [
                        getMovement('basic', 'holeInCeiling', 1.999),
                    ],
                },
            },
        },
        falchionRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        ghostCardRoom: {
            roomInfo: {
                width: 512,
                height: 768,
            },
            regions: [
                getRegion('upperLedges', 128, 352, 160, 96),
                getRegion('rightWindow', 368, 352, 64, 64),
                getRegion('leftPassage', 0, 352, 48, 64),
                getRegion('lowerLedges', 48, 448, 320, 160),
                getRegion('main', 48, 608, 320, 80),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toUpperLedges: {
                    outcome: {
                        positionX: 144,
                        positionY: 384,
                        // section: upperLedges,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'leftPassage', 1.999),
                        getMovement('batForm', 'leftPassage', 1.999),
                        getMovement('poweredMist', 'leftPassage', 1.999),
                        getMovement('doubleJumpAndLand', 'rightWindow', 1.999),
                        getMovement('batForm', 'rightWindow', 1.999),
                        getMovement('poweredMist', 'rightWindow', 1.999),
                        getMovement('risingUppercut', 'lowerLedges', 1.999),
                        getMovement('batForm', 'lowerLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'lowerLedges', 1.999),
                        getMovement('gravityJump', 'lowerLedges', 1.999),
                        getMovement('poweredMist', 'lowerLedges', 1.999),
                        getMovement('wolfMistRise', 'lowerLedges', 1.999),
                    ],
                },
                toRightWindow: {
                    outcome: {
                        positionX: 400,
                        positionY: 384,
                        // section: rightWindow,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'upperLedges', 1.999),
                        getMovement('batForm', 'upperLedges', 1.999),
                        getMovement('poweredMist', 'upperLedges', 1.999),
                        getMovement('risingUppercut', 'lowerLedges', 1.999),
                        getMovement('batForm', 'lowerLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'lowerLedges', 1.999),
                        getMovement('gravityJump', 'lowerLedges', 1.999),
                        getMovement('poweredMist', 'lowerLedges', 1.999),
                        getMovement('wolfMistRise', 'lowerLedges', 1.999),
                    ],
                },
                toLeftPassage: {
                    outcome: {
                        positionX: 24,
                        positionY: 384,
                        // section: leftPassage,
                    },
                    requirements: [
                        getMovement('doubleJumpAndLand', 'upperLedges', 1.999),
                        getMovement('batForm', 'upperLedges', 1.999),
                        getMovement('poweredMist', 'upperLedges', 1.999),
                        getMovement('risingUppercut', 'lowerLedges', 1.999),
                        getMovement('batForm', 'lowerLedges', 1.999),
                        getMovement('doubleJumpAndLand', 'lowerLedges', 1.999),
                        getMovement('gravityJump', 'lowerLedges', 1.999),
                        getMovement('poweredMist', 'lowerLedges', 1.999),
                        getMovement('wolfMistRise', 'lowerLedges', 1.999),
                    ],
                },
                toLowerLedges: {
                    outcome: {
                        positionX: 256,
                        positionY: 512,
                        // section: lowerLedges,
                    },
                    requirements: [
                        getMovement('basic', 'leftPassage', 1.999),
                        getMovement('basic', 'upperLedges', 1.999),
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 64,
                        positionY: 640,
                        // section: main,
                    },
                    requirements: [
                        getMovement('basic', 'leftPassage', 1.999),
                        getMovement('basic', 'rightWindow', 1.999),
                        getMovement('basic', 'upperLedges', 1.999),
                        getMovement('basic', 'lowerLedges', 1.999),
                    ],
                },
            },
        },
        keepArea: {
            roomInfo: {
                width: 2048,
                height: 2048,
            },
            regions: [
                getRegion('upperRightLedge', 1984, 352, 64, 64),
                getRegion('teleporter', 272, 704, 96, 176),
                getRegion('throneRoom', 768, 800, 256, 176),
                getRegion('anteroom', 1040, 800, 560, 176),
                getRegion('topOfStairs', 1632, 768, 64, 192),
                getRegion('bottomOfStairs', 1840, 1056, 208, 128),
                getRegion('powerOfMistLedge', 368, 1152, 320, 128),
                getRegion('leapStoneLedge', 368, 1680, 64, 64),
                getRegion('main', 400, 1744, 1648, 112),
                getRegion('main', 1392, 1632, 656, 112),
                getRegion('hallway', 0, 1888, 2048, 80),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 1432,
                        positionY: 784 - 24,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'topOfStairs', 1.999),
                        {
                            section: 'anteroom',
                            statusSecretStaircaseInCastleKeepOpened: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 1920,
                    },
                    requirements: [
                        getMovement('basic', 'hallway', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 1152,
                    },
                    requirements: [
                        getMovement('basic', 'bottomOfStairs', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 1664,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightHallway: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 1920,
                    },
                    requirements: [
                        getMovement('basic', 'hallway', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 2016,
                        positionY: 384,
                        // section: upperRightLedge,
                    },
                    requirements: [
                        getMovement('batForm', 'topOfStairs', 1.999),
                        getMovement('multipleGravityJumps', 'topOfStairs', 1.999),
                        getMovement('poweredMist', 'topOfStairs', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'topOfStairs', 1.999),
                        getMovement('batForm', 'bottomOfStairs', 1.999),
                        getMovement('multipleGravityJumps', 'bottomOfStairs', 1.999),
                        getMovement('poweredMist', 'bottomOfStairs', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'bottomOfStairs', 1.999),
                    ],
                },
                toTeleporter: {
                    outcome: {
                        positionX: 320,
                        positionY: 848,
                        // section: teleporter,
                    },
                    requirements: [
                        {
                            section: 'throneRoom',
                            statusRichterSaved: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toThroneRoom: {
                    outcome: {
                        positionX: 896,
                        positionY: 944,
                        // section: throneRoom,
                    },
                    requirements: [
                        getMovement('basic', 'anteroom', 1.999),
                        {
                            section: 'teleporter',
                            statusRichterSaved: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toAnteroom: {
                    outcome: {
                        positionX: 1568,
                        positionY: 896,
                        // section: anteroom,
                    },
                    requirements: [
                        getMovement('basic', 'topOfStairs', 1.999),
                        {
                            section: 'throneRoom',
                            statusRichterSaved: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toTopOfStairs: {
                    outcome: {
                        positionX: 1648,
                        positionY: 896,
                        // section: topOfStairs,
                    },
                    requirements: [
                        getMovement('basic', 'anteroom', 1.999),
                        getMovement('batForm', 'upperRightLedge', 1.999),
                        getMovement('multipleGravityJumps', 'upperRightLedge', 1.999),
                        getMovement('poweredMist', 'upperRightLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'upperRightLedge', 1.999),
                        getMovement('batForm', 'powerOfMistLedge', 1.999),
                        getMovement('multipleGravityJumps', 'powerOfMistLedge', 1.999),
                        getMovement('poweredMist', 'powerOfMistLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'powerOfMistLedge', 1.999),
                        getMovement('batForm', 'bottomOfStairs', 1.999),
                        getMovement('multipleGravityJumps', 'bottomOfStairs', 1.999),
                        getMovement('poweredMist', 'bottomOfStairs', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'bottomOfStairs', 1.999),
                    ],
                },
                toBottomOfStairs: {
                    outcome: {
                        positionX: 2032,
                        positionY: 1152,
                        // section: bottomOfStairs,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                        getMovement('batForm', 'topOfStairs', 1.999),
                        getMovement('multipleGravityJumps', 'topOfStairs', 1.999),
                        getMovement('poweredMist', 'topOfStairs', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'topOfStairs', 1.999),
                        getMovement('batForm', 'powerOfMistLedge', 1.999),
                        getMovement('multipleGravityJumps', 'powerOfMistLedge', 1.999),
                        getMovement('poweredMist', 'powerOfMistLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'powerOfMistLedge', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                    ],
                },
                toPowerOfMistLedge: {
                    outcome: {
                        positionX: 416,
                        positionY: 1200,
                        // section: powerOfMistLedge,
                    },
                    requirements: [
                        getMovement('batForm', 'topOfStairs', 1.999),
                        getMovement('multipleGravityJumps', 'topOfStairs', 1.999),
                        getMovement('poweredMist', 'topOfStairs', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'topOfStairs', 1.999),
                        getMovement('batForm', 'bottomOfStairs', 1.999),
                        getMovement('multipleGravityJumps', 'bottomOfStairs', 1.999),
                        getMovement('poweredMist', 'bottomOfStairs', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'bottomOfStairs', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                    ],
                },
                toLeapStoneLedge: {
                    outcome: {
                        positionX: 400,
                        positionY: 1712,
                        // section: leapStoneLedge,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 2032,
                        positionY: 1664,
                        // section: main,
                    },
                    requirements: [
                        getMovement('basic', 'bottomOfStairs', 1.999),
                        getMovement('basic', 'leapStoneLedge', 1.999),
                        getMovement('basic', 'powerOfMistLedge', 1.999),
                        getMovement('basic', 'topOfStairs', 1.999),
                    ],
                },
            },
        },
        lionTorchPlatform: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('holeInCeiling', 144, 0, 64, 80),
                getRegion('main', 0, 80, 256, 368),
                getRegion('holeInFloor', 32, 448, 32, 64),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 176,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'holeInCeiling', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 48,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'holeInFloor', 1.999),
                    ],
                },
                toHoleInCeiling: {
                    outcome: {
                        positionX: 176,
                        positionY: 32,
                        // section: holeInCeiling,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 16,
                        positionY: 128,
                        // section: main,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                        getMovement('batForm', 'holeInFloor', 1.999),
                        getMovement('doubleJumpAndLand', 'holeInFloor', 1.999),
                        getMovement('gravityJump', 'holeInFloor', 1.999),
                        getMovement('poweredMist', 'holeInFloor', 1.999),
                        getMovement('wolfMistRise', 'holeInFloor', 1.999),
                    ],
                },
                toHoleInFloor: {
                    outcome: {
                        positionX: 48,
                        positionY: 480,
                        // section: holeInFloor,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToClockTower: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToRoyalChapel: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        lowerAttic: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 112,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 400,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToClockTower: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToRoyalChapel: {
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
        tyrfingRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        upperAttic: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitBottom: {
                    outcome: {
                        positionX: 392,
                        positionY: 256,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
    },
    catacombs: {
        ballroomMaskRoom: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        boneArkRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        catEyeCircletRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToAbandonedMine: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightULower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        granfaloonsLair: {
            roomInfo: {
                width: 512,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 512, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        hellfireBeastRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        icebrandRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        leftLavaPath: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToAbandonedMine: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        mormegilRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        pitchBlackSpikeMaze: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('leftSide', 0, 96, 48, 64),
                getRegion('main', 48, 0, 256, 592),
                getRegion('rightSide', 640, 80, 128, 80),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 24,
                        positionY: 128,
                        // section: leftSide,
                    },
                    requirements: [
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            progressionEcholocation: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            statusLightInSpikeMazeActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionDoubleJump: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            statusLightInSpikeMazeActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMainFromRightSide: {
                    outcome: {
                        positionX: 384,
                        positionY: 176,
                        statusLightInSpikeMazeActivated: true,
                        // section: main,
                    },
                    requirements: [
                        {
                            section: 'rightSide',
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMainFromLeftSide: {
                    outcome: {
                        positionX: 384,
                        positionY: 176,
                        // section: main,
                    },
                    requirements: [
                        {
                            section: 'leftSide',
                            progressionBatTransformation: true,
                            progressionEcholocation: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'leftSide',
                            progressionBatTransformation: true,
                            statusLightInSpikeMazeActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'leftSide',
                            progressionDoubleJump: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'leftSide',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'leftSide',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            statusLightInSpikeMazeActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 752,
                        positionY: 128,
                        // section: rightSide,
                    },
                    requirements: [
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            progressionEcholocation: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            statusLightInSpikeMazeActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionDoubleJump: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            statusLightInSpikeMazeActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        rightLavaPath: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId00: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId02: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId04: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId05: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId14: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId19: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId20: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId21: {
            roomInfo: {
                width: 512,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 512, 512),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId22: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId23: {
            roomInfo: {
                width: 768,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 768, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId25: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 1072,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId26: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitTop: { // TODO(sestren): Put logic here
                    outcome: {
                        positionX: 1072,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        smallGremlinRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        spikeBreakerRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToAbandonedMine: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        walkArmorRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
    },
    clockTower: {
        belfry: {
            roomInfo: {
                width: 768,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 768, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 384,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 256 - 8,
                        positionY: 384,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToCourtyard: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        fireOfBatRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        healingMailRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        hiddenArmory: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        karasumansRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        leftGearRoom: {
            // TODO(sestren): Add breakable wall to logic
            roomInfo: {
                width: 256,
                height: 1024,
            },
            regions: [
                // getRegion('brokenWall', 224, 96, 32, 64),
                getRegion('secretPassage', 0, 864, 32, 64),
                getRegion('main', 0, 0, 256, 1024),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'secretPassage', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                // toBrokenWall: {},
                toSecretPassage: {
                    outcome: {
                        positionX: 16,
                        positionY: 896,
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusLeftGearRoomSolved: true,
                            statusRightGearRoomSolved: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 144,
                        positionY: 896,
                    },
                    requirements: [
                        {
                            section: 'secretPassage',
                            statusLeftGearRoomSolved: true,
                            statusRightGearRoomSolved: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                solveLeftGear: {
                    outcome: {
                        statusLeftGearRoomSolved: true,
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusLeftGearRoomSolved: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        loadingRoomToCastleKeep: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOuterWall: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        openCourtyard: {
            roomInfo: {
                width: 2048,
                height: 2048,
            },
            regions: [
                getRegion('centerArea', 480, 0, 592, 848),
                getRegion('upperLeftLedge', 0, 304, 208, 112),
                getRegion('upperRightLedge', 1408, 408, 128, 112),
                getRegion('middleRightLedge', 1280, 816, 256, 112),
                getRegion('lowerLeftLedge', 0, 816, 128, 112),
                getRegion('main', 0, 1104, 1536, 176),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'lowerLeftLedge', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'middleRightLedge', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 1152,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toCenterArea: {
                    outcome: {
                        positionX: 528,
                        positionY: 816,
                        // section: 'centerArea',
                    },
                    requirements: [
                        getMovement('batForm', 'upperLeftLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'upperLeftLedge', 1.999),
                        getMovement('multipleGravityJumps', 'upperLeftLedge', 1.999),
                        getMovement('poweredMist', 'upperLeftLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'upperLeftLedge', 1.999),
                        getMovement('batForm', 'lowerLeftLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'lowerLeftLedge', 1.999),
                        getMovement('multipleGravityJumps', 'lowerLeftLedge', 1.999),
                        getMovement('poweredMist', 'lowerLeftLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'lowerLeftLedge', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                        getMovement('batForm', 'upperRightLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'upperRightLedge', 1.999),
                        getMovement('multipleGravityJumps', 'upperRightLedge', 1.999),
                        getMovement('poweredMist', 'upperRightLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'upperRightLedge', 1.999),
                        getMovement('batForm', 'middleRightLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'middleRightLedge', 1.999),
                        getMovement('multipleGravityJumps', 'middleRightLedge', 1.999),
                        getMovement('poweredMist', 'middleRightLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'middleRightLedge', 1.999),
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: 32,
                        positionY: 384,
                        // section: 'upperLeftLedge',
                    },
                    requirements: [
                        getMovement('batForm', 'lowerLeftLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'lowerLeftLedge', 1.999),
                        getMovement('multipleGravityJumps', 'lowerLeftLedge', 1.999),
                        getMovement('poweredMist', 'lowerLeftLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'lowerLeftLedge', 1.999),
                        getMovement('batForm', 'centerArea', 1.999),
                        getMovement('multipleGravityJumps', 'centerArea', 1.999),
                        getMovement('poweredMist', 'centerArea', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'centerArea', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 1504,
                        positionY: 128,
                        // section: 'upperRightLedge',
                    },
                    requirements: [
                        getMovement('batForm', 'middleRightLedge', 1.999),
                        getMovement('doubleJumpAndLand', 'middleRightLedge', 1.999),
                        getMovement('multipleGravityJumps', 'middleRightLedge', 1.999),
                        getMovement('poweredMist', 'middleRightLedge', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'middleRightLedge', 1.999),
                        getMovement('batForm', 'centerArea', 1.999),
                        getMovement('multipleGravityJumps', 'centerArea', 1.999),
                        getMovement('poweredMist', 'centerArea', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'centerArea', 1.999),
                    ],
                },
                toLowerLeftLedge: {
                    outcome: {
                        positionX: 16,
                        positionY: 896,
                        // section: 'lowerLeftLedge',
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                        getMovement('batForm', 'centerArea', 1.999),
                        getMovement('doubleJumpAndLand', 'centerArea', 1.999),
                        getMovement('multipleGravityJumps', 'centerArea', 1.999),
                        getMovement('poweredMist', 'centerArea', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'centerArea', 1.999),
                    ],
                },
                toMiddleRightLedge: {
                    outcome: {
                        positionX: 1520,
                        positionY: 896,
                        // section: 'middleRightLedge',
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                        getMovement('batForm', 'centerArea', 1.999),
                        getMovement('doubleJumpAndLand', 'centerArea', 1.999),
                        getMovement('multipleGravityJumps', 'centerArea', 1.999),
                        getMovement('poweredMist', 'centerArea', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'centerArea', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 1520,
                        positionY: 1152,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('basic', 'lowerLeftLedge', 1.999),
                        getMovement('basic', 'main', 1.999),
                        getMovement('basic', 'middleRightLedge', 1.999),
                    ],
                },
            },
        },
        pathToKarasuman: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        pendulumRoom: {
            roomInfo: {
                width: 1792,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 1792, 512),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 256 - 8,
                        positionY: 128,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                        // TODO(sestren): Handle breakable wall
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1792 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        rightGearRoom: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                solveRightGear: {
                    outcome: {
                        statusRightGearRoomSolved: true,
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusRightGearRoomSolved: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        spire: {
            roomInfo: {
                width: 1280,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 512),
            ],
            commands: {
                exitBottom: {
                    outcome: {
                        positionX: 640,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        stairwellToOuterWall: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToCastleKeep: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToOuterWall: {
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
    colosseum: {
        arena: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        bladeMasterRoom: {
            roomInfo: {
                width: 1024,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1024, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 672,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        bloodCloakRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        bottomOfElevatorShaft: {
            // TODO(sestren): Handle logic for elevator
            roomInfo: {
                width: 1024,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 1024, 512),
            ],
            commands: {
                // exitTopLeft: {
                //     outcome: {
                //         positionX: 128,
                //         positionY: 0 - 24,
                //     },
                //     requirements: [
                //         getMovement('basic', 'main', 1.999),
                //     ],
                // },
                exitTopRight: {
                    outcome: {
                        positionX: 896,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        fountainRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        holySwordRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitBottom: {
                    outcome: {
                        positionX: 416,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        leftSideArmory: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOlroxsQuarters: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToRoyalChapel: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        passagewayBetweenArenaAndRoyalChapel: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('leftOfBarrier', 0, 0, 128, 256),
                getRegion('main', 144, 0, 1136, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 880,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftOfBarrier', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1280 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 384,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLeftOfBarrier: {
                    outcome: {
                        positionX: 96,
                        positionY: 160,
                        statusBarrierInColosseumOpened: true,
                    },
                    requirements: [
                        {
                            section: 'main',
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 176,
                        positionY: 160,
                    },
                    requirements: [
                        {
                            section: 'leftOfBarrier',
                            statusBarrierInColosseumOpened: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        rightSideArmory: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        spiralStaircases: {
            roomInfo: {
                width: 1024,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 1024, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        topOfElevatorShaft: {
            // TODO(sestren): Handle logic for the elevator
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('behindMistGate', 0, 96, 256, 64),
                getRegion('main', 272, 0, 1008, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 400,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'behindMistGate', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1280 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                // exitBottomLeft: {
                //     outcome: {
                //         positionX: 144,
                //         positionY: 256 + 24,
                //     },
                //     requirements: [
                //         getMovement('basic', 'pit', 1.999),
                //     ],
                // },
                exitBottomRight: {
                    outcome: {
                        positionX: 896,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 304,
                        positionY: 160,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('mistForm', 'behindMistGate', 1.999),
                    ],
                },
                toBehindMistGate: {
                    outcome: {
                        positionX: 232,
                        positionY: 128,
                        // section: 'behindMistGate',
                    },
                    requirements: [
                        getMovement('mistForm', 'main', 1.999),
                    ],
                },
            },
        },
        topOfLeftSpiralStaircase: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        topOfRightSpiralStaircase: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 144,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToOlroxsQuarters: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToRoyalChapel: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        valhallaKnightRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
    },
    longLibrary: {
        dhuronAndFleaArmorRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        dhuronAndFleaManRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToOuterWall: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        faerieCardRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        fleaManRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        footOfStaircase: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 224,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        holyRodRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        lesserDemonArea: {
            roomInfo: {
                width: 1280,
                height: 1024,
            },
            regions: [
                getRegion('topRightLedge', 976, 0, 304, 176),
                getRegion('upperLevel', 288, 0, 800, 336),
                getRegion('middleLevel', 400, 336, 880, 208),
                getRegion('middleLevel', 1024, 336, 112, 288),
                getRegion('lowerLevel', 16, 544, 1264, 192),
                getRegion('lowerLevel', 16, 544, 192, 352),
                getRegion('behindMistGate', 784, 816, 352, 128),
                getRegion('main', 144, 816, 624, 144),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 1280 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'topRightLedge', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 1280 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'middleLevel', 1.999),
                    ],
                },
                toTopRightLedge: {
                    outcome: {
                        positionX: 1248,
                        positionY: 128,
                        // section: 'topRightLedge',
                    },
                    requirements: [
                        getMovement('preciseJump', 'upperLevel', 1.999),
                        getMovement('risingUppercut', 'upperLevel', 1.999),
                        getMovement('batForm', 'upperLevel', 1.999),
                        getMovement('doubleJumpAndLand', 'upperLevel', 1.999),
                        getMovement('poweredMist', 'upperLevel', 1.999),
                        getMovement('wolfMistRise', 'upperLevel', 1.999),
                    ],
                },
                toUpperLevel: {
                    outcome: {
                        positionX: 1248,
                        positionY: 128,
                        // section: 'upperLevel',
                    },
                    requirements: [
                        getMovement('fall', 'topRightLedge', 1.999),
                        getMovement('risingUppercut', 'middleLevel', 1.999),
                        getMovement('batForm', 'middleLevel', 1.999),
                        getMovement('doubleJumpAndLand', 'middleLevel', 1.999),
                        getMovement('gravityJump', 'middleLevel', 1.999),
                        getMovement('poweredMist', 'middleLevel', 1.999),
                        getMovement('wolfMistRise', 'middleLevel', 1.999),
                    ],
                },
                toMiddleLevel: {
                    outcome: {
                        positionX: 1264,
                        positionY: 384,
                        // section: 'middleLevel',
                    },
                    requirements: [
                        getMovement('fall', 'upperLevel', 1.999),
                        getMovement('risingUppercut', 'lowerLevel', 1.999),
                        getMovement('batForm', 'lowerLevel', 1.999),
                        getMovement('doubleJumpAndLand', 'lowerLevel', 1.999),
                        getMovement('gravityJump', 'lowerLevel', 1.999),
                        getMovement('poweredMist', 'lowerLevel', 1.999),
                        getMovement('wolfMistRise', 'lowerLevel', 1.999),
                    ],
                },
                toLowerLevel: {
                    outcome: {
                        positionX: 1216,
                        positionY: 672,
                        // section: 'lowerLevel',
                    },
                    requirements: [
                        getMovement('fall', 'middleLevel', 1.999),
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 256,
                        positionY: 928,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'lowerLevel', 1.999),
                        getMovement('mistForm', 'behindMistGate', 1.999),
                    ],
                },
                toBehindMistGate: {
                    outcome: {
                        positionX: 816,
                        positionY: 864,
                        // section: 'behindMistGate',
                    },
                    requirements: [
                        getMovement('mistForm', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOuterWall: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        outsideShop: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        secretBookcaseRoom: {
            // TODO(sestren): Handle logic for secret bookcase
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        shop: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
                getRegion('beneathShop', 0, 256, 256, 256),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'beneathShop', 1.999),
                    ],
                },
            },
        },
        spellbookArea: {
            roomInfo: {
                width: 1792,
                height: 768,
            },
            regions: [
                getRegion('upperLeftLedge', 0, 48, 400, 240),
                getRegion('middleLeftLedge', 0, 304, 304, 176),
                getRegion('main', 0, 0, 1792, 768),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'middleLeftLedge', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 640,
                        positionY: 768 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toUpperLeftLedge: {
                    // TODO(sestren): Add logic for Book Jump
                    outcome: {
                        positionX: 24,
                        positionY: 128,
                        // section: 'upperLeftLedge',
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseLong', 'main', 1.999),
                    ],
                },
                toMiddleLeftLedge: {
                    outcome: {
                        positionX: 24,
                        positionY: 324,
                        // section: 'middleLeftLedge',
                    },
                    requirements: [
                        getMovement('risingUppercut', 'main', 1.999),
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 16,
                        positionY: 640,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'upperLeftLedge', 1.999),
                        getMovement('fall', 'middleLeftLedge', 1.999),
                    ],
                },
            },
        },
        threeLayerRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('topLayer', 0, 0, 256, 256),
                getRegion('main', 0, 256, 256, 256),
                getRegion('bottomLayer', 0, 512, 256, 256),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'topLayer', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'topLayer', 1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'bottomLayer', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'bottomLayer', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToOuterWall: {
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
    marbleGallery: {
        alucartRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        beneathDropoff: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitTopLeft: {
                    // TODO(sestren): Handle candle dive-kick double jump
                    outcome: {
                        positionX: 40,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitTopRight: {
                    outcome: {
                        positionX: 272,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        beneathLeftTrapdoor: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        beneathRightTrapdoor: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        blueDoorRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 240, 256),
                getRegion('rightSide', 272, 0, 240, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftSide', 1.999),
                    ],
                },
                toLeftSide: {
                    outcome: {
                        positionX: 224,
                        positionY: 160,
                    },
                    requirements: [
                        { // Jewel of Open
                            section: 'rightSide',
                            progressionUnlockBlueDoors: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toRightSide: {
                    outcome: {
                        positionX: 304,
                        positionY: 160,
                    },
                    requirements: [
                        { // Jewel of Open
                            section: 'leftSide',
                            progressionUnlockBlueDoors: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                activatePressurePlate: {
                    outcome: {
                        statusPressurePlateInMarbleGalleryActivated: true,
                    },
                    requirements: [
                        {
                            section: 'rightSide',
                            statusPressurePlateInMarbleGalleryActivated: false,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        clockRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('upperLeftLedge', 0, 0, 32, 80),
                getRegion('upperRightLedge', 224, 0, 32, 80),
                getRegion('pit', 64, 192, 128, 64),
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTopLeft: {
                    outcome: {
                        positionX: 24,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'upperLeftLedge', 1.999),
                    ],
                },
                exitTopMiddle: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 200,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                    ],
                },
                exitTopRight: {
                    outcome: {
                        positionX: 232,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'pit', 1.999),
                    ],
                },
                toUpperLeftLedge: {
                    outcome: {
                        positionX: 24,
                        positionY: 32,
                        // section: 'upperLeftLedge',
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('doubleJumpAndLand', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                        getMovement('wolfMistRise', 'main', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 232,
                        positionY: 32,
                        // section: 'upperRightLedge',
                    },
                    requirements: [
                        {
                            section: 'main',
                            progressionBatTransformation: true,
                            progressionItemMaterialization: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionDoubleJump: true,
                            progressionItemMaterialization: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionGravityJump: true,
                            progressionItemMaterialization: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionLongerMistDuration: true,
                            progressionItemMaterialization: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionWolfTransformation: true,
                            progressionItemMaterialization: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 128,
                        positionY: 224,
                        // section: 'pit',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusSecretFloorInClockRoomOpened: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('basic', 'pit', 1.999),
                        getMovement('basic', 'upperLeftLedge', 1.999),
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                openSecretFloor: {
                    outcome: {
                        statusSecretFloorInClockRoomOpened: true,
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusSecretFloorInClockRoomOpened: false,
                            itemInscribedRing: {
                                minimum: 2,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        dropoff: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('leftLedge', 0, 0, 304, 192),
                getRegion('main', 496, 0, 272, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftLedge', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 512,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLeftLedge: {
                    outcome: {
                        positionX: 16,
                        positionY: 128,
                        // section: 'leftLedge',
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('poweredMist', 'main', 1.999),
                        getMovement('wolfMistRiseLong', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 752,
                        positionY: 128,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('basic', 'leftLedge', 1.999),
                    ],
                },
            },
        },
        elevatorRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        emptyRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        entrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        gravityBootsRoom: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 256),
            ],
            commands: {
                exitBottom: {
                    outcome: {
                        positionX: 640,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        leftOfClockRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCastleEntrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOlroxsQuarters: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOuterWall: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        longHallway: {
            roomInfo: {
                width: 3840,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 3840, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 3840 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        ouijaTableStairway: {
            roomInfo: {
                width: 512,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 512, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        pathwayAfterLeftStatue: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        pathwayAfterRightStatue: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        powerUpRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        rightOfClockRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        sShapedHallways: {
            roomInfo: {
                width: 1536,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 1536, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1536 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        slingerStaircase: {
            roomInfo: {
                width: 768,
                height: 512,
            },
            regions: [
                getRegion('pit', 576, 480, 128, 32),
                getRegion('main', 0, 0, 768, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 608,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'pit', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 752,
                        positionY: 384,
                        // section: 'main',
                    },
                    requirements: [
                        {
                            section: 'pit',
                            statusPressurePlateInMarbleGalleryActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 608,
                        positionY: 496,
                        // section: 'pit',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusPressurePlateInMarbleGalleryActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        spiritOrbRoom: {
            roomInfo: {
                width: 512,
                height: 1280,
            },
            regions: [
                getRegion('main', 0, 0, 512, 1280),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 1152,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        stainedGlassCorner: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 160,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        stairwellToUndergroundCaverns: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        stopwatchRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('pit', 352, 224, 64, 32),
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 384,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'pit', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 320,
                        positionY: 160,
                        // section: 'main',
                    },
                    requirements: [
                        {
                            section: 'pit',
                            statusPressurePlateInMarbleGalleryActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 384,
                        positionY: 240,
                        // section: 'pit',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusPressurePlateInMarbleGalleryActivated: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        tallStainedGlassWindows: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        threePaths: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('leftPath', 0, 352, 80, 160),
                getRegion('middlePath', 96, 0, 64, 336),
                getRegion('main', 80, 336, 96, 176),
                getRegion('rightPath', 176, 352, 80, 160),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'middlePath', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'leftPath', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'rightPath', 1.999),
                    ],
                },
                exitBottomLeft: {
                    outcome: {
                        positionX: 40,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'leftPath', 1.999),
                    ],
                },
                exitBottomMiddle: {
                    outcome: {
                        positionX: 128,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottomRight: {
                    outcome: {
                        positionX: 216,
                        positionY: 512 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'rightPath', 1.999),
                    ],
                },
                toMiddlePath: {
                    outcome: {
                        positionX: 152,
                        positionY: 304,
                        // section: 'middlePath',
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                        getMovement('wolfMistRiseVeryLong', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 216,
                        positionY: 512 + 24,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('fall', 'middlePath', 1.999),
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
        triggerTeleporterToCastleCenter: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToCastleEntrance: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToOlroxsQuarters: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToOuterWall: {
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
    olroxsQuarters: {
        bottomOfStairwell: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        catwalkCrypt: {
            // TODO(sestren): Add more regions and logic?
            roomInfo: {
                width: 1792,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1792, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 384,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1792 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        echoOfBatRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        emptyCells: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        emptyRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        garnetRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        grandStaircase: {
            roomInfo: {
                width: 768,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 768, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: { // TODO(sestren): Handle logic for breakable wall
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        hammerAndBladeRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToColosseum: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToRoyalChapel: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        narrowHallwayToOlrox: {
            roomInfo: {
                width: 1024,
                height: 256,
            },
            regions: [
                getRegion('leftOfTunnel', 0, 0, 400, 256),
                getRegion('main', 432, 0, 592, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftOfTunnel', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLeftOfTunnel: {
                    outcome: {
                        positionX: 80,
                        positionY: 128,
                        // section: 'leftOfTunnel',
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 1000,
                        positionY: 128,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('basic', 'leftOfTunnel', 1.999),
                    ],
                },
            },
        },
        olroxsRoom: {
            roomInfo: {
                width: 512,
                height: 512,
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        openCourtyard: {
            roomInfo: {
                width: 1536,
                height: 1024,
            },
            regions: [
                // TODO(sestren): Add other regions and handle logic for the ledges
                getRegion('main', 0, 0, 1536, 1024),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 1392,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 1536 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 1536 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
            },
        },
        prison: {
            roomInfo: {
                width: 1536,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1536, 256),
            ],
            commands: {
                exitBottomLeft: {
                    outcome: {
                        positionX: 112,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottomRight: {
                    outcome: {
                        positionX: 1424,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        secretOnyxRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        skelerangRoom: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        swordCardRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        tallShaft: {
            // TODO(sestren): Handle logic for regions in the tall shaft
            roomInfo: {
                width: 256,
                height: 1536,
            },
            regions: [
                getRegion('holeInCeiling', 64, 0, 128, 64),
                getRegion('main', 0, 1376, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toHoleInCeiling: {
                    outcome: {
                        positionX: 128,
                        positionY: 32,
                        // section: 'holeInCeiling',
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('multipleGravityJumps', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 224,
                        positionY: 1408,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('basic', 'holeInCeiling', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToColosseum: {
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
        triggerTeleporterToRoyalChapel: {
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
    },
    outerWall: {
        blueAxeKnightRoom: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        doppelgangerRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        elevatorShaftRoom: {
            roomInfo: {
                width: 768,
                height: 2048,
            },
            regions: [
                getRegion('main', 0, 0, 512, 2048),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 416,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 256 - 8,
                        positionY: 640,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftMiddle: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 1664,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 1920,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 224,
                        positionY: 2048 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToClockTower: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToMarbleGallery: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 96,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 176,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        garlicRoom: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        garnetVaseRoom: {
            // TODO(sestren): Add logic for Garnet Vase
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 304,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 400,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        gladiusRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        jewelKnucklesRoom: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 32,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToClockTower: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToLongLibrary: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        lowerMedusaRoom: {
            roomInfo: {
                width: 768,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 512, 768),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 384,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    // TODO(sestren): Add mist gate here
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 224,
                        positionY: 768 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        secretPlatformRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 32,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        telescopeRoom: {
            roomInfo: {
                width: 1024,
                height: 512,
            },
            regions: [
                getRegion('main', 336, 0, 400, 240),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 480,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        topOfOuterWall: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 176,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToClockTower: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToLongLibrary: {
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
    },
    royalChapel: {
        // NOTE(sestren): Royal Chapel has unusual overlapping room transitions
        chapelStaircase: {
            roomInfo: {
                width: 2018,
                height: 1792,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 2048 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 384,
                        positionY: 1792 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        confessionalBooth: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        emptyRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        gogglesRoom: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('upperRightLedge', 144, 352, 112, 64),
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 16,
                        positionY: 640,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('basic', 'upperRightLedge', 1.999),
                    ],
                },
                toUpperRightLedge: {
                    outcome: {
                        positionX: 224,
                        positionY: 384,
                        // section: 'upperRightLedge',
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
            },
        },
        hippogryphRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        leftTower: {
            roomInfo: {
                width: 1024,
                height: 2560,
            },
            regions: [
                getRegion('main', 0, 0, 1024, 2560),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8 + 384,
                        positionY: 896,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 1024 + 8 - 384,
                        positionY: 640,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 1024 + 8 - 256,
                        positionY: 1920,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8 + 384,
                        positionY: 2432,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 1024 + 8 - 256,
                        positionY: 2432,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCastleKeep: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToColosseum: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOlroxsQuarters: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        middleTower: {
            roomInfo: {
                width: 1024,
                height: 1024,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8 + 384,
                        positionY: 896,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8 - 384,
                        positionY: 640,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        nave: {
            roomInfo: {
                width: 512,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 512, 512),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        pushingStatueShortcut: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('leftOfStatue', 0, 96, 32, 64),
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftOfStatue', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLeftOfStatue: {
                    outcome: {
                        positionX: 16,
                        positionY: 128,
                        statusStatueInRoyalChapelMoved: true,
                        // section: 'leftOfStatue',
                    },
                    requirements: [
                        {
                            section: 'main',
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                        // section: 'main',
                    },
                    requirements: [
                        {
                            section: 'leftOfStatue',
                            statusStatueInRoyalChapelMoved: true,
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        rightTower: {
            roomInfo: {
                width: 1024,
                height: 1024,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8 + 384,
                        positionY: 896,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8 - 384,
                        positionY: 640,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8 - 384,
                        positionY: 896,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        silverRingRoom: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        spikeHallway: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('leftOfSpikeHallway', 0, 0, 112, 256),
                getRegion('main', 1040, 0, 240, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'leftOfSpikeHallway', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1280 + 8 - 128,
                        positionY: 128,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                toLeftOfSpikeHallway: {
                    outcome: {
                        positionX: 32,
                        positionY: 128,
                        // section: 'leftOfSpikeHallway',
                    },
                    requirements: [
                        {
                            section: 'main',
                            progressionMistTransformation: true,
                            progressionUnlockBlueDoors: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 1072,
                        positionY: 128,
                        // section: 'main',
                    },
                    requirements: [
                        {
                            section: 'leftOfSpikeHallway',
                            progressionMistTransformation: true,
                            progressionUnlockBlueDoors: true,
                            itemSpikeBreaker: {
                                minimum: 1,
                            },
                            costs: {
                                time: 1.999,
                            },
                        },
                    ],
                },
            },
        },
        statueLedge: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
        triggerTeleporterToCastleKeep: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToColosseum: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToOlroxsQuarters: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        walkwayBetweenTowers: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8 + 128,
                        positionY: 128,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1280 + 8 - 128,
                        positionY: 128,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        walkwayLeftOfHippogryph: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8 + 128,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        walkwayRightOfHippogryph: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8 - 128,
                        positionY: 128,
                        staleLocation: true,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
    },
    undergroundCaverns: {
        bandannaRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        claymoreStairwell: {
            roomInfo: {
                width: 256,
                height: 1024,
            },
            regions: [
                getRegion('main', 0, 0, 256, 1024),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        crystalBend: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 80,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        crystalCloakRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        dKBridge: {
            // TODO(sestren): Add logic for bridge break
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 1024 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 896,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        dKButton: {
            // TODO(sestren): Add logic for DK button
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToAbandonedMine: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        exitToCastleEntrance: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 384,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        falseSaveRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        hiddenCrystalEntrance: {
            roomInfo: {
                width: 256,
                height: 768,
            },
            regions: [
                getRegion('main', 0, 0, 256, 768),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 136,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('batForm', 'main', 1.999),
                        getMovement('gravityJump', 'main', 1.999),
                        getMovement('poweredMistForm', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 640,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    // TODO(sestren): Handle logic for breakable floor
                    outcome: {
                        positionX: 104,
                        positionY: 768 + 24,
                    },
                    requirements: [
                        getMovement('fall', 'main', 1.999),
                    ],
                },
            },
        },
        holySymbolRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        iceFloeRoom: {
            roomInfo: {
                width: 2304,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 2304, 512),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitTop: {
                    outcome: {
                        positionX: 2176,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 2304 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        leftFerrymanRoute: {
            roomInfo: {
                width: 3328,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 3328, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 2144,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 3328 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToAbandonedMine: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCastleEntrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        longDrop: {
            roomInfo: {
                width: 256,
                height: 2816,
            },
            regions: [
                getRegion('main', 0, 0, 256, 800),
                getRegion('leftLedge', 16, 864, 32, 64),
                getRegion('rightLedge', 208, 864, 48, 64),
                getRegion('pit', 80, 2768, 112, 48),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightMiddle: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 896,
                    },
                    requirements: [
                        getMovement('basic', 'rightLedge', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 136,
                        positionY: 2792,
                    },
                    requirements: [
                        getMovement('fall', 'pit', 1.999),
                    ],
                },
                toMain: {
                    outcome: {
                        positionX: 240,
                        positionY: 128,
                        // section: 'main',
                    },
                    requirements: [
                        getMovement('batForm', 'leftLedge', 1.999),
                        getMovement('multipleGravityJumps', 'leftLedge', 1.999),
                        getMovement('poweredMistForm', 'leftLedge', 1.999),
                        getMovement('batForm', 'rightLedge', 1.999),
                        getMovement('multipleGravityJumps', 'rightLedge', 1.999),
                        getMovement('poweredMistForm', 'rightLedge', 1.999),
                        getMovement('batForm', 'pit', 1.999),
                        getMovement('multipleGravityJumps', 'pit', 1.999),
                        getMovement('poweredMistForm', 'pit', 1.999),
                    ],
                },
                toLeftLedge: {
                    outcome: {
                        positionX: 32,
                        positionY: 896,
                        // section: 'leftLedge',
                    },
                    requirements: [
                        getMovement('fall', 'main', 1.999),
                        getMovement('batForm', 'rightLedge', 1.999),
                        getMovement('multipleGravityJumps', 'rightLedge', 1.999),
                        getMovement('poweredMistForm', 'rightLedge', 1.999),
                        getMovement('batForm', 'pit', 1.999),
                        getMovement('multipleGravityJumps', 'pit', 1.999),
                        getMovement('poweredMistForm', 'pit', 1.999),
                    ],
                },
                toRightLedge: {
                    outcome: {
                        positionX: 232,
                        positionY: 896,
                        // section: 'rightLedge',
                    },
                    requirements: [
                        getMovement('batForm', 'leftLedge', 1.999),
                        getMovement('multipleGravityJumps', 'leftLedge', 1.999),
                        getMovement('poweredMistForm', 'leftLedge', 1.999),
                        getMovement('batForm', 'pit', 1.999),
                        getMovement('multipleGravityJumps', 'pit', 1.999),
                        getMovement('poweredMistForm', 'pit', 1.999),
                    ],
                },
                toPit: {
                    outcome: {
                        positionX: 136,
                        positionY: 2792,
                        // section: 'pit',
                    },
                    requirements: [
                        getMovement('fall', 'main', 1.999),
                        getMovement('fall', 'leftLedge', 1.999),
                        getMovement('fall', 'rightLedge', 1.999),
                    ],
                },
            },
        },
        mealTicketsAndMoonstoneRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        mermanStatueRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        pentagramRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        plaqueRoomWithBreakableWall: {
            // TODO(sestren): Add logic for breakable wall
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        plaqueRoomWithLifeMaxUp: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('fall', 'main', 1.999),
                    ],
                },
            },
        },
        rightFerrymanRoute: {
            // TODO(sestren): Add logic for Ferryman gate
            roomInfo: {
                width: 3328,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 3328, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 3328 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        risingWaterRoom: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitTop: {
                    outcome: {
                        positionX: 896,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId09: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId10: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId11: {
            roomInfo: {
                width: 768,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 768, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 768 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId12: {
            roomInfo: {
                width: 512,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 512, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId18: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        roomId19: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
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
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        scyllaRoom: {
            roomInfo: {
                width: 1280,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 1280, 256),
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 896,
                        positionY: 256 + 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        scyllaWyrmRoom: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        smallStairwell: {
            roomInfo: {
                width: 256,
                height: 512,
            },
            regions: [
                getRegion('main', 0, 0, 256, 512),
            ],
            commands: {
                exitTop: {
                    outcome: {
                        positionX: 128,
                        positionY: 0 - 24,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 384,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        tallStairwell: {
            roomInfo: {
                width: 256,
                height: 2304,
            },
            regions: [
                getRegion('main', 0, 0, 256, 2304),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 1664,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitBottom: {
                    outcome: {
                        positionX: 128,
                        positionY: 2304 + 24,
                    },
                    requirements: [
                        getMovement('fall', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToAbandonedMine: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToBossSuccubus: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToCastleEntrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToMarbleGallery: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        waterfall: {
            // TODO(sestren): Add flight logic
            roomInfo: {
                width: 512,
                height: 1536,
            },
            regions: [
                getRegion('main', 0, 0, 512, 1536),
            ],
            commands: {
                exitLeftUpper: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightUpper: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitLeftLower: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 1408,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRightLower: {
                    outcome: {
                        positionX: 512 + 8,
                        positionY: 1408,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
    },
    warpRooms: {
        loadingRoomToAbandonedMine: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCastleEntrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToCastleKeep: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOlroxsQuarters: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        loadingRoomToOuterWall: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
            },
        },
        triggerTeleporterToAbandonedMine: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToCastleEntrance: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToCastleKeep: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToOlroxsQuarters: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        triggerTeleporterToOuterWall: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                getRegion('main', 0, 0, 256, 256),
            ],
            commands: {},
        },
        warpRoomToAbandonedMine: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                {
                    requirements: [
                        {
                            positionX: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                            positionY: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                        }
                    ],
                    outcome: {
                        section: 'main',
                        statusWarpRoomToAbandonedMineUnlocked: true,
                    },
                }
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                teleportToOuterWall: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToOuterWall',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToOuterWallUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToCastleKeep: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleKeep',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToOuterWallUnlocked: false,
                            statusWarpRoomToCastleKeepUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToOlroxsQuarters: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToOlroxsQuarters',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToOuterWallUnlocked: false,
                            statusWarpRoomToCastleKeepUnlocked: false,
                            statusWarpRoomToOlroxsQuartersUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToCastleEntrance: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleEntrance',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToOuterWallUnlocked: false,
                            statusWarpRoomToCastleKeepUnlocked: false,
                            statusWarpRoomToOlroxsQuartersUnlocked: false,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
            },
        },
        warpRoomToCastleEntrance: {
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
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                teleportToAbandonedMine: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToAbandonedMine',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToAbandonedMineUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToOuterWall: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToOuterWall',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToAbandonedMineUnlocked: false,
                            statusWarpRoomToOuterWallUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToCastleKeep: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleKeep',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToAbandonedMineUnlocked: false,
                            statusWarpRoomToOuterWallUnlocked: false,
                            statusWarpRoomToCastleKeepUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToOlroxsQuarters: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToOlroxsQuarters',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToAbandonedMineUnlocked: false,
                            statusWarpRoomToOuterWallUnlocked: false,
                            statusWarpRoomToCastleKeepUnlocked: false,
                            statusWarpRoomToOlroxsQuartersUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToCastleEntrance: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleEntrance',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToAbandonedMineUnlocked: false,
                            statusWarpRoomToOuterWallUnlocked: false,
                            statusWarpRoomToCastleKeepUnlocked: false,
                            statusWarpRoomToOlroxsQuartersUnlocked: false,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
            },
        },
        warpRoomToCastleKeep: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                {
                    requirements: [
                        {
                            positionX: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                            positionY: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                        }
                    ],
                    outcome: {
                        section: 'main',
                        statusWarpRoomToCastleKeepUnlocked: true,
                    },
                }
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                teleportToOlroxsQuarters: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToOlroxsQuarters',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToOlroxsQuartersUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToCastleEntrance: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleEntrance',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToOlroxsQuartersUnlocked: false,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
            },
        },
        warpRoomToOlroxsQuarters: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                {
                    requirements: [
                        {
                            positionX: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                            positionY: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                        }
                    ],
                    outcome: {
                        section: 'main',
                        statusWarpRoomToOlroxsQuartersUnlocked: true,
                    },
                }
            ],
            commands: {
                exitLeft: {
                    outcome: {
                        positionX: 0 - 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                teleportToCastleEntrance: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleEntrance',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
            },
        },
        warpRoomToOuterWall: {
            roomInfo: {
                width: 256,
                height: 256,
            },
            regions: [
                {
                    requirements: [
                        {
                            positionX: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                            positionY: {
                                minimum: 0,
                                maximum: 0 + 256 - 1,
                            },
                        }
                    ],
                    outcome: {
                        section: 'main',
                        statusWarpRoomToOuterWallUnlocked: true,
                    },
                }
            ],
            commands: {
                exitRight: {
                    outcome: {
                        positionX: 256 + 8,
                        positionY: 128,
                    },
                    requirements: [
                        getMovement('basic', 'main', 1.999),
                    ],
                },
                teleportToCastleKeep: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleKeep',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToCastleKeepUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToOlroxsQuarters: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToOlroxsQuarters',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToCastleKeepUnlocked: false,
                            statusWarpRoomToOlroxsQuartersUnlocked: true,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
                teleportToCastleEntrance: {
                    outcome: {
                        positionX: 128,
                        positionY: 160,
                        room: 'warpRoomToCastleEntrance',
                        section: 'main',
                    },
                    requirements: [
                        {
                            section: 'main',
                            statusWarpRoomToCastleKeepUnlocked: false,
                            statusWarpRoomToOlroxsQuartersUnlocked: false,
                            costs: {
                                time: 1.999,
                            },
                        }
                    ],
                },
            },
        },
    },
}

const teleporterTargetsInfo = {
    fromAbandonedMineToCatacombs: { // fromCatacombsToAbandonedMine
        sourceStage: 'abandonedMine',
        targetStage: 'catacombs',
        room: 'bend',
        positionX: 16,
        positionY: 388,
    },
    fromAbandonedMineToUndergroundCaverns: { // fromUndergroundCavernsToAbandonedMine
        sourceStage: 'abandonedMine',
        targetStage: 'undergroundCaverns',
        room: 'wolfsHeadColumn',
        positionX: 240,
        positionY: 132,
    },
    fromAbandonedMineToWarpRooms: { // fromWarpRoomsToAbandonedMine
        sourceStage: 'abandonedMine',
        targetStage: 'warpRooms',
        room: 'fourWayIntersection',
        positionX: 752,
        positionY: 132,
    },
    fromAlchemyLaboratoryToCastleEntrance: { // fromCastleEntranceToAlchemyLaboratory
        sourceStage: 'alchemyLaboratory',
        targetStage: 'castleEntrance',
        room: 'entryway',
        positionX: 752,
        positionY: 132,
    },
    fromAlchemyLaboratoryToMarbleGallery: { // fromMarbleGalleryToAlchemyLaboratory
        sourceStage: 'alchemyLaboratory',
        targetStage: 'marbleGallery',
        room: 'exitToMarbleGallery',
        positionX: 496,
        positionY: 392,
    },
    fromAlchemyLaboratoryToRoyalChapel: { // fromRoyalChapelToAlchemyLaboratory
        sourceStage: 'alchemyLaboratory',
        targetStage: 'royalChapel',
        room: 'exitToRoyalChapel',
        positionX: 16,
        positionY: 132,
    },
    fromCastleEntranceToAlchemyLaboratory: { // fromAlchemyLaboratoryToCastleEntrance
        sourceStage: 'castleEntrance',
        targetStage: 'alchemyLaboratory',
        room: 'cubeOfZoeRoom',
        positionX: 16,
        positionY: 132,
    },
    fromCastleEntranceToMarbleGallery: { // fromMarbleGalleryToCastleEntrance
        sourceStage: 'castleEntrance',
        targetStage: 'marbleGallery',
        room: 'cubeOfZoeRoom',
        positionX: 496,
        positionY: 132,
    },
    fromCastleEntranceToUndergroundCaverns: { // fromUndergroundCavernsToCastleEntrance
        sourceStage: 'castleEntrance',
        targetStage: 'undergroundCaverns',
        room: 'shortcutToUndergroundCaverns',
        positionX: 240,
        positionY: 132,
    },
    fromCastleEntranceToWarpRooms: { // fromWarpRoomsToCastleEntrance
        sourceStage: 'castleEntrance',
        targetStage: 'warpRooms',
        room: 'shortcutToWarpRooms',
        positionX: 16,
        positionY: 132,
    },
    fromCastleKeepToClockTower: { // fromClockTowerToCastleKeep
        sourceStage: 'castleKeep',
        targetStage: 'clockTower',
        room: 'lionTorchPlatform',
        positionX: 240,
        positionY: 388,
    },
    fromCastleKeepToRoyalChapel: { // fromRoyalChapelToCastleKeep
        sourceStage: 'castleKeep',
        targetStage: 'royalChapel',
        room: 'keepArea',
        positionX: 16,
        positionY: 1924,
    },
    fromCastleKeepToWarpRooms: { // fromWarpRoomsToCastleKeep
        sourceStage: 'castleKeep',
        targetStage: 'warpRooms',
        room: 'dualPlatforms',
        positionX: 240,
        positionY: 388,
    },
    fromCatacombsToAbandonedMine: { // fromAbandonedMineToCatacombs
        sourceStage: 'catacombs',
        targetStage: 'abandonedMine',
        room: 'exitToAbandonedMine',
        positionX: 240,
        positionY: 132,
    },
    fromClockTowerToCastleKeep: { // fromCastleKeepToClockTower
        sourceStage: 'clockTower',
        targetStage: 'castleKeep',
        room: 'karasumansRoom',
        positionX: 16,
        positionY: 132,
    },
    fromClockTowerToOuterWall: { // fromOuterWallToClockTower
        sourceStage: 'clockTower',
        targetStage: 'outerWall',
        room: 'stairwellToOuterWall',
        positionX: 240,
        positionY: 132,
    },
    fromColosseumToOlroxsQuarters: { // fromOlroxsQuartersToColosseum
        sourceStage: 'colosseum',
        targetStage: 'olroxsQuarters',
        room: 'topOfElevatorShaft',
        positionX: 1264,
        positionY: 132,
    },
    fromColosseumToRoyalChapel: { // fromRoyalChapelToColosseum
        sourceStage: 'colosseum',
        targetStage: 'royalChapel',
        room: 'passagewayBetweenArenaAndRoyalChapel',
        positionX: 16,
        positionY: 132,
    },
    fromLongLibraryToOuterWall: { // fromOuterWallToLongLibrary
        sourceStage: 'longLibrary',
        targetStage: 'outerWall',
        room: 'exitToOuterWall',
        positionX: 752,
        positionY: 132,
    },
    fromMarbleGalleryToAlchemyLaboratory: { // fromAlchemyLaboratoryToMarbleGallery
        sourceStage: 'marbleGallery',
        targetStage: 'alchemyLaboratory',
        room: 'entrance',
        positionX: 16,
        positionY: 132,
    },
    fromMarbleGalleryToCastleEntrance: { // fromCastleEntranceToMarbleGallery
        sourceStage: 'marbleGallery',
        targetStage: 'castleEntrance',
        room: 'sShapedHallways',
        positionX: 16,
        positionY: 644,
    },
    fromMarbleGalleryToOlroxsQuarters: { // fromOlroxsQuartersToMarbleGallery
        sourceStage: 'marbleGallery',
        targetStage: 'olroxsQuarters',
        room: 'pathwayAfterLeftStatue',
        positionX: 16,
        positionY: 132,
    },
    fromMarbleGalleryToOuterWall: { // fromOuterWallToMarbleGallery
        sourceStage: 'marbleGallery',
        targetStage: 'outerWall',
        room: 'longHallway',
        positionX: 3824,
        positionY: 132,
    },
    fromMarbleGalleryToUndergroundCaverns: { // fromUndergroundCavernsToMarbleGallery
        sourceStage: 'marbleGallery',
        targetStage: 'undergroundCaverns',
        room: 'stairwellToUndergroundCaverns',
        positionX: 16,
        positionY: 388,
    },
    fromOlroxsQuartersToColosseum: { // fromColosseumToOlroxsQuarters
        sourceStage: 'olroxsQuarters',
        targetStage: 'colosseum',
        room: 'grandStaircase',
        positionX: 16,
        positionY: 388,
    },
    fromOlroxsQuartersToMarbleGallery: { // fromMarbleGalleryToOlroxsQuarters
        sourceStage: 'olroxsQuarters',
        targetStage: 'marbleGallery',
        room: 'skelerangRoom',
        positionX: 240,
        positionY: 648,
    },
    fromOlroxsQuartersToRoyalChapel: { // fromRoyalChapelToOlroxsQuarters
        sourceStage: 'olroxsQuarters',
        targetStage: 'royalChapel',
        room: 'catwalkCrypt',
        positionX: 16,
        positionY: 132,
    },
    fromOlroxsQuartersToWarpRooms: { // fromWarpRoomsToOlroxsQuarters
        sourceStage: 'olroxsQuarters',
        targetStage: 'warpRooms',
        room: 'tallShaft',
        positionX: 240,
        positionY: 1412,
    },
    fromOuterWallToClockTower: { // fromClockTowerToOuterWall
        sourceStage: 'outerWall',
        targetStage: 'clockTower',
        room: 'exitToClockTower',
        positionX: 16,
        positionY: 132,
    },
    fromOuterWallToLongLibrary: { // fromLongLibraryToOuterWall
        sourceStage: 'outerWall',
        targetStage: 'longLibrary',
        room: 'elevatorShaftRoom',
        positionX: 16,
        positionY: 1672,
    },
    fromOuterWallToMarbleGallery: { // fromMarbleGalleryToOuterWall
        sourceStage: 'outerWall',
        targetStage: 'marbleGallery',
        room: 'exitToMarbleGallery',
        positionX: 16,
        positionY: 132,
    },
    fromOuterWallToWarpRooms: { // fromWarpRoomsToOuterWall
        sourceStage: 'outerWall',
        targetStage: 'warpRooms',
        room: 'elevatorShaftRoom',
        positionX: 272,
        positionY: 644,
    },
    fromRoyalChapelToAlchemyLaboratory: { // fromAlchemyLaboratoryToRoyalChapel
        sourceStage: 'royalChapel',
        targetStage: 'alchemyLaboratory',
        room: 'statueLedge',
        positionX: 240,
        positionY: 132,
    },
    fromRoyalChapelToCastleKeep: { // fromCastleKeepToRoyalChapel
        sourceStage: 'royalChapel',
        targetStage: 'castleKeep',
        room: 'rightTower',
        positionX: 752,
        positionY: 648,
    },
    fromRoyalChapelToColosseum: { // fromColosseumToRoyalChapel
        sourceStage: 'royalChapel',
        targetStage: 'colosseum',
        room: 'nave',
        positionX: 496,
        positionY: 388,
    },
    fromRoyalChapelToOlroxsQuarters: { // fromOlroxsQuartersToRoyalChapel
        sourceStage: 'royalChapel',
        targetStage: 'olroxsQuarters',
        room: 'pushingStatueShortcut',
        positionX: 240,
        positionY: 132,
    },
    fromUndergroundCavernsToAbandonedMine: { // fromAbandonedMineToUndergroundCaverns
        sourceStage: 'undergroundCaverns',
        targetStage: 'abandonedMine',
        room: 'exitToAbandonedMine',
        positionX: 16,
        positionY: 132,
    },
    fromUndergroundCavernsToCastleEntrance: { // fromCastleEntranceToUndergroundCaverns
        sourceStage: 'undergroundCaverns',
        targetStage: 'castleEntrance',
        room: 'exitToCastleEntrance',
        positionX: 16,
        positionY: 132,
    },
    fromUndergroundCavernsToMarbleGallery: { // fromMarbleGalleryToUndergroundCaverns
        sourceStage: 'undergroundCaverns',
        targetStage: 'marbleGallery',
        room: 'longDrop',
        positionX: 240,
        positionY: 132,
    },
    fromWarpRoomsToAbandonedMine: { // fromAbandonedMineToWarpRooms
        sourceStage: 'warpRooms',
        targetStage: 'abandonedMine',
        room: 'warpRoomToAbandonedMine',
        positionX: 16,
        positionY: 132,
    },
    fromWarpRoomsToCastleEntrance: { // fromCastleEntranceToWarpRooms
        sourceStage: 'warpRooms',
        targetStage: 'castleEntrance',
        room: 'warpRoomToCastleEntrance',
        positionX: 240,
        positionY: 132,
    },
    fromWarpRoomsToCastleKeep: { // fromCastleKeepToWarpRooms
        sourceStage: 'warpRooms',
        targetStage: 'castleKeep',
        room: 'warpRoomToCastleKeep',
        positionX: 16,
        positionY: 132,
    },
    fromWarpRoomsToOlroxsQuarters: { // fromOlroxsQuartersToWarpRooms
        sourceStage: 'warpRooms',
        targetStage: 'olroxsQuarters',
        room: 'warpRoomToOlroxsQuarters',
        positionX: 16,
        positionY: 132,
    },
    fromWarpRoomsToOuterWall: { // fromOuterWallToWarpRooms
        sourceStage: 'warpRooms',
        targetStage: 'outerWall',
        room: 'warpRoomToOuterWall',
        positionX: 240,
        positionY: 132,
    },
}

function isValidRequirement(state, requirement) {
    const result = Object.entries(requirement)
    .every(([propertyKey, propertyInfo]) => {
        let stateValue
        switch (typeof propertyInfo) {
            case 'boolean':
                stateValue = false
                if (propertyKey in state) {
                    stateValue = state[propertyKey]
                }
                if (stateValue !== propertyInfo) {
                    return false
                }
                break
            case 'string':
                stateValue = 'NONE'
                if (propertyKey in state) {
                    stateValue = state[propertyKey]
                }
                if (stateValue !== propertyInfo) {
                    return false
                }
                break
            case 'object':
                stateValue = 0
                if (propertyKey in state) {
                    stateValue = state[propertyKey]
                }
                if ('minimum' in propertyInfo) {
                    if (stateValue < propertyInfo.minimum) {
                        return false
                    }
                }
                if ('maximum' in propertyInfo) {
                    if (stateValue > propertyInfo.maximum) {
                        return false
                    }
                }
                break
            default:
                console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                break
        }
        return true
    })
    return result
}

function updateStateWithOutcome(state, outcome) {
    Object.entries(outcome)
    .forEach(([propertyKey, propertyInfo]) => {
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

function updateLocation(location, settings) {
    // console.log(location)
    // Determine which room the player is in
    if (
        !(location.staleLocation ?? false) &&
        location.positionX >= 0 &&
        location.positionX < roomsInfo[location.stage][location.room].roomInfo.width &&
        location.positionY >= 0 &&
        location.positionY < roomsInfo[location.stage][location.room].roomInfo.height
    ) {
        // Player is inside the bounds of the current room, so current room stays the same
        // TODO(sestren): This assumption might not work for the secret staircase in Castle Keep
    }
    else {
        // Calculate global position
        const globalPosition = {
            x: 0,
            y: 0,
        }
        settings.roomPositions
        .find((roomPosition) => {
            if (
                roomPosition.stage === location.stage &&
                roomPosition.room === location.room
            ) {
                globalPosition.x = 256 * roomPosition.column + location.positionX
                globalPosition.y = 256 * roomPosition.row + location.positionY
                return true
            }
            return false
        })
        const roomDimensions = getRoomDimensions(settings.roomPositions)
        // Find first room in the priority list that overlaps the global position
        roomPriority[location.stage]
        .find((roomName) => {
            const roomDimension = roomDimensions[location.stage][roomName]
            if (
                globalPosition.x >= roomDimension.left &&
                globalPosition.x < roomDimension.right &&
                globalPosition.y >= roomDimension.top &&
                globalPosition.y < roomDimension.bottom
            ) {
                location.room = roomName
                location.positionX = globalPosition.x - roomDimension.left
                location.positionY = globalPosition.y - roomDimension.top
                location.staleLocation = false
                return true
            }
            return false
        })
    }
    // Find first section that satisfies requirements for the room-relative position
    roomsInfo[location.stage][location.room].regions
    .find((regionInfo) => {
        location.section = 'NONE'
        let validRegion = false
        regionInfo.requirements
        .find((requirementInfo) => {
            const validRequirement = isValidRequirement(location, requirementInfo)
            if (validRequirement) {
                updateStateWithOutcome(location, regionInfo.outcome)
                validRegion = true
            }
            return validRequirement
        })
        return validRegion
    })
}

function getLogic(settings) {
    const result = {
        global: {},
    }
    // Process every room command
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
                    const command = {
                        outcome: JSON.parse(JSON.stringify(commandInfo.outcome)),
                        requirement: {},
                    }
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
                    // NOTE(sestren): Location is the only "weird" set of properties
                    if (
                        'stage' in command.outcome ||
                        'room' in command.outcome ||
                        'section' in command.outcome ||
                        'positionX' in command.outcome ||
                        'positionY' in command.outcome
                    ) {
                        const location = {
                            stage: stageName,
                            room: roomName,
                            section: command.outcome.section ?? command.requirement.section ?? 'NONE',
                            positionX: command.outcome.positionX ?? 0,
                            positionY: command.outcome.positionY ?? 0,
                        }

                        updateLocation(location, settings)
                        Object.entries(location)
                        .forEach(([propertyKey, propertyValue]) => {
                            command.outcome[propertyKey] = propertyValue
                        })
                    }
                    result[stageName][roomName].push(command)
                })
            })
        })
    })
    // Process every location-reward combination
    Object.entries(settings.locationRewards)
    .forEach(([locationName, rewardName]) => {
        // Process every location requirement (Only certain stages for now)
        locationsInfo[locationName].requirements
        .filter((locationRequirementInfo) => {
            return locationRequirementInfo.stage in roomPriority
        })
        .forEach((locationRequirementInfo) => {
            const stageName = locationRequirementInfo.stage
            const roomName = locationRequirementInfo.room
            const location = {
                stage: stageName,
                room: roomName,
                section: 'NONE',
                positionX: locationsInfo[locationName].outcome.positionX,
                positionY: locationsInfo[locationName].outcome.positionY,
            }
            updateLocation(location, settings)
            // Process every reward requirement
            rewardsInfo[rewardName].requirements
            .forEach((rewardRequirementInfo) => {
                const command = {
                    outcome: {},
                    requirement: {},
                }
                Object.assign(command.outcome, locationsInfo[locationName].outcome)
                Object.assign(command.outcome, rewardsInfo[rewardName].outcome)
                Object.assign(command.requirement, locationRequirementInfo)
                Object.entries(rewardRequirementInfo)
                .forEach(([propertyKey, propertyInfo]) => {
                    if (propertyKey == 'costs') {
                        Object.entries(propertyInfo)
                        .forEach(([costKey, costValue]) => {
                            switch (typeof costValue) {
                                case 'number':
                                    command.requirement[costKey] = {
                                        minimum: costValue,
                                    }
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
                command.requirement.section = location.section
                result[stageName][roomName].push(command)
            })
        })
    })
    // Process every stage link
    Object.entries(settings.stageLinks)
    .filter(([sourceTeleporterName, targetTeleporterName]) => {
        // TODO(sestren): Process more teleporters
        return (
            (
                sourceTeleporterName.startsWith('fromAbandonedMine') ||
                sourceTeleporterName.startsWith('fromAlchemyLaboratory') ||
                sourceTeleporterName.startsWith('fromCastleEntrance') ||
                sourceTeleporterName.startsWith('fromCastleKeep') ||
                sourceTeleporterName.startsWith('fromCatacombs') ||
                sourceTeleporterName.startsWith('fromClockTower') ||
                sourceTeleporterName.startsWith('fromColosseum') ||
                sourceTeleporterName.startsWith('fromLongLibrary') ||
                sourceTeleporterName.startsWith('fromMarbleGallery') ||
                sourceTeleporterName.startsWith('fromOlroxsQuarters') ||
                sourceTeleporterName.startsWith('fromOuterWall') ||
                sourceTeleporterName.startsWith('fromRoyalChapel') ||
                sourceTeleporterName.startsWith('fromUndergroundCaverns') ||
                sourceTeleporterName.startsWith('fromWarpRooms')
            ) && (
                targetTeleporterName.startsWith('fromAbandonedMine') ||
                targetTeleporterName.startsWith('fromAlchemyLaboratory') ||
                targetTeleporterName.startsWith('fromCastleEntrance') ||
                targetTeleporterName.startsWith('fromCastleKeep') ||
                targetTeleporterName.startsWith('fromCatacombs') ||
                targetTeleporterName.startsWith('fromClockTower') ||
                targetTeleporterName.startsWith('fromColosseum') ||
                targetTeleporterName.startsWith('fromLongLibrary') ||
                targetTeleporterName.startsWith('fromMarbleGallery') ||
                targetTeleporterName.startsWith('fromOlroxsQuarters') ||
                targetTeleporterName.startsWith('fromOuterWall') ||
                targetTeleporterName.startsWith('fromRoyalChapel') ||
                targetTeleporterName.startsWith('fromUndergroundCaverns') ||
                targetTeleporterName.startsWith('fromWarpRooms')
            )
        )
    })
    .forEach(([sourceTeleporterName, targetTeleporterName]) => {
        const location = {
            stage: teleporterTargetsInfo[targetTeleporterName].sourceStage,
            room: teleporterTargetsInfo[targetTeleporterName].room,
            section: 'NONE',
            positionX: teleporterTargetsInfo[targetTeleporterName].positionX,
            positionY: teleporterTargetsInfo[targetTeleporterName].positionY,
        }
        updateLocation(location, settings)
        const command = {
            outcome: location,
            requirement: {},
        }
        const sourceStageName = teleporterTargetsInfo[sourceTeleporterName].sourceStage
        const otherStageName = teleporterTargetsInfo[sourceTeleporterName].targetStage
        const sourceRoomName = 'triggerTeleporterTo' + otherStageName.at(0).toUpperCase() + otherStageName.slice(1)
        result[sourceStageName][sourceRoomName].push(command)
    })
    return result
}

function hashedState(state) {
    const prefixState = JSON.stringify(state,
        Object.keys(state).filter((key) => {
            return (['stage', 'room', 'section'].includes(key))
        }).sort(), 4
    )
    const prefix = hashedText(prefixState)
    const suffixState = JSON.stringify(state,
        Object.keys(state).filter((key) => {
            return !(['stage', 'room', 'section', 'time', 'positionX', 'positionY'].includes(key))
        }).sort(), 4
    )
    const suffix = hashedText(suffixState)
    const result = prefix + '-' + suffix
    return result
}

// Javascript implementation of DJBX33A as defined at https://stackoverflow.com/questions/10696223/reason-for-the-number-5381-in-the-djb-hash-function
function hashedText(text) {
    const MOD = Math.pow(2, 32)
    let value = 5381
    for (let i = 0; i < text.length; i++) {
        value = ((33 * value) + text.charCodeAt(i)) % MOD
    }
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += '0123456789abcdef'.at(value % 16)
        value = Math.floor(value / 16)
    }
    return result
}

const goalLocations = [
    'locationBatCard',
    'locationCubeOfZoe',
    'locationDemonCard',
    'locationEchoOfBat',
    'locationFaerieCard',
    'locationFaerieScroll',
    'locationFireOfBat',
    // SKIP 'locationForceOfEcho',
    'locationFormOfMist',
    // SKIP 'locationGasCloud',
    'locationGhostCard',
    'locationGoldRing',
    'locationGravityBoots',
    'locationHolySymbol',
    'locationJewelOfOpen',
    'locationLeapStone',
    'locationMermanStatue',
    'locationPowerOfMist',
    'locationPowerOfWolf',
    'locationSilverRing',
    'locationSkillOfWolf',
    'locationSoulOfBat',
    'locationSoulOfWolf',
    'locationSpikeBreaker',
    'locationSpiritOrb',
    'locationSwordCard',
]

export function analyzeLogic(seed, settings) {
    const rng = seedrandom(seed)
    const result = {
        solvable: false,
    }
    // console.log('settings:', JSON.stringify(settings, null, 4))
    const logic = getLogic(settings)
    // console.log('logic:', JSON.stringify(logic, null, 4))
    const mainWork = [
        {
            stage: 'castleEntrance',
            room: 'afterDrawbridge',
            section: 'main',
            positionX: 136,
            positionY: 640,
            time: 90.0,
        },
    ]
    while (mainWork.length > 0) {
        if (result.solvable) {
            break
        }
        const startingState = mainWork.pop()
        let goalCompletionCount = 0
        goalLocations.forEach((locationName) => {
            if (startingState[locationName] ?? false) {
                goalCompletionCount += 1
                return
            }
            let successfulState = null
            const goalState = {}
            goalState[locationName] = true
            const map = new Map()
            const subWork = [
                Object.assign({}, startingState),
            ]
            while (subWork.length > 0) {
                // console.log('subWork.length:', subWork.length, 'map.size:', map.size)
                const currentState = subWork.pop()
                const currentStateHash = hashedState(currentState)
                if (
                    map.has(currentStateHash) &&
                    map.get(currentStateHash) >= currentState.time
                ) {
                    continue
                }
                map.set(currentStateHash, currentState.time)
                logic[currentState.stage][currentState.room]
                .find((command) => {
                    if (isValidRequirement(currentState, command.requirement)) {
                        const nextState = Object.assign({}, currentState)
                        hashedState(nextState)
                        updateStateWithOutcome(nextState, command.outcome)
                        if (isValidRequirement(nextState, goalState)) {
                            successfulState = nextState
                            console.log('successfulState:', JSON.stringify(nextState, Object.keys(nextState).sort(), 4))
                            return true
                        }
                        subWork.push(nextState)
                    }
                    return false
                })
                if (successfulState !== null) {
                    break
                }
            }
            if (successfulState) {
                successfulState.time = 90.0
                mainWork.push(successfulState)
            }
        })
        console.log('goalCompletionCount:', goalCompletionCount)
        if (goalCompletionCount >= 12) {
            result.solvable = true
        }
    }
    console.log('')
    return result
}