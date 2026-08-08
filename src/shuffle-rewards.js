import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

// TODO(sestren): solver-reward interactivity
// Solver asks for a random reward that is left that satisfies a constraint (e.g., gives progression) and returns the location it placed it into

const REWARD_IDS = {
    relicSoulOfBat: 0,
    relicFireOfBat: 1,
    relicEchoOfBat: 2,
    relicForceOfEcho: 3,
    relicSoulOfWolf: 4,
    relicPowerOfWolf: 5,
    relicSkillOfWolf: 6,
    relicFormOfMist: 7,
    relicPowerOfMist: 8,
    relicGasCloud: 9,
    relicCubeOfZoe: 10,
    relicSpiritOrb: 11,
    relicGravityBoots: 12,
    relicLeapStone: 13,
    relicHolySymbol: 14,
    relicFaerieScroll: 15,
    relicJewelOfOpen: 16,
    relicMermanStatue: 17,
    relicBatCard: 18,
    relicGhostCard: 19,
    relicFaerieCard: 20,
    relicDemonCard: 21,
    relicSwordCard: 22,
    relicSpriteCard: 23,
    relicNosedevilCard: 24,
    relicHeartOfVlad: 25,
    relicToothOfVlad: 26,
    relicRibOfVlad: 27,
    relicRingOfVlad: 28,
    relicEyeOfVlad: 29,
    itemSpikeBreaker: 'itemSpikeBreaker',
    itemGoldRing: 'itemGoldRing',
    itemSilverRing: 'itemSilverRing',
}

