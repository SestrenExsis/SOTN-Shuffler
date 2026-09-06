import seedrandom from 'seedrandom'

import {
    getEdges,
    getLogic,
    updateStateWithOutcome,
} from './analyze-logic.js'

import {
    shuffleArray
} from './common.js'

import {
    LOGIC,
    NODES,
} from './constants.js'

// TODO(sestren): solver-reward interactivity
// Solver asks for a random reward that is left that satisfies a constraint (e.g., gives progression) and returns the location it placed it into

const REWARDS = {
    relicSoulOfBat: {
        rewardId: 0,
        displayName: 'Soul of Bat',
    },
    relicFireOfBat: {
        rewardId: 1,
        displayName: 'Fire of Bat',
    },
    relicEchoOfBat: {
        rewardId: 2,
        displayName: 'Echo of Bat',
    },
    relicForceOfEcho: {
        rewardId: 3,
        displayName: 'Force of Echo',
    },
    relicSoulOfWolf: {
        rewardId: 4,
        displayName: 'Soul of Wolf',
    },
    relicPowerOfWolf: {
        rewardId: 5,
        displayName: 'Power of Wolf',
    },
    relicSkillOfWolf: {
        rewardId: 6,
        displayName: 'Skill of Wolf',
    },
    relicFormOfMist: {
        rewardId: 7,
        displayName: 'Form of Mist',
    },
    relicPowerOfMist: {
        rewardId: 8,
        displayName: 'Power of Mist',
    },
    relicGasCloud: {
        rewardId: 9,
        displayName: 'Gas Cloud',
    },
    relicCubeOfZoe: {
        rewardId: 10,
        displayName: 'Cube of Zoe',
    },
    relicSpiritOrb: {
        rewardId: 11,
        displayName: 'Spirit Orb',
    },
    relicGravityBoots: {
        rewardId: 12,
        displayName: 'Gravity Boots',
    },
    relicLeapStone: {
        rewardId: 13,
        displayName: 'Leap Stone',
    },
    relicHolySymbol: {
        rewardId: 14,
        displayName: 'Holy Symbol',
    },
    relicFaerieScroll: {
        rewardId: 15,
        displayName: 'Faerie Scroll',
    },
    relicJewelOfOpen: {
        rewardId: 16,
        displayName: 'Jewel of Open',
    },
    relicMermanStatue: {
        rewardId: 17,
        displayName: 'Merman Statue',
    },
    relicBatCard: {
        rewardId: 18,
        displayName: 'Bat Card',
    },
    relicGhostCard: {
        rewardId: 19,
        displayName: 'Ghost Card',
    },
    relicFaerieCard: {
        rewardId: 20,
        displayName: 'Faerie Card',
    },
    relicDemonCard: {
        rewardId: 21,
        displayName: 'Demon Card',
    },
    relicSwordCard: {
        rewardId: 22,
        displayName: 'Sword Card',
    },
    relicSpriteCard: {
        rewardId: 23,
        displayName: 'Sprite Card',
    },
    relicNosedevilCard: {
        rewardId: 24,
        displayName: 'Nosedevil Card',
    },
    relicHeartOfVlad: {
        rewardId: 25,
        displayName: 'Heart of Vlad',
    },
    relicToothOfVlad: {
        rewardId: 26,
        displayName: 'Tooth of Vlad',
    },
    relicRibOfVlad: {
        rewardId: 27,
        displayName: 'Rib of Vlad',
    },
    relicRingOfVlad: {
        rewardId: 28,
        displayName: 'Ring of Vlad',
    },
    relicEyeOfVlad: {
        rewardId: 29,
        displayName: 'Eye of Vlad',
    },
    itemSpikeBreaker: {
        rewardId: 'itemSpikeBreaker',
        displayName: 'Spike Breaker',
    },
    itemGoldRing: {
        rewardId: 'itemGoldRing',
        displayName: 'Gold Ring',
    },
    itemSilverRing: {
        rewardId: 'itemSilverRing',
        displayName: 'Silver Ring',
    },
}

