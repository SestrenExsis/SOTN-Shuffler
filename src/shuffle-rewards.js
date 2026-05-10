import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

const locations = {
    locationBatCard: {
        defaultValue: 'relicBatCard',
        validEntityTypes: [ 'relic' ],
    },
    locationCubeOfZoe: {
        defaultValue: 'relicCubeOfZoe',
        validEntityTypes: [ 'relic' ],
    },
    locationDemonCard: {
        defaultValue: 'relicDemonCard',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationEchoOfBat: {
        defaultValue: 'relicEchoOfBat',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationFireOfBat: {
        defaultValue: 'relicFireOfBat',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationFormOfMist: {
        defaultValue: 'relicFormOfMist',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationGhostCard: {
        defaultValue: 'relicGhostCard',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationJewelOfOpen: {
        defaultValue: 'relicJewelOfOpen',
        validEntityTypes: [ 'relic' ],
    },
    locationPowerOfMist: {
        defaultValue: 'relicPowerOfMist',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationGravityBoots: {
        defaultValue: 'relicGravityBoots',
        validEntityTypes: [ 'relic' ],
    },
    locationHolySymbol: {
        defaultValue: 'relicHolySymbol',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationLeapStone: {
        defaultValue: 'relicHolySymbol',
        validEntityTypes: [ 'relic' ],
    },
    locationMermanStatue: {
        defaultValue: 'relicMermanStatue',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationPowerOfWolf: {
        defaultValue: 'relicPowerOfWolf',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationSkillOfWolf: {
        defaultValue: 'relicSkillOfWolf',
        validEntityTypes: [ 'relic' ],
    },
    locationSoulOfBat: {
        defaultValue: 'relicSoulOfBat',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationSoulOfWolf: {
        defaultValue: 'relicSoulOfWolf',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationSpiritOrb: {
        defaultValue: 'relicSpiritOrb',
        validEntityTypes: [ 'relic' ],
    },
    locationSwordCard: {
        defaultValue: 'relicSwordCard',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationFaerieCard: {
        defaultValue: 'relicFaerieCard',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationFaerieScroll: {
        defaultValue: 'relicFaerieScroll',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationSpikeBreaker: {
        defaultValue: 'itemSpikeBreaker',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationSilverRing: {
        defaultValue: 'itemSilverRing',
        validEntityTypes: [ 'item', 'relic' ],
    },
    locationGoldRing: {
        defaultValue: 'itemGoldRing',
        validEntityTypes: [ 'item', 'relic' ],
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
                let validEntityType = false
                locationInfo.validEntityTypes.forEach((entityType) => {
                    if (rewardName.startsWith(entityType)) {
                        validEntityType = true
                    }
                })
                if (!validEntityType) {
                    validInd = false
                }
            })
    }
    console.log(result)
    return result
}
