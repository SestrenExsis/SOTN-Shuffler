import assert from 'node:assert'
import fs from 'fs'
import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

const normalizationPatches = {
    alchemyLaboratory: {
        'entryway.edges.top.collision': '######....######',
        'glassVats.edges.bottom.collision': '######....######',
        'redSkeletonLiftRoom.edges.top.collision': '######....######',
        'redSkeletonLiftRoom.edges.bottom.collision': '######....######',
        'secretLifeMaxUpRoom.edges.top.collision': '######....######',
        'tallZigZagRoom.edges.bottom.collision': '######....######',
    },
}

const nodeGroups = {
    abandonedMine: {
        bend: { // triggerTeleporterToCatacombs, loadingRoomToCatacombs, bend
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
                '..0',
                '#=0',
            ],
            edges: {
                leftUpper: {
                    roomName: 'bend',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        cerberusRoom: { // wellLitSkullRoom, demonSwitch
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
                '11223',
                '....3',
                '....3',
                '....3',
            ],
            edges: {
                left: {
                    roomName: 'wellLitSkullRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'demonSwitch',
                    collision: '######....######',
                    row: 0.5,
                    column: 5.0,
                },
                bottom: {
                    roomName: 'demonSwitch',
                    collision: '######....######',
                    row: 4.0,
                    column: 4.5,
                },
            },
        },
        demonCard: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'demonCard',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '44',
            ],
            edges: {
                right: {
                    roomName: 'demonCard',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        fourWayIntersection: { // fourWayIntersection, loadingRoomToWarpRooms, triggerTeleporterToWarpRooms
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
                '555=#'
            ],
            edges: {
                top: {
                    roomName: 'fourWayIntersection',
                    collision: '######....######',
                    row: 0.0,
                    column: 1.5,
                },
                left: {
                    roomName: 'fourWayIntersection',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'fourWayIntersection',
                    collision: '######....######',
                    row: 1.0,
                    column: 1.5,
                },
            },
        },
        karmaCoinRoom: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'karmaCoinRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '6'
            ],
            edges: {
                right: {
                    roomName: 'karmaCoinRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        lowerStairwell: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'lowerStairwell',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '7',
                '7',
                '7',
                '7',
            ],
            edges: {
                leftLower: {
                    roomName: 'lowerStairwell',
                    collision: '######....######',
                    row: 3.5,
                    column: 0.0,
                },
                rightLower: {
                    roomName: 'lowerStairwell',
                    collision: '######....######',
                    row: 3.5,
                    column: 1.0,
                },
                top: {
                    roomName: 'lowerStairwell',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
            },
        },
        peanutsRoom: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'peanutsRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '8',
            ],
            edges: {
                right: {
                    roomName: 'peanutsRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        saveRoom: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'saveRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
            ],
            edges: {
                left: {
                    roomName: 'saveRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        snakeColumn: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'snakeColumn',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'a',
                'a',
            ],
            edges: {
                leftUpper: {
                    roomName: 'snakeColumn',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'snakeColumn',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        venusWeedRoom: {
            stage: 'abandonedMine',
            rooms: [
                {
                    room: 'venusWeedRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'bbbb',
            ],
            edges: {
                left: {
                    roomName: 'venusWeedRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'venusWeedRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        wolfsHeadColumn: { // wolfsHeadColumn, loadingRoomToUndergroundCaverns, triggerTeleporterToUndergroundCaverns
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
                'c=#',
                'c..',
                'c..',
                'c..',
            ],
            edges: {
                right: {
                    roomName: 'wolfsHeadColumn',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'wolfsHeadColumn',
                    collision: '######....######',
                    row: 3.5,
                    column: 1.0,
                },
            },
        },
    },
    alchemyLaboratory: {
        entryway: { // entryway, loadingRoomToCastleEntrance, triggerTeleporterToCastleEntrance
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'entryway',
                    row: 0,
                    column: 0,
                },
                {
                    room: 'loadingRoomToCastleEntrance',
                    row: 0,
                    column: 2,
                },
                {
                    room: 'triggerTeleporterToCastleEntrance',
                    row: 0,
                    column: 3,
                },
            ],
            cells: [
                '000=#',
            ],
            edges: {
                top: {
                    roomName: 'entryway',
                    collision: '######...#######',
                    row: 0.0,
                    column: 1.5,
                },
            },
        },
        exitToRoyalChapel: { // triggerTeleporterToRoyalChapel, loadingRoomToRoyalChapel, exitToRoyalChapel
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'triggerTeleporterToRoyalChapel',
                    row: 0,
                    column: 0,
                },
                {
                    room: 'loadingRoomToRoyalChapel',
                    row: 0,
                    column: 1,
                },
                {
                    room: 'exitToRoyalChapel',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=1',
            ],
            edges: {
                right: {
                    roomName: 'exitToRoyalChapel',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        exitToMarbleGallery: { // exitToMarbleGallery, loadingRoomToMarbleGallery, triggerTeleporterToMarbleGallery
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'exitToMarbleGallery',
                    row: 0,
                    column: 0,
                },
                {
                    room: 'loadingRoomToMarbleGallery',
                    row: 1,
                    column: 2,
                },
                {
                    room: 'triggerTeleporterToMarbleGallery',
                    row: 1,
                    column: 3,
                },
            ],
            cells: [
                '22..',
                '22=#',
                '22..',
            ],
            edges: {
                left: {
                    roomName: 'exitToMarbleGallery',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        slograAndGaibonRoom: { // tallSpittleboneRoom, tetrominoRoom, batCardRoom
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'tallSpittleboneRoom',
                    row: 1,
                    column: 0,
                },
                {
                    room: 'slograAndGaibonRoom',
                    row: 1,
                    column: 1,
                },
                {
                    room: 'tetrominoRoom',
                    row: 0,
                    column: 5,
                },
                {
                    room: 'batCardRoom',
                    row: 1,
                    column: 5,
                },
            ],
            cells: [
                '.....x3',
                '4555533',
                '4555533',
                '4......',
                '4......',
                '4......',
            ],
            edges: {
                leftUpperOnTheLeft: {
                    roomName: 'tallSpittleboneRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                leftLowerOnTheLeft: {
                    roomName: 'tallSpittleboneRoom',
                    collision: '######....######',
                    row: 4.5,
                    column: 0.0,
                },
                rightLowerOnTheLeft: {
                    roomName: 'tallSpittleboneRoom',
                    collision: '######....######',
                    row: 4.5,
                    column: 1.0,
                },
                rightUpperOnTheRight: {
                    roomName: 'tetrominoRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 7.0,
                },
                rightOnTheRight: {
                    roomName: 'tetrominoRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 7.0,
                },
                rightLowerOnTheRight: {
                    roomName: 'tetrominoRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 7.0,
                },
            },
        },
        bloodyZombieHallway: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'bloodyZombieHallway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '6666',
            ],
            edges: {
                left: {
                    roomName: 'bloodyZombieHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'bloodyZombieHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        blueDoorHallway: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'blueDoorHallway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '77',
            ],
            edges: {
                left: {
                    roomName: 'blueDoorHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'blueDoorHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        boxPuzzleRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'boxPuzzleRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '88',
                '88',
            ],
            edges: {
                left: {
                    roomName: 'boxPuzzleRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'boxPuzzleRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
                rightLower: {
                    roomName: 'boxPuzzleRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 2.0,
                },
            },
        },
        cannonRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'cannonRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
            ],
            edges: {
                left: {
                    roomName: 'cannonRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'cannonRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        clothCapeRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'clothCapeRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'a',
            ],
            edges: {
                right: {
                    roomName: 'clothCapeRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        corridorToElevator: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'corridorToElevator',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'bb',
            ],
            edges: {
                left: {
                    roomName: 'corridorToElevator',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'corridorToElevator',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        elevatorShaft: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'elevatorShaft',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'c',
                'c',
                'c',
                'c',
                'c',
                'c',
                'c',
            ],
            edges: {
                leftUpper: {
                    roomName: 'elevatorShaft',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                left: {
                    roomName: 'elevatorShaft',
                    collision: '######....######',
                    row: 3.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'elevatorShaft',
                    collision: '######....######',
                    row: 6.5,
                    column: 0.0,
                },
            },
        },
        emptyZigZagRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'emptyZigZagRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'd',
                'd',
            ],
            edges: {
                leftUpper: {
                    roomName: 'emptyZigZagRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'emptyZigZagRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        glassVats: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'glassVats',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ee',
            ],
            edges: {
                right: {
                    roomName: 'glassVats',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
                bottom: {
                    roomName: 'glassVats',
                    collision: '#####..#########',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        heartMaxUpRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'heartMaxUpRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'f',
            ],
            edges: {
                right: {
                    roomName: 'heartMaxUpRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        redSkeletonLiftRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'redSkeletonLiftRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ggg',
                'ggg',
            ],
            edges: {
                top: {
                    roomName: 'redSkeletonLiftRoom',
                    collision: '#####..#########',
                    row: 0.0,
                    column: 0.5,
                },
                left: {
                    roomName: 'redSkeletonLiftRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'redSkeletonLiftRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
                rightLower: {
                    roomName: 'redSkeletonLiftRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 3.0,
                },
                bottom: {
                    roomName: 'redSkeletonLiftRoom',
                    collision: '######...#######',
                    row: 2.0,
                    column: 2.5,
                },
            },
        },
        saveRoomA: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'h',
            ],
            edges: {
                right: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        saveRoomB: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'i',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomB',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        saveRoomC: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'saveRoomC',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'j',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomC',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        secretLifeMaxUpRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'secretLifeMaxUpRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'k',
                'k',
            ],
            edges: {
                top: {
                    roomName: 'secretLifeMaxUpRoom',
                    collision: '#######..#######',
                    row: 0.0,
                    column: 0.5,
                },
            },
        },
        shortZigZagRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'shortZigZagRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'l',
                'l',
            ],
            edges: {
                left: {
                    roomName: 'shortZigZagRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'shortZigZagRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        skillOfWolfRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'skillOfWolfRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'm',
            ],
            edges: {
                left: {
                    roomName: 'skillOfWolfRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        sunglassesRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'sunglassesRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'n',
            ],
            edges: {
                right: {
                    roomName: 'sunglassesRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        tallZigZagRoom: {
            stage: 'alchemyLaboratory',
            rooms: [
                {
                    room: 'tallZigZagRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'o',
                'o',
                'o',
            ],
            edges: {
                leftUpper: {
                    roomName: 'tallZigZagRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'tallZigZagRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'tallZigZagRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
                bottom: {
                    roomName: 'tallZigZagRoom',
                    collision: '#######..#######',
                    row: 3.0,
                    column: 0.5,
                },
            },
        },
    },
}

export function combineNodeGroups(baseNodeGroup, nodeGroup, rowOffset, columnOffset) {
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
    let validInd = true
    baseNodeGroup.edges
        .filter((baseEdgeInfo) => {
            // This is O(M * N), but N is assumed to be very small
            const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
            const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
            const matchingEdgesFound = nodeGroup.edges
                .filter((edgeInfo) => {
                    const row = edgeInfo.row + Math.max(0, rowOffset)
                    const column = edgeInfo.column + Math.max(0, columnOffset)
                    return baseRow == row && baseColumn == column
                })
            const mismatchedEdges = matchingEdgesFound.filter((edgeInfo) => {
                return baseEdgeInfo.collision != edgeInfo.collision
            })
            if (mismatchedEdges.length > 0) {
                validInd = false
            }
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
    if (!validInd) {
        return null
    }
    nodeGroup.edges
        .filter((edgeInfo) => {
            // This is O(M * N), but M is assumed to be very small
            const row = edgeInfo.row + Math.max(0, rowOffset)
            const column = edgeInfo.column + Math.max(0, columnOffset)
            const matchingEdgesFound = baseNodeGroup.edges
                .filter((baseEdgeInfo) => {
                    const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
                    const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
                    return row == baseRow && column == baseColumn
                })
            const mismatchedEdges = matchingEdgesFound.filter((baseEdgeInfo) => {
                return edgeInfo.collisions != baseEdgeInfo.collisions
            })
            if (mismatchedEdges.length > 0) {
                validInd = false
            }
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
    if (!validInd) {
        return null
    }
    return result
}

export function shuffleRooms(seed, stageName, applyNormalization) {
    if (applyNormalization) {
        Object.entries(normalizationPatches[stageName]).forEach(([patchKey, patchValue]) => {
            let context = nodeGroups[stageName]
            const properties = patchKey.split('.')
            for (let propertyIndex = 0; propertyIndex < properties.length - 1; propertyIndex++) {
                context = context[properties.at(propertyIndex)]
            }
            context[properties.at(-1)] = patchValue
        })
    }
    const stageNodeGroups = JSON.parse(JSON.stringify(Object.values(nodeGroups[stageName]).sort()))
    stageNodeGroups.forEach((stageNodeGroup) => {
        stageNodeGroup.edges = Object.values(stageNodeGroup.edges).sort()
    })
    const rng = seedrandom(seed)
    let attemptCount = 0
    let validInd = false
    let result
    while (!validInd) {
        validInd = true
        attemptCount += 1
        const groupIndexes = Array.from(Array(stageNodeGroups.length).keys())
        shuffleArray(rng, groupIndexes)
        const groupIndex = groupIndexes.pop()
        result = stageNodeGroups.at(groupIndex)
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
                const nodeGroup = stageNodeGroups.at(groupIndex)
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
    }
    console.log('attemptCount:', attemptCount)
    console.log('result:', result)
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