const LOCATIONS = {
    locationBatCard: {
        defaultValue: 'relicBatCard',
        validRewardTypes: [ 'relic', ],
        forbiddenRewards: [],
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
        forbiddenRewards: [
            'relicSoulOfBat',
            'relicGravityBoots',
        ],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
    locationForceOfEcho: {
        defaultValue: 'relicForceOfEcho',
        validRewardTypes: [ 'relic', ],
        forbiddenRewards: [
            'itemGoldRing',
            'itemSilverRing',
            'itemSpikeBreaker',
            'relicCubeOfZoe',
            'relicDemonCard',
            'relicEchoOfBat',
            'relicFormOfMist',
            'relicJewelOfOpen',
            'relicLeapStone',
            'relicMermanStatue',
            'relicSoulOfBat',
        ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.reverseCaverns.entities.horizontal.locationForceOfEcho.entityTypeId',
                        'stages.reverseCaverns.entities.vertical.locationForceOfEcho.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.reverseCaverns.entities.horizontal.locationForceOfEcho.params',
                        'stages.reverseCaverns.entities.vertical.locationForceOfEcho.params',
                    ],
                },
            ],
        },
    },
    locationFormOfMist: {
        defaultValue: 'relicFormOfMist',
        validRewardTypes: [ 'item', 'relic', ],
        forbiddenRewards: [],
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
    locationGasCloud: {
        defaultValue: 'relicGasCloud',
        validRewardTypes: [ 'relic', ],
        forbiddenRewards: [
            'itemGoldRing',
            'itemSilverRing',
            'itemSpikeBreaker',
            'relicCubeOfZoe',
            'relicDemonCard',
            'relicEchoOfBat',
            'relicFormOfMist',
            'relicJewelOfOpen',
            'relicLeapStone',
            'relicMermanStatue',
            'relicSoulOfBat',
        ],
        writes: {
            relic: [
                {
                    value: {
                        type: 'constant',
                        constant: 11,
                    },
                    keys: [
                        'stages.floatingCatacombs.entities.horizontal.locationGasCloud.entityTypeId',
                        'stages.floatingCatacombs.entities.vertical.locationGasCloud.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.floatingCatacombs.entities.horizontal.locationGasCloud.params',
                        'stages.floatingCatacombs.entities.vertical.locationGasCloud.params',
                    ],
                },
            ],
        },
    },
    locationGhostCard: {
        defaultValue: 'relicGhostCard',
        validRewardTypes: [ 'item', 'relic', ],
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
                {
                    value: {
                        type: 'property',
                        property: 'displayName',
                    },
                    keys: [
                        'stages.longLibrary.constants.messages.shopItemName1.data',
                    ],
                },
            ],
        },
    },
    locationPowerOfMist: {
        defaultValue: 'relicPowerOfMist',
        validRewardTypes: [ 'item', 'relic', ],
        forbiddenRewards: [
            'relicSoulOfBat',
        ],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [
            'relicSoulOfBat',
        ],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [
            'relicFormOfMist',
        ],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [
            'relicSoulOfBat',
        ],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
        forbiddenRewards: [],
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
                        'stages.royalChapel.entities.horizontal.locationSilverRing.params',
                        'stages.royalChapel.entities.vertical.locationSilverRing.params',
                    ],
                },
            ],
        },
    },
    locationGoldRing: {
        defaultValue: 'itemGoldRing',
        validRewardTypes: [ 'item', 'relic', ],
        forbiddenRewards: [],
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
                        'stages.undergroundCaverns.constants.spawnGoldRing.entityTypeId.data',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.undergroundCaverns.constants.spawnGoldRing.params.data',
                    ],
                },
            ],
        },
    },
}

export function getVanillaRewardLocations() {
    const result = {}
    Object.entries(LOCATIONS)
    .forEach(([locationName, locationInfo]) => {
        result[locationName] = locationInfo.defaultValue
    })
    return result
}