const LOCATIONS = {
    locationBatCard: {
        defaultValue: 'relicBatCard',
        validRewardTypes: [ 'relic', ],
        // TODO(sestren): Allow replacing with an item (dropUnusedItem1, dropUnusedItem2)
        writes: {
            relic: [
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.alchemyLaboratory.constants.breakableContainerDrops.batCard',
                    ],
                },
            ],
        },
    },
    locationCubeOfZoe: {
        defaultValue: 'relicCubeOfZoe',
        validRewardTypes: [ 'relic', ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.castleEntrance.entities.horizontal.locationCubeOfZoe.entityTypeId',
                        'stages.castleEntrance.entities.vertical.locationCubeOfZoe.entityTypeId',
                        'stages.castleEntranceRevisited.entities.horizontal.locationCubeOfZoe.entityTypeId',
                        'stages.castleEntranceRevisited.entities.vertical.locationCubeOfZoe.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.castleEntrance.entities.horizontal.locationCubeOfZoe.params',
                        'stages.castleEntrance.entities.vertical.locationCubeOfZoe.params',
                        'stages.castleEntranceRevisited.entities.horizontal.locationCubeOfZoe.params',
                        'stages.castleEntranceRevisited.entities.vertical.locationCubeOfZoe.params',
                    ],
                },
            ],
        },
    },
    locationDemonCard: {
        defaultValue: 'relicDemonCard',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.abandonedMine.entities.horizontal.locationDemonCard.entityTypeId',
                        'stages.abandonedMine.entities.vertical.locationDemonCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 2,
                    },
                    keys: [
                        'stages.abandonedMine.entities.horizontal.locationDemonCard.params',
                        'stages.abandonedMine.entities.vertical.locationDemonCard.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.abandonedMine.constants.uniqueItemDrops.dropUnusedItem',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.abandonedMine.entities.horizontal.locationDemonCard.entityTypeId',
                        'stages.abandonedMine.entities.vertical.locationDemonCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.abandonedMine.entities.horizontal.locationDemonCard.params',
                        'stages.abandonedMine.entities.vertical.locationDemonCard.params',
                    ],
                },
            ],
        },
    },
    locationEchoOfBat: {
        defaultValue: 'relicEchoOfBat',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationEchoOfBat.entityTypeId',
                        'stages.olroxsQuarters.entities.vertical.locationEchoOfBat.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 0,
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationEchoOfBat.params',
                        'stages.olroxsQuarters.entities.vertical.locationEchoOfBat.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.olroxsQuarters.constants.uniqueItemDrops.unusedItemDrop1',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationEchoOfBat.entityTypeId',
                        'stages.olroxsQuarters.entities.vertical.locationEchoOfBat.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationEchoOfBat.params',
                        'stages.olroxsQuarters.entities.vertical.locationEchoOfBat.params',
                    ],
                },
            ],
        },
    },
    locationFireOfBat: {
        defaultValue: 'relicFireOfBat',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.clockTower.entities.horizontal.locationFireOfBat.entityTypeId',
                        'stages.clockTower.entities.vertical.locationFireOfBat.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 2,
                    },
                    keys: [
                        'stages.clockTower.entities.horizontal.locationFireOfBat.params',
                        'stages.clockTower.entities.vertical.locationFireOfBat.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.clockTower.constants.uniqueItemDrops.dropStoneSword',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.clockTower.entities.horizontal.locationFireOfBat.entityTypeId',
                        'stages.clockTower.entities.vertical.locationFireOfBat.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.clockTower.entities.horizontal.locationFireOfBat.params',
                        'stages.clockTower.entities.vertical.locationFireOfBat.params',
                    ],
                },
            ],
        },
    },
    locationFormOfMist: {
        defaultValue: 'relicFormOfMist',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.colosseum.entities.horizontal.locationFormOfMist.entityTypeId',
                        'stages.colosseum.entities.vertical.locationFormOfMist.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 2,
                    },
                    keys: [
                        'stages.colosseum.entities.horizontal.locationFormOfMist.params',
                        'stages.colosseum.entities.vertical.locationFormOfMist.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.colosseum.constants.uniqueItemDrops.dropUnusedItem',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.colosseum.entities.horizontal.locationFormOfMist.entityTypeId',
                        'stages.colosseum.entities.vertical.locationFormOfMist.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.colosseum.entities.horizontal.locationFormOfMist.params',
                        'stages.colosseum.entities.vertical.locationFormOfMist.params',
                    ],
                },
            ],
        },
    },
    locationGhostCard: {
        defaultValue: 'relicGhostCard',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationGhostCard.entityTypeId',
                        'stages.castleKeep.entities.vertical.locationGhostCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 19,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationGhostCard.params',
                        'stages.castleKeep.entities.vertical.locationGhostCard.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.castleKeep.constants.uniqueItemDrops.dropUnusedItem2',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationGhostCard.entityTypeId',
                        'stages.castleKeep.entities.vertical.locationGhostCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationGhostCard.params',
                        'stages.castleKeep.entities.vertical.locationGhostCard.params',
                    ],
                },
            ],
        },
    },
    locationJewelOfOpen: {
        defaultValue: 'relicJewelOfOpen',
        validRewardTypes: [ 'relic', ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.longLibrary.constants.shopRelics.jewelOfOpen',
                    ],
                },
            ],
        },
    },
    locationPowerOfMist: {
        defaultValue: 'relicPowerOfMist',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationPowerOfMist.entityTypeId',
                        'stages.castleKeep.entities.vertical.locationPowerOfMist.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 17,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationPowerOfMist.params',
                        'stages.castleKeep.entities.vertical.locationPowerOfMist.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.castleKeep.constants.uniqueItemDrops.dropUnusedItem1',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationPowerOfMist.entityTypeId',
                        'stages.castleKeep.entities.vertical.locationPowerOfMist.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationPowerOfMist.params',
                        'stages.castleKeep.entities.vertical.locationPowerOfMist.params',
                    ],
                },
            ],
        },
    },
    locationGravityBoots: {
        defaultValue: 'relicGravityBoots',
        validRewardTypes: [ 'relic', ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.marbleGallery.entities.horizontal.locationGravityBoots.entityTypeId',
                        'stages.marbleGallery.entities.vertical.locationGravityBoots.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.marbleGallery.entities.horizontal.locationGravityBoots.params',
                        'stages.marbleGallery.entities.vertical.locationGravityBoots.params',
                    ],
                },
            ],
        },
    },
    locationHolySymbol: {
        defaultValue: 'relicHolySymbol',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationHolySymbol.entityTypeId',
                        'stages.undergroundCaverns.entities.vertical.locationHolySymbol.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 3,
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationHolySymbol.params',
                        'stages.undergroundCaverns.entities.vertical.locationHolySymbol.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): These item drop indices appear to be unused in the vanilla game
                        'stages.undergroundCaverns.constants.uniqueItemDrops.dropUnusedItem1',
                        'stages.bossScylla.constants.uniqueItemDrops.dropUnusedItem1',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationHolySymbol.entityTypeId',
                        'stages.undergroundCaverns.entities.vertical.locationHolySymbol.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationHolySymbol.params',
                        'stages.undergroundCaverns.entities.vertical.locationHolySymbol.params',
                    ],
                },
            ],
        },
    },
    locationLeapStone: {
        defaultValue: 'relicLeapStone',
        validRewardTypes: [ 'relic', ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationLeapStone.entityTypeId',
                        'stages.castleKeep.entities.vertical.locationLeapStone.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.castleKeep.entities.horizontal.locationLeapStone.params',
                        'stages.castleKeep.entities.vertical.locationLeapStone.params',
                    ],
                },
            ],
        },
    },
    locationMermanStatue: {
        defaultValue: 'relicMermanStatue',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationMermanStatue.entityTypeId',
                        'stages.undergroundCaverns.entities.vertical.locationMermanStatue.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 8,
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationMermanStatue.params',
                        'stages.undergroundCaverns.entities.vertical.locationMermanStatue.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): These item drop indices appear to be unused in the vanilla game
                        'stages.undergroundCaverns.constants.uniqueItemDrops.dropUnusedItem2',
                        'stages.bossScylla.constants.uniqueItemDrops.dropUnusedItem2',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationMermanStatue.entityTypeId',
                        'stages.undergroundCaverns.entities.vertical.locationMermanStatue.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.undergroundCaverns.entities.horizontal.locationMermanStatue.params',
                        'stages.undergroundCaverns.entities.vertical.locationMermanStatue.params',
                    ],
                },
            ],
        },
    },
    locationPowerOfWolf: {
        defaultValue: 'relicPowerOfWolf',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.castleEntrance.entities.horizontal.locationPowerOfWolf.entityTypeId',
                        'stages.castleEntrance.entities.vertical.locationPowerOfWolf.entityTypeId',
                        'stages.castleEntranceRevisited.entities.horizontal.locationPowerOfWolf.entityTypeId',
                        'stages.castleEntranceRevisited.entities.vertical.locationPowerOfWolf.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 3,
                    },
                    keys: [
                        'stages.castleEntrance.entities.horizontal.locationPowerOfWolf.params',
                        'stages.castleEntrance.entities.vertical.locationPowerOfWolf.params',
                        'stages.castleEntranceRevisited.entities.horizontal.locationPowerOfWolf.params',
                        'stages.castleEntranceRevisited.entities.vertical.locationPowerOfWolf.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): These item drop indices appear to be unused in the vanilla game
                        'stages.castleEntrance.constants.uniqueItemDrops.dropUnusedItem',
                        'stages.castleEntranceRevisited.constants.uniqueItemDrops.dropUnusedItem',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.castleEntrance.entities.horizontal.locationPowerOfWolf.entityTypeId',
                        'stages.castleEntrance.entities.vertical.locationPowerOfWolf.entityTypeId',
                        'stages.castleEntranceRevisited.entities.horizontal.locationPowerOfWolf.entityTypeId',
                        'stages.castleEntranceRevisited.entities.vertical.locationPowerOfWolf.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.castleEntrance.entities.horizontal.locationPowerOfWolf.params',
                        'stages.castleEntrance.entities.vertical.locationPowerOfWolf.params',
                        'stages.castleEntranceRevisited.entities.horizontal.locationPowerOfWolf.params',
                        'stages.castleEntranceRevisited.entities.vertical.locationPowerOfWolf.params',
                    ],
                },
            ],
        },
    },
    locationSkillOfWolf: {
        defaultValue: 'relicSkillOfWolf',
        validRewardTypes: [ 'relic', ],
        // TODO(sestren): Allow replacing with an item (dropUnusedItem1, dropUnusedItem2)
        writes: {
            relic: [
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.alchemyLaboratory.constants.breakableContainerDrops.skillOfWolf',
                    ],
                },
            ],
        },
    },
    locationSoulOfBat: {
        defaultValue: 'relicSoulOfBat',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationSoulOfBat.entityTypeId',
                        'stages.longLibrary.entities.vertical.locationSoulOfBat.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 0,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationSoulOfBat.params',
                        'stages.longLibrary.entities.vertical.locationSoulOfBat.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.longLibrary.constants.uniqueItemDrops.unusedItemDrop1',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationSoulOfBat.entityTypeId',
                        'stages.longLibrary.entities.vertical.locationSoulOfBat.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationSoulOfBat.params',
                        'stages.longLibrary.entities.vertical.locationSoulOfBat.params',
                    ],
                },
            ],
        },
    },
    locationSoulOfWolf: {
        defaultValue: 'relicSoulOfWolf',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.outerWall.entities.horizontal.locationSoulOfWolf.entityTypeId',
                        'stages.outerWall.entities.vertical.locationSoulOfWolf.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 7,
                    },
                    keys: [
                        'stages.outerWall.entities.horizontal.locationSoulOfWolf.params',
                        'stages.outerWall.entities.vertical.locationSoulOfWolf.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.outerWall.constants.uniqueItemDrops.unusedItemDrop',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.outerWall.entities.horizontal.locationSoulOfWolf.entityTypeId',
                        'stages.outerWall.entities.vertical.locationSoulOfWolf.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.outerWall.entities.horizontal.locationSoulOfWolf.params',
                        'stages.outerWall.entities.vertical.locationSoulOfWolf.params',
                    ],
                },
            ],
        },
    },
    locationSpiritOrb: {
        defaultValue: 'relicSpiritOrb',
        validRewardTypes: [ 'relic', ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.marbleGallery.entities.horizontal.locationSpiritOrb.entityTypeId',
                        'stages.marbleGallery.entities.vertical.locationSpiritOrb.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.marbleGallery.entities.horizontal.locationSpiritOrb.params',
                        'stages.marbleGallery.entities.vertical.locationSpiritOrb.params',
                    ],
                },
            ],
        },
    },
    locationSwordCard: {
        defaultValue: 'relicSwordCard',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationSwordCard.entityTypeId',
                        'stages.olroxsQuarters.entities.vertical.locationSwordCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 2,
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationSwordCard.params',
                        'stages.olroxsQuarters.entities.vertical.locationSwordCard.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.olroxsQuarters.constants.uniqueItemDrops.unusedItemDrop2',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationSwordCard.entityTypeId',
                        'stages.olroxsQuarters.entities.vertical.locationSwordCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.olroxsQuarters.entities.horizontal.locationSwordCard.params',
                        'stages.olroxsQuarters.entities.vertical.locationSwordCard.params',
                    ],
                },
            ],
        },
    },
    locationFaerieCard: {
        defaultValue: 'relicFaerieCard',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieCard.entityTypeId',
                        'stages.longLibrary.entities.vertical.locationFaerieCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 3,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieCard.params',
                        'stages.longLibrary.entities.vertical.locationFaerieCard.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.longLibrary.constants.uniqueItemDrops.unusedItemDrop2',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieCard.entityTypeId',
                        'stages.longLibrary.entities.vertical.locationFaerieCard.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieCard.params',
                        'stages.longLibrary.entities.vertical.locationFaerieCard.params',
                    ],
                },
            ],
        },
    },
    locationFaerieScroll: {
        defaultValue: 'relicFaerieScroll',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieScroll.entityTypeId',
                        'stages.longLibrary.entities.vertical.locationFaerieScroll.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieScroll.params',
                        'stages.longLibrary.entities.vertical.locationFaerieScroll.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        // NOTE(sestren): This item drop index appears to be unused in the vanilla game
                        'stages.longLibrary.constants.uniqueItemDrops.unusedItemDrop3',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieScroll.entityTypeId',
                        'stages.longLibrary.entities.vertical.locationFaerieScroll.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.longLibrary.entities.horizontal.locationFaerieScroll.params',
                        'stages.longLibrary.entities.vertical.locationFaerieScroll.params',
                    ],
                },
            ],
        },
    },
    locationSpikeBreaker: {
        defaultValue: 'itemSpikeBreaker',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.catacombs.entities.horizontal.locationSpikeBreaker.entityTypeId',
                        'stages.catacombs.entities.vertical.locationSpikeBreaker.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 16,
                    },
                    keys: [
                        'stages.catacombs.entities.horizontal.locationSpikeBreaker.params',
                        'stages.catacombs.entities.vertical.locationSpikeBreaker.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.catacombs.constants.uniqueItemDrops.dropSpikeBreaker',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.catacombs.entities.horizontal.locationSpikeBreaker.entityTypeId',
                        'stages.catacombs.entities.vertical.locationSpikeBreaker.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.catacombs.entities.horizontal.locationSpikeBreaker.params',
                        'stages.catacombs.entities.vertical.locationSpikeBreaker.params',
                    ],
                },
            ],
        },
    },
    locationSilverRing: {
        defaultValue: 'itemSilverRing',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'constant',
                        constant: 12,
                    },
                    keys: [
                        'stages.royalChapel.entities.horizontal.locationSilverRing.entityTypeId',
                        'stages.royalChapel.entities.vertical.locationSilverRing.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'constant',
                        constant: 2,
                    },
                    keys: [
                        'stages.royalChapel.entities.horizontal.locationSilverRing.params',
                        'stages.royalChapel.entities.vertical.locationSilverRing.params',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.royalChapel.constants.uniqueItemDrops.dropSilverRing',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.royalChapel.entities.horizontal.locationSilverRing.entityTypeId',
                        'stages.royalChapel.entities.vertical.locationSilverRing.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.royalChapel.entities.horizontal.locationSpikeBreaker.params',
                        'stages.royalChapel.entities.vertical.locationSpikeBreaker.params',
                    ],
                },
            ],
        },
    },
    locationGoldRing: {
        defaultValue: 'itemGoldRing',
        validRewardTypes: [ 'item', 'relic', ],
        writes: {
            item: [
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.bossScylla.constants.uniqueItemDrops.dropGoldRing',
                        'stages.undergroundCaverns.constants.uniqueItemDrops.dropGoldRing',
                    ],
                },
            ],
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.undergroundCaverns.constants.spawnGoldRing.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.undergroundCaverns.constants.spawnGoldRing.params',
                    ],
                },
            ],
        },
    },
}

