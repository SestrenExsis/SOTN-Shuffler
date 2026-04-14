import assert from 'node:assert'
import fs from 'fs'
import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

const nodeGroups = [
    { // abandonedMine.triggerTeleporterToCatacombs, abandonedMine.loadingRoomToCatacombs, abandonedMine.bend
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'triggerTeleporterToCatacombs',
                row: 1,
                column: 0,
            },
            {
                room: 'loadingRoomToCatacombs',
                row: 1,
                column: 1,
            },
            {
                room: 'bend',
                row: 0,
                column: 2,
            },
        ],
        cells: [
            '..#',
            'TL#',
        ],
        edges: [
            {
                roomName: 'bend',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            }
        ],
    },
    { // abandonedMine.wellLitSkullRoom, abandonedMine.cerberusRoom, abandonedMine.demonSwitch
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'wellLitSkullRoom',
                row: 0,
                column: 0,
            },
            {
                room: 'cerberusRoom',
                row: 0,
                column: 2,
            },
            {
                room: 'demonSwitch',
                row: 0,
                column: 4,
            },
        ],
        cells: [
            '#####',
            '....#',
            '....#',
            '....#',
        ],
        edges: [
            {
                roomName: 'wellLitSkullRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'demonSwitch',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 5.0,
            },
            {
                roomName: 'demonSwitch',
                edgeName: 'bottom',
                collision: '######....######',
                row: 4.0,
                column: 4.5,
            }
        ],
    },
    { // abandonedMine.demonCard
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'demonCard',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '##',
        ],
        edges: [
            {
                roomName: 'demonCard',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            },
        ],
    },
    { // abandonedMine.fourWayIntersection
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'fourWayIntersection',
                row: 0,
                column: 0,
            },
            {
                room: 'loadingRoomToWarpRooms',
                row: 0,
                column: 3,
            },
            {
                room: 'triggerTeleporterToWarpRooms',
                row: 0,
                column: 4,
            },
        ],
        cells: [
            '###LT'
        ],
        edges: [
            {
                roomName: 'fourWayIntersection',
                edgeName: 'top',
                collision: '######....######',
                row: 0.0,
                column: 1.5,
            },
            {
                roomName: 'fourWayIntersection',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'fourWayIntersection',
                edgeName: 'bottom',
                collision: '######....######',
                row: 1.0,
                column: 1.5,
            },
        ],
    },
    { // abandonedMine.karmaCoinRoom:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'karmaCoinRoom',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '#'
        ],
        edges: [
            {
                roomName: 'karmaCoinRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // abandonedMine.lowerStairwell:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'lowerStairwell',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '#',
            '#',
            '#',
            '#',
        ],
        edges: [
            {
                roomName: 'lowerStairwell',
                edgeName: 'leftLower',
                collision: '######....######',
                row: 3.5,
                column: 0.0,
            },
            {
                roomName: 'lowerStairwell',
                edgeName: 'rightLower',
                collision: '######....######',
                row: 3.5,
                column: 1.0,
            },
            {
                roomName: 'lowerStairwell',
                edgeName: 'top',
                collision: '######....######',
                row: 0.0,
                column: 0.5,
            },
        ],
    },
    { // abandonedMine.peanutsRoom:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'peanutsRoom',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '#',
        ],
        edges: [
            {
                roomName: 'peanutsRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // abandonedMine.saveRoom:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'saveRoom',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '#',
        ],
        edges: [
            {
                roomName: 'saveRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
        ],
    },
    { // abandonedMine.snakeColumn:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'snakeColumn',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '#',
            '#',
        ],
        edges: [
            {
                roomName: 'snakeColumn',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'snakeColumn',
                edgeName: 'leftLower',
                collision: '######....######',
                row: 1.5,
                column: 0.0,
            },
        ],
    },
    { // abandonedMine.venusWeedRoom:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'venusWeedRoom',
                row: 0,
                column: 0,
            },
        ],
        cells: [
            '####',
        ],
        edges: [
            {
                roomName: 'venusWeedRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'venusWeedRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 4.0,
            },
        ],
    },
    { // abandonedMine.wolfsHeadColumn:
        stage: 'abandonedMine',
        rooms: [
            {
                room: 'wolfsHeadColumn',
                row: 0,
                column: 0,
            },
            {
                room: 'loadingRoomToUndergroundCaverns',
                row: 0,
                column: 1,
            },
            {
                room: 'triggerTeleporterToUndergroundCaverns',
                row: 0,
                column: 2,
            },
        ],
        cells: [
            '#LT',
            '#..',
            '#..',
            '#..',
        ],
        edges: [
            {
                roomName: 'wolfsHeadColumn',
                edgeName: 'right',
                collision: '######....######',
                row: 2.5,
                column: 1.0,
            },
            {
                roomName: 'wolfsHeadColumn',
                edgeName: 'rightLower',
                collision: '######....######',
                row: 3.5,
                column: 1.0,
            },
        ],
    },
]

