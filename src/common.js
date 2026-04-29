import seedrandom from 'seedrandom'

import {
    combineNodeGroups,
} from './shuffle-rooms.js'

export function shuffleArray(rng, array) {
    // Use Fisher-Yates to shuffle an array in-place
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(rng() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}


// Arrange the stages on the map so they fit together as much as possible
// Come up with several possible arrangements, and choose the one that maximizes the number of overlapping load rooms
// TODO(sestren): Allow overlapping load rooms if linked via teleporters
export function arrangeStages(seed, startingNodeGroups) { //}, links) {
    const rng = seedrandom(seed)
    let validInd = false
    let result
    while (!validInd) {
        validInd = true
        const nodeGroups = JSON.parse(JSON.stringify(Object.values(startingNodeGroups)))
        const groupIndexes = Array.from(Array(nodeGroups.length).keys())
        shuffleArray(rng, groupIndexes)
        let groupIndex = groupIndexes.pop()
        result = nodeGroups.at(groupIndex)
        while (groupIndexes.length > 0) {
            let minEncumbrance = Number.POSITIVE_INFINITY
            let candidates = []
            groupIndex = groupIndexes.pop()
            const nodeGroup = nodeGroups.at(groupIndex)
            const minRows = -1 * nodeGroup.cells.length
            const maxRows = result.cells.length + nodeGroup.cells.length
            const minColumns = -1 * nodeGroup.cells.at(0).length
            const maxColumns = result.cells.at(0).length + nodeGroup.cells.at(0).length
            // console.log('dimensions:', minRows, maxRows, minColumns, maxColumns)
            for (let rowOffset = minRows; rowOffset <= maxRows; rowOffset++) {
                for (let columnOffset = minColumns; columnOffset <= maxColumns; columnOffset++) {
                    const candidate = combineNodeGroups(result, nodeGroup, rowOffset, columnOffset)
                    if (candidate ) {
                        const encumbrance = candidate.cells.length * candidate.cells.at(0).length
                        if (encumbrance < minEncumbrance) {
                            minEncumbrance = encumbrance
                            candidates = []
                        }
                        if (encumbrance === minEncumbrance) {
                            // console.log(`rowOffset: ${rowOffset}, columnOffset: ${columnOffset}, minEncumbrance: ${minEncumbrance}, encumbrance: ${encumbrance}`)
                            candidates.push(candidate)
                        }
                    }
                }
            }
            if (candidates.length < 1) {
                validInd = false
                continue
            }
            result = candidates.at(Math.floor(rng() * candidates.length))
        }
    }
    return result
}