export function assignLayeredRewards(seed, settings) {
    const rng = seedrandom(seed)
    let result = {
        debugInfo: {
            attemptCounter: 0,
        },
        invalidated: false,
        locations: {},
    }
    settings.locationRewards = {}
    result.debugInfo.attemptCounter += 1
    const startingState = {
        stage: 'castleEntrance',
        room: 'afterDrawbridge',
        section: 'main',
        positionX: 136,
        positionY: 640,
        time: 120.0,
        techniqueSolveBoxPuzzle: true,
    }
    // 26 locations in total
    const rewards = {}
    rewards.main = [ // Fixed, in-logic
        'relicPowerOfMist', // last
        'relicSoulOfBat',
        'relicFormOfMist',
        'relicLeapStone', // first
    ]
    const maxLayerCount = rewards.main.length
    rewards.side = shuffleArray(rng, [ // Shuffled, in-logic
        'itemGoldRing',
        'itemSilverRing',
        'itemSpikeBreaker',
        'relicCubeOfZoe',
        'relicDemonCard',
        'relicEchoOfBat',
        'relicJewelOfOpen',
        'relicMermanStatue',
    ])
    rewards.bonus = [ // Fixed, out-of-logic
        'relicGasCloud', // last
        'relicGravityBoots',
        'relicPowerOfWolf',
        'relicSkillOfWolf',
        'relicHolySymbol',
        'relicSoulOfWolf', // first
    ]
    rewards.filler = shuffleArray(rng, [ // Shuffled, out-of-logic
        'relicBatCard',
        'relicFaerieCard',
        'relicFaerieScroll',
        'relicFireOfBat',
        'relicForceOfEcho',
        'relicGhostCard',
        'relicSpiritOrb',
        'relicSwordCard',
    ])
    rewards.inLogic = rewards.main.slice().concat(rewards.side.slice())
    // Place rewards on current layer
    let bonusRewardCount = 0
    let sideRewardCount = 0
    for (let currentLayer = 0; currentLayer <= maxLayerCount; currentLayer++) {
        const logic = getLogic(settings)
        const edges = getEdges(logic, startingState)
        const currentLayerRewards = []
        const availableChecks = []
        if (rewards.main.length > 0) {
            // Find available checks for pre-final layer
            Object.entries(edges)
            .filter(([currentNodeName, nextNodeNames]) => {
                const parts = currentNodeName.split('.')
                const stageName = parts.at(0)
                const nodeName = parts.at(1)
                return (
                    stageName in NODES &&
                    nodeName in NODES[stageName] &&
                    'nodeType' in NODES[stageName][nodeName] &&
                    ['action', 'check', 'warp'].includes(NODES[stageName][nodeName].nodeType) &&
                    !(nodeName in result.locations)
                )
            })
            .forEach(([currentNodeName, nextNodeNames]) => {
                const parts = currentNodeName.split('.')
                const stageName = parts.at(0)
                const nodeName = parts.at(1)
                const visits = new Map()
                const work = [
                    currentNodeName,
                ]
                visits.set(currentNodeName, true)
                while (work.length > 0) {
                    const currentNode = work.pop()
                    if (currentNode === 'castleEntrance.locationCubeOfZoe') {
                        switch (NODES[stageName][nodeName].nodeType) {
                            case 'action':
                                updateStateWithOutcome(startingState, NODES[stageName][nodeName].requirement)
                                break
                            case 'check':
                                availableChecks.push(nodeName)
                                break
                            case 'warp':
                                updateStateWithOutcome(startingState, NODES[stageName][nodeName].outcome)
                                break
                        }
                        break
                    }
                    if (currentNode in edges) {
                        Object.entries(edges[currentNode])
                        .forEach(([nextNode, time]) => {
                            if (visits.has(nextNode)) {
                                return
                            }
                            else {
                                work.push(nextNode)
                                visits.set(nextNode, true)
                            }
                        })
                    }
                }
            })
            // Assign rewards for pre-final layer
            currentLayerRewards.push(rewards.main.pop())
            if (availableChecks.length < currentLayerRewards.length) {
                result.invalidated = true
                return result
            }
            while (
                currentLayerRewards.length < availableChecks.length &&
                sideRewardCount <= (2 * currentLayer) &&
                rewards.side.length > 0
            ) {
                currentLayerRewards.push(rewards.side.pop())
                sideRewardCount += 1
            }
            while (
                currentLayerRewards.length < availableChecks.length &&
                bonusRewardCount <= currentLayer &&
                rewards.bonus.length > 0
            ) {
                currentLayerRewards.push(rewards.bonus.pop())
                bonusRewardCount += 1
            }
            while (currentLayerRewards.length < availableChecks.length) {
                if (rewards.filler.length > 0) {
                    currentLayerRewards.push(rewards.filler.pop())
                    continue
                }
                if (rewards.bonus.length > 0) {
                    currentLayerRewards.push(rewards.bonus.pop())
                    bonusRewardCount += 1
                    continue
                }
            }
        }
        else {
            // Find available checks for final layer
            Object.entries(LOGIC.locations)
            .filter(([locationName, locationInfo]) => {
                return !(locationName in result.locations)
            })
            .forEach(([locationName, locationInfo]) => {
                availableChecks.push(locationName)
            })
            // Assign rewards for final layer
            while (rewards.side.length > 0) {
                currentLayerRewards.push(rewards.side.pop())
                sideRewardCount += 1
            }
            while (rewards.bonus.length > 0) {
                currentLayerRewards.push(rewards.bonus.pop())
                bonusRewardCount += 1
            }
            while (rewards.filler.length > 0) {
                currentLayerRewards.push(rewards.filler.pop())
            }
        }
        currentLayerRewards
        .forEach((rewardName) => {
            if (availableChecks.length < 1) {
                result.invalidated = true
                return
            }
            shuffleArray(rng, availableChecks)
            const locationName = availableChecks
            .find((locationName) => {
                let validRewardType = false
                LOCATIONS[locationName].validRewardTypes
                .forEach((rewardType) => {
                    if (rewardName.startsWith(rewardType)) {
                        validRewardType = true
                    }
                })
                LOCATIONS[locationName].forbiddenRewards
                .forEach((forbiddenReward) => {
                    if (rewardName === forbiddenReward) {
                        validRewardType = false
                    }
                })
                return validRewardType
            })
            if (locationName === undefined) {
                result.invalidated = true
                return
            }
            result.locations[locationName] = rewardName
            if (rewards.inLogic.includes(rewardName)) {
                settings.locationRewards[locationName] = rewardName
                const locationOutcome = {}
                locationOutcome[locationName] = true
                updateStateWithOutcome(startingState, locationOutcome)
                updateStateWithOutcome(startingState, LOGIC.rewards[rewardName].outcome)
            }
            availableChecks.splice(availableChecks.indexOf(locationName), 1)
        })
        if (result.invalidated) {
            return result
        }
    }
    return result
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
            locationInfo.forbiddenRewards
            .forEach((forbiddenReward) => {
                if (rewardName === forbiddenReward) {
                    validRewardType = false
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
            rewardId: REWARDS[rewardName].rewardId,
            displayName: REWARDS[rewardName].displayName,
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