export function combineNodeGroups(baseNodeGroup, nodeGroup, rowOffset, columnOffset) {
    console.log('baseNodeGroup:', baseNodeGroup)
    console.log('nodeGroup:', nodeGroup)
    console.log('rowOffset:', rowOffset)
    console.log('columnOffset:', columnOffset)
    assert.strictEqual(baseNodeGroup.stage, nodeGroup.stage)
    const result = {
        stage: baseNodeGroup.stage,
        rooms: [],
        cells: [],
        edges: [],
    }
    baseNodeGroup.rooms.forEach((roomInfo) => {
        result.rooms.push({
            room: roomInfo.room,
            row: roomInfo.row + Math.max(0, -rowOffset),
            column: roomInfo.column + Math.max(0, -columnOffset),
        })
    })
    nodeGroup.rooms.forEach((roomInfo) => {
        result.rooms.push({
            room: roomInfo.room,
            row: roomInfo.row + Math.max(0, rowOffset),
            column: roomInfo.column + Math.max(0, columnOffset),
        })
    })
    let top = Math.min(0, rowOffset)
    let bottom = Math.max(baseNodeGroup.cells.length, nodeGroup.cells.length + rowOffset)
    let left = Math.min(0, columnOffset)
    let right = Math.max(baseNodeGroup.cells.at(0).length, nodeGroup.cells.at(0).length + columnOffset)
    const rows = bottom - top
    const columns = right - left
    result.cells = []
    for (let row = 0; row < rows; row++) {
        const rowData = []
        for (let column = 0; column < columns; column++) {
            let values = ['.']
            const rowA = row - Math.max(0, -rowOffset)
            const columnA = column - Math.max(0, -columnOffset)
            if (
                (rowA >= 0) &&
                (rowA < baseNodeGroup.cells.length) &&
                (columnA >= 0) &&
                (columnA < baseNodeGroup.cells.at(rowA).length) &&
                (baseNodeGroup.cells.at(rowA).at(columnA)) !== '.'
            )
            {
                values.push(baseNodeGroup.cells.at(rowA).at(columnA))
            }
            const rowB = row - Math.max(0, rowOffset)
            const columnB = column - Math.max(0, columnOffset)
            if (
                (rowB >= 0) &&
                (rowB < nodeGroup.cells.length) &&
                (columnB >= 0) &&
                (columnB < nodeGroup.cells.at(rowB).length) &&
                (nodeGroup.cells.at(rowB).at(columnB)) !== '.'
            )
            {
                values.push(nodeGroup.cells.at(rowB).at(columnB))
            }
            if (values.length > 2) {
                // More than two values implies overlapping cells
                return null
            }
            rowData.push(values.at(-1))
        }
        result.cells.push(rowData.join(''))
    }
    // console.log('Place down edges for baseNodeGroup')
    baseNodeGroup.edges
        .filter((baseEdgeInfo) => {
            // This is O(M * N), but N is assumed to be very small
            const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
            const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
            const matchingEdgesFound = nodeGroup.edges
                .filter((edgeInfo) => {
                    const row = edgeInfo.row + Math.max(0, rowOffset)
                    const column = edgeInfo.column + Math.max(0, columnOffset)
                    if (baseRow == row || baseColumn == column) {
                        // console.log(baseEdgeInfo, edgeInfo)
                    }
                    return baseRow == row && baseColumn == column
                })
            return matchingEdgesFound.length < 1
        })
        .forEach((baseEdgeInfo) => {
            const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
            const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
            result.edges.push({
                roomName: baseEdgeInfo.roomName,
                edgeName: baseEdgeInfo.edgeName,
                collision: baseEdgeInfo.collision,
                row: baseRow,
                column: baseColumn,
            })
        })
    // console.log('Place down edges for nodeGroup')
    nodeGroup.edges
        .filter((edgeInfo) => {
            // This is O(M * N), but M is assumed to be very small
            const row = edgeInfo.row + Math.max(0, rowOffset)
            const column = edgeInfo.column + Math.max(0, columnOffset)
            const matchingEdgesFound = baseNodeGroup.edges
                .filter((baseEdgeInfo) => {
                    const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
                    const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
                    if (row == baseRow || column == baseColumn) {
                        // console.log(edgeInfo, baseEdgeInfo)
                    }
                    return row == baseRow && column == baseColumn
                })
            return matchingEdgesFound.length < 1
        })
        .forEach((edgeInfo) => {
            const row = edgeInfo.row + Math.max(0, rowOffset)
            const column = edgeInfo.column + Math.max(0, columnOffset)
            result.edges.push({
                roomName: edgeInfo.roomName,
                edgeName: edgeInfo.edgeName,
                collision: edgeInfo.collision,
                row: row,
                column: column,
            })
        })
    console.log('result:', result)
    return result
}

