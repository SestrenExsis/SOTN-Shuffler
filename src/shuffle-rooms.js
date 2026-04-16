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
            '..0',
            '#=0',
        ],
        edges: [
            {
                roomName: 'bend',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            },
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
            '11223',
            '....3',
            '....3',
            '....3',
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
            },
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
            '44',
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
            '555=#'
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
            '6'
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
            '7',
            '7',
            '7',
            '7',
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
            '8',
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
            '9',
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
            'a',
            'a',
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
            'bbbb',
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
            'c=#',
            'c..',
            'c..',
            'c..',
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
    { // alchemyLaboratory.entryway, alchemyLaboratory.loadingRoomToCastleEntrance, alchemyLaboratory.triggerTeleporterToCastleEntrance
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
        edges: [
            {
                roomName: 'entryway',
                edgeName: 'top',
                collision: '######...#######',
                row: 0.0,
                column: 1.5,
            },
        ],
    },
    { // alchemyLaboratory.triggerTeleporterToRoyalChapel, alchemyLaboratory.loadingRoomToRoyalChapel, alchemyLaboratory.exitToRoyalChapel
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
        edges: [
            {
                roomName: 'exitToRoyalChapel',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 3.0,
            },
        ],
    },
    { // alchemyLaboratory.exitToMarbleGallery, alchemyLaboratory.loadingRoomToMarbleGallery, alchemyLaboratory.triggerTeleporterToMarbleGallery
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
        edges: [
            {
                roomName: 'exitToMarbleGallery',
                edgeName: 'left',
                collision: '######....######',
                row: 1.5,
                column: 0.0,
            },
        ],
    },
    { // alchemyLaboratory.tallSpittleboneRoom, alchemyLaboratory.slograAndGaibonRoom, alchemyLaboratory.tetrominoRoom, alchemyLaboratory.batCardRoom
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
        edges: [
            {
                roomName: 'tallSpittleboneRoom',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 2.5,
                column: 0.0,
            },
            {
                roomName: 'tallSpittleboneRoom',
                edgeName: 'leftLower',
                collision: '######....######',
                row: 4.5,
                column: 0.0,
            },
            {
                roomName: 'tallSpittleboneRoom',
                edgeName: 'rightLower',
                collision: '######....######',
                row: 4.5,
                column: 1.0,
            },
            {
                roomName: 'tetrominoRoom',
                edgeName: 'rightUpper',
                collision: '######....######',
                row: 0.5,
                column: 7.0,
            },
            {
                roomName: 'tetrominoRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 1.5,
                column: 7.0,
            },
            {
                roomName: 'tetrominoRoom',
                edgeName: 'rightLower',
                collision: '######....######',
                row: 2.5,
                column: 7.0,
            },
        ],
    },
    { // alchemyLaboratory.bloodyZombieHallway
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
        edges: [
            {
                roomName: 'bloodyZombieHallway',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'bloodyZombieHallway',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 4.0,
            },
        ],
    },
    { // alchemyLaboratory.blueDoorHallway
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
        edges: [
            {
                roomName: 'blueDoorHallway',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'blueDoorHallway',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            },
        ],
    },
    { // alchemyLaboratory.boxPuzzleRoom
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
        edges: [
            {
                roomName: 'boxPuzzleRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'boxPuzzleRoom',
                edgeName: 'rightUpper',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            },
            {
                roomName: 'boxPuzzleRoom',
                edgeName: 'rightLower',
                collision: '######....######',
                row: 1.5,
                column: 2.0,
            },
        ],
    },
    { // alchemyLaboratory.cannonRoom
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
        edges: [
            {
                roomName: 'cannonRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'cannonRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // alchemyLaboratory.clothCapeRoom
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
        edges: [
            {
                roomName: 'clothCapeRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // alchemyLaboratory.corridorToElevator
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
        edges: [
            {
                roomName: 'corridorToElevator',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'corridorToElevator',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            },
        ],
    },
    { // alchemyLaboratory.elevatorShaft
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
        edges: [
            {
                roomName: 'elevatorShaft',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'elevatorShaft',
                edgeName: 'left',
                collision: '######....######',
                row: 3.5,
                column: 0.0,
            },
            {
                roomName: 'elevatorShaft',
                edgeName: 'leftLower',
                collision: '######....######',
                row: 6.5,
                column: 0.0,
            },
        ],
    },
    { // alchemyLaboratory.emptyZigZagRoom
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
        edges: [
            {
                roomName: 'emptyZigZagRoom',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'emptyZigZagRoom',
                edgeName: 'leftLower',
                collision: '######....######',
                row: 1.5,
                column: 0.0,
            },
        ],
    },
    { // alchemyLaboratory.glassVats
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
        edges: [
            {
                roomName: 'glassVats',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 2.0,
            },
            {
                roomName: 'glassVats',
                edgeName: 'bottom',
                collision: '#####..#########',
                row: 1.0,
                column: 0.5,
            },
        ],
    },
    { // alchemyLaboratory.heartMaxUpRoom
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
        edges: [
            {
                roomName: 'heartMaxUpRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // alchemyLaboratory.redSkeletonLiftRoom
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
        edges: [
            {
                roomName: 'redSkeletonLiftRoom',
                edgeName: 'top',
                collision: '#####..#########',
                row: 0.0,
                column: 0.5,
            },
            {
                roomName: 'redSkeletonLiftRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'redSkeletonLiftRoom',
                edgeName: 'rightUpper',
                collision: '######....######',
                row: 0.5,
                column: 3.0,
            },
            {
                roomName: 'redSkeletonLiftRoom',
                edgeName: 'rightLower',
                collision: '######....######',
                row: 1.5,
                column: 3.0,
            },
            {
                roomName: 'redSkeletonLiftRoom',
                edgeName: 'bottom',
                collision: '######...#######',
                row: 2.0,
                column: 2.5,
            },
        ],
    },
    { // alchemyLaboratory.saveRoomA
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
        edges: [
            {
                roomName: 'saveRoomA',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // alchemyLaboratory.saveRoomB
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
        edges: [
            {
                roomName: 'saveRoomB',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
        ],
    },
    { // alchemyLaboratory.saveRoomC
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
        edges: [
            {
                roomName: 'saveRoomC',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
        ],
    },
    { // alchemyLaboratory.secretLifeMaxUpRoom
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
        edges: [
            {
                roomName: 'secretLifeMaxUpRoom',
                edgeName: 'top',
                collision: '#######..#######',
                row: 0.0,
                column: 0.5,
            },
        ],
    },
    { // alchemyLaboratory.shortZigZagRoom
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
        edges: [
            {
                roomName: 'shortZigZagRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'shortZigZagRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 1.5,
                column: 1.0,
            },
        ],
    },
    { // alchemyLaboratory.skillOfWolfRoom
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
        edges: [
            {
                roomName: 'skillOfWolfRoom',
                edgeName: 'left',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
        ],
    },
    { // alchemyLaboratory.sunglassesRoom
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
        edges: [
            {
                roomName: 'sunglassesRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 0.5,
                column: 1.0,
            },
        ],
    },
    { // alchemyLaboratory.tallZigZagRoom
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
        edges: [
            {
                roomName: 'tallZigZagRoom',
                edgeName: 'leftUpper',
                collision: '######....######',
                row: 0.5,
                column: 0.0,
            },
            {
                roomName: 'tallZigZagRoom',
                edgeName: 'leftLower',
                collision: '######....######',
                row: 2.5,
                column: 0.0,
            },
            {
                roomName: 'tallZigZagRoom',
                edgeName: 'right',
                collision: '######....######',
                row: 2.5,
                column: 1.0,
            },
            {
                roomName: 'tallZigZagRoom',
                edgeName: 'bottom',
                collision: '#######..#######',
                row: 3.0,
                column: 0.5,
            },
        ],
    },
]

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
                return baseEdgeInfo.collisions != edgeInfo.collisions
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

export function shuffleRooms(seed, stageName) {
    const stageNodeGroups = nodeGroups
        .filter((nodeGroup) => {
            return nodeGroup.stage === stageName
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
        result = JSON.parse(JSON.stringify(stageNodeGroups.at(groupIndex)))
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
