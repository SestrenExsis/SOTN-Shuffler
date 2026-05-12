import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

const rewards = {
    relicBatCard: 18,
}

const locations = {
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
                        'stages.abandonedMine.entities.horizontal.locationCubeOfZoe.entityTypeId',
                        'stages.abandonedMine.entities.vertical.locationCubeOfZoe.entityTypeId',
                    ],
                },
                {
                    value: {
                        type: 'property',
                        property: 'rewardId',
                    },
                    keys: [
                        'stages.abandonedMine.entities.horizontal.locationCubeOfZoe.params',
                        'stages.abandonedMine.entities.vertical.locationCubeOfZoe.params',
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
                        'stages.abandonedMine.constants.uniqueItemDrops.itemStoneSword',
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
                        'stages.olroxsQuarters.constants.uniqueItemDrops.itemLifeMaxUp',
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
    },
    locationHolySymbol: {
        defaultValue: 'relicHolySymbol',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationLeapStone: {
        defaultValue: 'relicHolySymbol',
        validRewardTypes: [ 'relic', ],
    },
    locationMermanStatue: {
        defaultValue: 'relicMermanStatue',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationPowerOfWolf: {
        defaultValue: 'relicPowerOfWolf',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationSkillOfWolf: {
        defaultValue: 'relicSkillOfWolf',
        validRewardTypes: [ 'relic', ],
        // TODO(sestren): Allow replacing with an item (dropUnusedItem1, dropUnusedItem2)
    },
    locationSoulOfBat: {
        defaultValue: 'relicSoulOfBat',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationSoulOfWolf: {
        defaultValue: 'relicSoulOfWolf',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationSpiritOrb: {
        defaultValue: 'relicSpiritOrb',
        validRewardTypes: [ 'relic', ],
    },
    locationSwordCard: {
        defaultValue: 'relicSwordCard',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationFaerieCard: {
        defaultValue: 'relicFaerieCard',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationFaerieScroll: {
        defaultValue: 'relicFaerieScroll',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationSpikeBreaker: {
        defaultValue: 'itemSpikeBreaker',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationSilverRing: {
        defaultValue: 'itemSilverRing',
        validRewardTypes: [ 'item', 'relic', ],
    },
    locationGoldRing: {
        defaultValue: 'itemGoldRing',
        // TODO(sestren): Use direct writes to allow relics at this location
        validRewardTypes: [ 'item', ],
    },
}

export function shuffleRewards(seed) {
    const rng = seedrandom(seed)
    let result = {
        debugInfo: {
            attemptCounter: 0,
        },
    }
    const locationNames = Object.keys(locations).toSorted()
    let validInd = false
    while (!validInd) {
        result.debugInfo.attemptCounter += 1
        validInd = true
        result.locations = {}
        let rewardNames = []
        Object.entries(locations)
            .forEach(([locationName, locationInfo]) => {
                result.locations[locationName] = null
                rewardNames.push(locationInfo.defaultValue)
            })
        rewardNames = shuffleArray(rng, rewardNames.sort())
        // Try to assign a random valid reward to every location
        locationNames.forEach((locationName, index) => {
            result.locations[locationName] = rewardNames.at(index)
        })
        Object.entries(result.locations)
            .forEach(([locationName, rewardName]) => {
                const locationInfo = locations[locationName]
                let validRewardType = false
                locationInfo.validRewardTypes.forEach((rewardType) => {
                    if (rewardName.startsWith(rewardType)) {
                        validRewardType = true
                    }
                })
                if (!validRewardType) {
                    validInd = false
                }
            })
    }
    console.log(result)
    return result
}

export function getRewardChanges(aliases, locations) {
    const rewardData = {}
    Object.entries(locations)
        .forEach(([locationName, rewardName]) => {
            const aliasType = (rewardName.startsWith('relic')) ? 'relicIds' : 'itemDropIds'
            const rewardId = aliases._values[aliasType][rewardName]
            switch (locations[locationName].changeType) {
                case 'breakableContainerDrop':
                    // rewardData['stages.STAGENAME.constants.breakableContainerDrops.batCard='] = rewardId
                    break
                case 'directWrite':
                    // TODO: rewardData['XXX='] = XXX
                    break
                case 'enemyDefinition':
                    // TODO: rewardData['XXX='] = XXX
                    break
                case 'entityLayout':
                    // rewardData['stages.STAGENAME.entities.horizontal.LOCATIONNAME.entityTypeId='] = entityTypeId
                    // rewardData['stages.STAGENAME.entities.horizontal.LOCATIONNAME.params='] = params
                    // rewardData['stages.STAGENAME.entities.vertical.LOCATIONNAME.entityTypeId='] = entityTypeId
                    // rewardData['stages.STAGENAME.entities.vertical.LOCATIONNAME.params='] = params
                    break
                case 'shopPurchaseOption':
                    // rewardData['stages.STAGENAME.constants.shopRelics.jewelOfOpen='] = rewardId
                    break
                case 'stageItemDrop':
                    // rewardData['stages.STAGENAME.constants.uniqueItemDrops.DROPNAME='] = rewardId
                    break
            }
        })
    const result = {
        changeType: 'merge',
        merge: {
            rewardData,
        },
    }
    return result
}