export function shuffleRooms(seed, stageName) {
    const rng = seedrandom(seed)
    let validInd = false
    let result
    while (!validInd) {
        validInd = true
        const groupIndexes = Array.from(Array(nodeGroups.length).keys())
        shuffleArray(rng, groupIndexes)
        const groupIndex = groupIndexes.pop()
        result = JSON.parse(JSON.stringify(nodeGroups.at(groupIndex)))
        // console.log(result)
        // console.log(groupIndex)
        // console.log(groupIndexes)
        while (groupIndexes.length > 0) {
            if (result.edges.length < 1) {
                validInd = false
                break
            }
            const edgeIndex = Math.floor(rng() * result.edges.length)
            const baseEdge = result.edges.at(edgeIndex)
            const nextResults = []
            for (let i = 0; i < groupIndexes.length; i++) {
                const groupIndex = groupIndexes.at(i)
                const nodeGroup = nodeGroups.at(groupIndex)
                for (let j = 0; j < nodeGroup.edges.length; j++) {
                    const edge = nodeGroup.edges.at(j)
                    const rowOffset = baseEdge.row - edge.row
                    const columnOffset = baseEdge.column - edge.column
                    // A non-integer offset implies a horizontal edge being matched with a vertical edge
                    if (Number.isInteger(rowOffset) && Number.isInteger(columnOffset)) {
                        const nextResult = combineNodeGroups(result, nodeGroup, rowOffset, columnOffset)
                        if (nextResult !== null) {
                            nextResults.push({
                                groupIndex: groupIndex,
                                nextResult: nextResult,
                            })
                            // throw new Error('')
                        }
                    }
                }
            }
            shuffleArray(rng, nextResults)
            if (nextResults.length < 1) {
                validInd = false
                break
            }
            const spliceIndex = groupIndexes.indexOf(nextResults.at(-1).groupIndex)
            groupIndexes.splice(spliceIndex, 1)
            result = nextResults.at(-1).nextResult
        }
        if (groupIndexes.length > 0 || result.edges.length > 0) {
            validInd = false
        }
        console.log('validInd:', validInd)
    }
    console.log(result)
    return result
}

export function getRoomChanges(extraction, links) {
    const teleporterData = {}
    Object.entries(links)
        .forEach(([sourceTeleporterName, targetTeleporterName]) => {
            const sourceTeleporterIndex = extraction.teleporters.aliases[sourceTeleporterName]
            const targetTeleporterIndex = extraction.teleporters.aliases[targetTeleporterName]
            const sourceTeleporter = extraction.teleporters.data[sourceTeleporterIndex]
            const targetTeleporter = extraction.teleporters.data[targetTeleporterIndex]
            const assignments = []
            assignments.push([
                sourceTeleporter.sourceStageId,
                sourceTeleporter.targetStageId,
                // NOTE(sestren): Notice that the target teleporter's stage order is swapped
                // This reflection allows the original return target to be fetched
                targetTeleporter.targetStageId,
                targetTeleporter.sourceStageId,
            ])
            if (sourceTeleporter.sourceStageId === 'castleEntrance') {
                assignments.push([
                    'castleEntranceRevisited',
                    sourceTeleporter.targetStageId,
                    targetTeleporter.targetStageId,
                    targetTeleporter.sourceStageId,
                ])
            }
            assignments.forEach(([sourceFrom, sourceTo, targetFrom, targetTo]) => {
                if (sourceTo === 'castleEntranceRevisited') {
                    sourceTo = 'castleEntrance'
                }
                const teleporterNameA = 'from' + sourceFrom.at(0).toUpperCase() + sourceFrom.slice(1) + 'To' + sourceTo.at(0).toUpperCase() + sourceTo.slice(1)
                const teleporterNameB = 'from' + targetFrom.at(0).toUpperCase() + targetFrom.slice(1) + 'To' + targetTo.at(0).toUpperCase() + targetTo.slice(1)
                const teleporterIndexA = extraction.teleporters.aliases[teleporterNameA]
                const teleporterIndexB = extraction.teleporters.aliases[teleporterNameB]
                const teleporterA = extraction.teleporters.data[teleporterIndexA]
                const teleporterB = extraction.teleporters.data[teleporterIndexB]
                teleporterData[teleporterNameA] = {
                    'playerX=': teleporterB.playerX,
                    'playerY=': teleporterB.playerY,
                    'roomOffset=': teleporterB.roomOffset,
                    'targetStageId=': teleporterB.targetStageId,
                }
            })
        })
    const result = {
        changeType: 'merge',
        merge: {
            teleporters: teleporterData,
        },
    }
    return result
}