export function shuffleRewards(seed) {
    const rng = seedrandom(seed)
    let result = {
        debugInfo: {
            attemptCounter: 0,
        },
    }
    const locationNames = Object.keys(LOCATIONS).toSorted()
    let validInd = false
    while (!validInd) {
        result.debugInfo.attemptCounter += 1
        validInd = true
        result.locations = {}
        let rewardNames = []
        Object.entries(LOCATIONS)
        .forEach(([locationName, locationInfo]) => {
            result.locations[locationName] = null
            rewardNames.push(locationInfo.defaultValue)
        })
        rewardNames = shuffleArray(rng, rewardNames.sort())
        // Try to assign a random valid reward to every location
        locationNames
        .forEach((locationName, index) => {
            result.locations[locationName] = rewardNames.at(index)
        })
        Object.entries(result.locations)
        .forEach(([locationName, rewardName]) => {
            const locationInfo = LOCATIONS[locationName]
            let validRewardType = false
            locationInfo.validRewardTypes
            .forEach((rewardType) => {
                if (rewardName.startsWith(rewardType)) {
                    validRewardType = true
                }
            })
            if (!validRewardType) {
                validInd = false
            }
        })
    }
    // console.log(result)
    return result
}

export function getRewardChanges(locations) {
    const rewardChanges = {}
    Object.entries(locations)
    .forEach(([locationName, rewardName]) => {
        const properties = {
            rewardId: REWARD_IDS[rewardName],
        }
        const rewardType = (rewardName.startsWith('item')) ? 'item' : 'relic'
        LOCATIONS[locationName].writes[rewardType]
        .forEach((writeInfo) => {
            let writeValue = 0
            switch (writeInfo.value.type) {
                case 'property':
                    writeValue = properties[writeInfo.value.property]
                    break
                case 'constant':
                    writeValue = writeInfo.value.constant
                    break
            }
            writeInfo.keys
            .forEach((writeKey) => {
                rewardChanges[writeKey + '='] = writeValue
            })
        })
    })
    const result = {
        changeType: 'merge',
        merge: rewardChanges,
    }
    return result
}
