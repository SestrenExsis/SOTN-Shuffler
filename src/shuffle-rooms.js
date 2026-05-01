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
    marbleGallery: {
        // 'beneathLeftTrapdoor.edges.top.collision': '######....######',
        // 'stopwatchRoom.edges.bottom.collision': '######....######',
        'beneathRightTrapdoor.edges.top.collision': '######....######',
        'clockRoom.edges.top.collision': '######....######',
        'gravityBootsRoom.edges.bottom.collision': '######....######',
        'slingerStaircase.edges.bottom.collision': '######....######',
    },
    olroxsQuarters: {
        'catwalkCrypt.edges.top.collision': '######....######',
        'tallShaft.edges.top.collision': '######....######',
        'openCourtyard.edges.top.collision': '######....######',
        'prison.edges.bottomLeft.collision': '######....######',
        'prison.edges.bottomRight.collision': '######....######',
        'swordCardRoom.edges.bottom.collision': '######....######',
    },
}

function fillRect(colorIndex, top, left, rows = 1, columns = 1) {
    const result = {
        command: 'fillRect',
        parameters: {
            colorIndex: colorIndex,
            top: top,
            left: left,
            rows: rows,
            columns: columns,
        },
    }
    return result
}

export const mapPixels = {
    abandonedMine: {
        bend: [
            fillRect('1', 1, 1, 7, 3),
            fillRect('1', 2, 0),
            fillRect('4', 6, 0),
        ],
        cerberusRoom: [
            fillRect('1', 1, 1, 3, 7),
            fillRect('1', 2, 0),
            fillRect('1', 2, 8),
        ],
        demonSwitch: [
            fillRect('1', 1, 1, 15, 3),
            fillRect('1', 2, 0),
            fillRect('1', 2, 4),
            fillRect('1', 16, 2),
        ],
        lowerStairwell: [
            fillRect('1', 1, 1, 15, 3),
            fillRect('1', 0, 2),
            fillRect('1', 14, 0),
            fillRect('1', 14, 4),
        ],
        demonCard: [
            fillRect('1', 1, 1, 3, 7),
            fillRect('1', 2, 8),
        ],
        fourWayIntersection: [
            fillRect('1', 1, 1, 3, 11),
            fillRect('1', 0, 6),
            fillRect('1', 2, 0),
            fillRect('4', 2, 12),
            fillRect('1', 4, 6),
        ],
        karmaCoinRoom: [
            fillRect('1', 1, 1, 3, 3),
            fillRect('1', 2, 4),
        ],
        loadingRoomToCatacombs: [
            fillRect('c', 1, 1, 3, 3),
        ],
        loadingRoomToUndergroundCaverns: [
            fillRect('c', 1, 1, 3, 3),
        ],
        loadingRoomToWarpRooms: [
            fillRect('c', 1, 1, 3, 3),
        ],
        peanutsRoom: [
            fillRect('1', 1, 1, 3, 3),
            fillRect('1', 2, 4),
        ],
        saveRoom: [
            fillRect('4', 1, 1, 3, 3),
            fillRect('1', 2, 0),
        ],
        snakeColumn: [
            fillRect('1', 1, 1, 7, 3),
            fillRect('1', 2, 0),
            fillRect('1', 6, 0),
        ],
        venusWeedRoom: [
            fillRect('1', 1, 1, 3, 15),
            fillRect('1', 2, 0),
            fillRect('1', 2, 14),
        ],
        wellLitSkullRoom: [
            fillRect('1', 1, 1, 3, 7),
            fillRect('1', 2, 0),
            fillRect('1', 2, 6),
        ],
        wolfsHeadColumn: [
            fillRect('1', 1, 1, 15, 3),
            fillRect('4', 2, 4),
            fillRect('1', 10, 4),
            fillRect('1', 14, 4),
        ],
    },
    warpRooms: {
        warpRoomToCastleEntrance: [
            fillRect('5', 1, 1, 3, 3),
            fillRect('4', 2, 4),
        ],
        warpRoomToCastleEntrance: [
            fillRect('5', 1, 1, 3, 3),
            fillRect('4', 2, 0),
        ],
        warpRoomToCastleKeep: [
            fillRect('5', 1, 1, 3, 3),
            fillRect('4', 2, 0),
        ],
        warpRoomToOlroxsQuarters: [
            fillRect('5', 1, 1, 3, 3),
            fillRect('4', 2, 0),
        ],
        warpRoomToOuterWall: [
            fillRect('5', 1, 1, 3, 3),
            fillRect('4', 2, 4),
        ],
        warpRoomToAbandonedMine: [
            fillRect('5', 1, 1, 3, 3),
            fillRect('4', 2, 0),
        ],
    },
}

export const nodeGroups = {
    abandonedMine: {
        bend: { // triggerTeleporterToCatacombs, loadingRoomToCatacombs, bend
            rooms: [
                {
                    stage: 'abandonedMine',
                    room: 'triggerTeleporterToCatacombs',
                    row: 1,
                    column: 0,
                },
                {
                    stage: 'abandonedMine',
                    room: 'loadingRoomToCatacombs',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
                    room: 'wellLitSkullRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'abandonedMine',
                    room: 'cerberusRoom',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
                    room: 'fourWayIntersection',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'abandonedMine',
                    room: 'loadingRoomToWarpRooms',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'abandonedMine',
                    room: 'wolfsHeadColumn',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'abandonedMine',
                    room: 'loadingRoomToUndergroundCaverns',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'abandonedMine',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
                    room: 'entryway',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'alchemyLaboratory',
                    room: 'loadingRoomToCastleEntrance',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'alchemyLaboratory',
                    room: 'triggerTeleporterToCastleEntrance',
                    row: 0,
                    column: 4,
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
                    room: 'triggerTeleporterToRoyalChapel',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'alchemyLaboratory',
                    room: 'loadingRoomToRoyalChapel',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
                    room: 'exitToMarbleGallery',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'alchemyLaboratory',
                    room: 'loadingRoomToMarbleGallery',
                    row: 1,
                    column: 2,
                },
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
                    room: 'tallSpittleboneRoom',
                    row: 1,
                    column: 0,
                },
                {
                    stage: 'alchemyLaboratory',
                    room: 'slograAndGaibonRoom',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'alchemyLaboratory',
                    room: 'tetrominoRoom',
                    row: 0,
                    column: 5,
                },
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
            rooms: [
                {
                    stage: 'alchemyLaboratory',
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
    castleEntrance: {
        afterDrawbridge: { // afterDrawbridge, unknownRoom20, dropUnderPortcullis, saveRoomA
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'afterDrawbridge',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'castleEntrance',
                    room: 'unknownRoom20',
                    row: 2,
                    column: 0,
                },
                {
                    stage: 'castleEntrance',
                    room: 'dropUnderPortcullis',
                    row: 3,
                    column: 1,
                },
                {
                    stage: 'castleEntrance',
                    room: 'saveRoomA',
                    row: 4,
                    column: 2,
                },
            ],
            cells: [
                '.00',
                '.00',
                '#00',
                '.1.',
                '.12',
            ],
            edges: {
                right: {
                    roomName: 'afterDrawbridge',
                    collision: '######....######',
                    row: 2.5,
                    column: 3.0,
                },
            },
        },
        cubeOfZoeRoom: { // triggerTeleporterToAlchemyLaboratory, loadingRoomToAlchemyLaboratory, cubeOfZoeRoom, loadingRoomToMarbleGallery, triggerTeleporterToMarbleGallery
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'triggerTeleporterToAlchemyLaboratory',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'castleEntrance',
                    room: 'loadingRoomToAlchemyLaboratory',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'castleEntrance',
                    room: 'cubeOfZoeRoom',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'castleEntrance',
                    room: 'loadingRoomToMarbleGallery',
                    row: 0,
                    column: 4,
                },
                {
                    stage: 'castleEntrance',
                    room: 'triggerTeleporterToMarbleGallery',
                    row: 0,
                    column: 5,
                },
            ],
            cells: [
                '#=33=#',
                '..33..',
                '..33..',
            ],
            edges: {
                leftUpper: {
                    roomName: 'cubeOfZoeRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 2.0,
                },
                rightUpper: {
                    roomName: 'cubeOfZoeRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 4.0,
                },
                leftLower: {
                    roomName: 'cubeOfZoeRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 2.0,
                },
                rightLower: {
                    roomName: 'cubeOfZoeRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 4.0,
                },
            },
        },
        shortcutToWarpRooms: { // triggerTeleporterToWarpRooms, loadingRoomToWarpRooms, shortcutToWarpRooms
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'triggerTeleporterToWarpRooms',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'castleEntrance',
                    room: 'loadingRoomToWarpRooms',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'castleEntrance',
                    room: 'shortcutToWarpRooms',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=4',
            ],
            edges: {
                right: {
                    roomName: 'shortcutToWarpRooms',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        shortcutToUndergroundCaverns: { // triggerTeleporterToUndergroundCaverns, loadingRoomToUndergroundCaverns, shortcutToUndergroundCaverns
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'shortcutToUndergroundCaverns',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'castleEntrance',
                    room: 'loadingRoomToUndergroundCaverns',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'castleEntrance',
                    room: 'triggerTeleporterToUndergroundCaverns',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '5=#',
            ],
            edges: {
                left: {
                    roomName: 'shortcutToUndergroundCaverns',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        meetingRoomWithDeath: { // gargoyleRoom, meetingRoomWithDeath
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'gargoyleRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'castleEntrance',
                    room: 'meetingRoomWithDeath',
                    row: 1,
                    column: 0,
                },
            ],
            cells: [
                '6',
                '7',
                '7',
            ],
            edges: {
                leftUpper: {
                    roomName: 'gargoyleRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'gargoyleRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                left: {
                    roomName: 'meetingRoomWithDeath',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'meetingRoomWithDeath',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                rightLower: {
                    roomName: 'meetingRoomWithDeath',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
            },
        },
        atticEntrance: { // atticEntrance
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'atticEntrance',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '8',
            ],
            edges: {
                left: {
                    roomName: 'atticEntrance',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'atticEntrance',
                    collision: '######....######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        atticHallway: { // atticHallway
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'atticHallway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9999',
            ],
            edges: {
                left: {
                    roomName: 'atticHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'atticHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        atticStaircase: { // atticStaircase
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'atticStaircase',
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
                    roomName: 'atticStaircase',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'atticStaircase',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'atticStaircase',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        heartMaxUpRoom: { // heartMaxUpRoom
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'heartMaxUpRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'b',
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
        holyMailRoom: { // holyMailRoom
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'holyMailRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'c',
            ],
            edges: {
                right: {
                    roomName: 'holyMailRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        jewelSwordRoom: { // jewelSwordRoom
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'jewelSwordRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'd',
            ],
            edges: {
                right: {
                    roomName: 'jewelSwordRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        lifeMaxUpRoom: { // lifeMaxUpRoom
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'lifeMaxUpRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'e',
            ],
            edges: {
                left: {
                    roomName: 'lifeMaxUpRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        mermanRoom: { // mermanRoom
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'mermanRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'fff',
                'fff',
            ],
            edges: {
                top: {
                    roomName: 'mermanRoom',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                leftUpper: {
                    roomName: 'mermanRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'mermanRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
                leftLower: {
                    roomName: 'mermanRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                rightLower: {
                    roomName: 'mermanRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 3.0,
                },
            },
        },
        saveRoomB: { // saveRoomB
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'g',
            ],
            edges: {
                right: {
                    roomName: 'saveRoomB',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        saveRoomC: { // saveRoomC
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'saveRoomC',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'h',
            ],
            edges: {
                right: {
                    roomName: 'saveRoomC',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        stairwellAfterDeath: { // stairwellAfterDeath
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'stairwellAfterDeath',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'i',
                'i',
                'i',
            ],
            edges: {
                leftUpper: {
                    roomName: 'stairwellAfterDeath',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'stairwellAfterDeath',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
            },
        },
        wargHallway: { // wargHallway
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'wargHallway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'jjjjjj',
            ],
            edges: {
                left: {
                    roomName: 'wargHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'wargHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 6.0,
                },
            },
        },
        zombieHallway: { // zombieHallway
            rooms: [
                {
                    stage: 'castleEntrance',
                    room: 'zombieHallway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'kkkkkkk',
            ],
            edges: {
                left: {
                    roomName: 'zombieHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'zombieHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 7.0,
                },
            },
        },
    },
    castleKeep: {
        keepArea: { // keepArea, upperAttic, lowerAttic, loadingRoomToRoyalChapel, triggerTeleporterToRoyalChapel
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'keepArea',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'castleKeep',
                    room: 'upperAttic',
                    row: 1,
                    column: 5,
                },
                {
                    stage: 'castleKeep',
                    room: 'lowerAttic',
                    row: 2,
                    column: 6,
                },
                {
                    stage: 'castleKeep',
                    room: 'triggerTeleporterToRoyalChapel',
                    row: 7,
                    column: 0,
                },
                {
                    stage: 'castleKeep',
                    room: 'loadingRoomToRoyalChapel',
                    row: 7,
                    column: 1,
                },
            ],
            cells: [
                '..,,,,,,,,',
                '..,,,00011',
                '..,1,12211',
                '..,1111111',
                '..,1111111',
                '..,1111111',
                '..,1111111',
                '#=11111111',
            ],
            edges: {
                rightUpper: {
                    roomName: 'keepArea',
                    collision: '######....######',
                    row: 1.5,
                    column: 10.0,
                },
                right: {
                    roomName: 'keepArea',
                    collision: '######....######',
                    row: 4.5,
                    column: 10.0,
                },
                rightLower: {
                    roomName: 'keepArea',
                    collision: '######....######',
                    row: 6.5,
                    column: 10.0,
                },
                rightLowest: {
                    roomName: 'keepArea',
                    collision: '######....######',
                    row: 7.5,
                    column: 10.0,
                },
            },
        },
        lionTorchPlatform: { // lionTorchPlatform, loadingRoomToClockTower, triggerTeleporterToClockTower
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'lionTorchPlatform',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'castleKeep',
                    room: 'loadingRoomToClockTower',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'castleKeep',
                    room: 'triggerTeleporterToClockTower',
                    row: 1,
                    column: 2,
                },
            ],
            cells: [
                '3..',
                '3=#',
            ],
            edges: {
                top: {
                    roomName: 'lionTorchPlatform',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                left: {
                    roomName: 'lionTorchPlatform',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'lionTorchPlatform',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                bottom: {
                    roomName: 'lionTorchPlatform',
                    collision: '######....######',
                    row: 2.0,
                    column: 0.5,
                },
            },
        },
        dualPlatforms: { // dualPlatforms, loadingRoomToWarpRooms, triggerTeleporterToWarpRooms
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'dualPlatforms',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'castleKeep',
                    room: 'loadingRoomToWarpRooms',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'castleKeep',
                    room: 'triggerTeleporterToWarpRooms',
                    row: 1,
                    column: 2,
                },
            ],
            cells: [
                '4..',
                '4=#',
            ],
            edges: {
                top: {
                    roomName: 'dualPlatforms',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                leftUpper: {
                    roomName: 'dualPlatforms',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'dualPlatforms',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                leftLower: {
                    roomName: 'dualPlatforms',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        bend: { // bend
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'bend',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '5',
            ],
            edges: {
                right: {
                    roomName: 'bend',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                bottom: {
                    roomName: 'bend',
                    collision: '######....######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        falchionRoom: { // falchionRoom
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'falchionRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '6',
            ],
            edges: {
                left: {
                    roomName: 'falchionRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        ghostCardRoom: { // ghostCardRoom
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'ghostCardRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '77',
                '77',
                '77',
            ],
            edges: {
                left: {
                    roomName: 'ghostCardRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '8',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        tyrfingRoom: { // tyrfingRoom
            rooms: [
                {
                    stage: 'castleKeep',
                    room: 'tyrfingRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
            ],
            edges: {
                left: {
                    roomName: 'tyrfingRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
    },
    catacombs: {
        exitToAbandonedMine: { // exitToAbandonedMine, loadingRoomToAbandonedMine, triggerTeleporterToAbandonedMine
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'exitToAbandonedMine',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'catacombs',
                    room: 'loadingRoomToAbandonedMine',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'catacombs',
                    room: 'triggerTeleporterToAbandonedMine',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '0=#',
                '0..',
            ],
            edges: {
                left: {
                    roomName: 'exitToAbandonedMine',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'exitToAbandonedMine',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        granfaloonsLair: { // granfaloonsLair, roomId04, roomId02
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'granfaloonsLair',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'catacombs',
                    room: 'roomId04',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'catacombs',
                    room: 'roomId02',
                    row: 1,
                    column: 0,
                },
            ],
            cells: [
                '.112',
                '311.',
            ],
            edges: {
                left: {
                    roomName: 'roomId02',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId04',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        roomId00: { // roomId00
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId00',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '4',
                '4',
            ],
            edges: {
                rightUpper: {
                    roomName: 'roomId00',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'roomId00',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        mormegilRoom: { // mormegilRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'mormegilRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '5',
            ],
            edges: {
                left: {
                    roomName: 'mormegilRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        roomId05: { // roomId05
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId05',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '6',
            ],
            edges: {
                right: {
                    roomName: 'roomId05',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        smallGremlinRoom: { // smallGremlinRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'smallGremlinRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '7',
                '7',
            ],
            edges: {
                leftUpper: {
                    roomName: 'smallGremlinRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'smallGremlinRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                leftLower: {
                    roomName: 'smallGremlinRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                rightLower: {
                    roomName: 'smallGremlinRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        walkArmorRoom: { // walkArmorRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'walkArmorRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '8',
            ],
            edges: {
                left: {
                    roomName: 'walkArmorRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        icebrandRoom: { // icebrandRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'icebrandRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
            ],
            edges: {
                right: {
                    roomName: 'icebrandRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        leftLavaPath: { // leftLavaPath
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'leftLavaPath',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'aaa',
            ],
            edges: {
                left: {
                    roomName: 'leftLavaPath',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'leftLavaPath',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        ballroomMaskRoom: { // ballroomMaskRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'ballroomMaskRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'bb',
                'bb',
            ],
            edges: {
                leftUpper: {
                    roomName: 'ballroomMaskRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'ballroomMaskRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'ballroomMaskRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 2.0,
                },
            },
        },
        rightLavaPath: { // rightLavaPath
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'rightLavaPath',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ccc',
            ],
            edges: {
                left: {
                    roomName: 'rightLavaPath',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'rightLavaPath',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        catEyeCircletRoom: { // catEyeCircletRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'catEyeCircletRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'd',
            ],
            edges: {
                right: {
                    roomName: 'catEyeCircletRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        roomId14: { // roomId14
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId14',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'e',
            ],
            edges: {
                left: {
                    roomName: 'roomId14',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId14',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        saveRoomB: { // saveRoomB
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomB',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'saveRoomB',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        hellfireBeastRoom: { // hellfireBeastRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'hellfireBeastRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ff',
            ],
            edges: {
                left: {
                    roomName: 'hellfireBeastRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'hellfireBeastRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        boneArkRoom: { // boneArkRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'boneArkRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ggg',
            ],
            edges: {
                left: {
                    roomName: 'boneArkRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'boneArkRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        roomId19: { // roomId19
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId19',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'h',
            ],
            edges: {
                left: {
                    roomName: 'roomId19',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId19',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        roomId20: { // roomId20
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId20',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ii',
            ],
            edges: {
                left: {
                    roomName: 'roomId20',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId20',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        roomId21: { // roomId21
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId21',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'jj',
                'jj',
            ],
            edges: {
                leftUpper: {
                    roomName: 'roomId21',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'roomId21',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId21',
                    collision: '######....######',
                    row: 1.5,
                    column: 2.0,
                },
            },
        },
        roomId22: { // roomId22
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId22',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'k',
            ],
            edges: {
                left: {
                    roomName: 'roomId22',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId22',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        roomId23: { // roomId23
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId23',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'lll',
                'lll',
            ],
            edges: {
                left: {
                    roomName: 'roomId23',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId23',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        pitchBlackSpikeMaze: { // pitchBlackSpikeMaze
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'pitchBlackSpikeMaze',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'mmm',
            ],
            edges: {
                left: {
                    roomName: 'pitchBlackSpikeMaze',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'pitchBlackSpikeMaze',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        roomId25: { // roomId25
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId25',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'nnnnn',
            ],
            edges: {
                left: {
                    roomName: 'roomId25',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'roomId25',
                    collision: '######....######',
                    row: 1.0,
                    column: 4.5,
                },
            },
        },
        roomId26: { // roomId26
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'roomId26',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ooooo',
            ],
            edges: {
                top: {
                    roomName: 'roomId26',
                    collision: '######....######',
                    row: 0.0,
                    column: 4.5,
                },
                left: {
                    roomName: 'roomId26',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        spikeBreakerRoom: { // spikeBreakerRoom
            rooms: [
                {
                    stage: 'catacombs',
                    room: 'spikeBreakerRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ppp',
            ],
            edges: {
                right: {
                    roomName: 'spikeBreakerRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
    },
    clockTower: {
        karasumansRoom: { // triggerTeleporterToCastleKeep, loadingRoomToCastleKeep, karasumansRoom
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'triggerTeleporterToCastleKeep',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'clockTower',
                    room: 'loadingRoomToCastleKeep',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'clockTower',
                    room: 'karasumansRoom',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=0',
            ],
            edges: {
                right: {
                    roomName: 'karasumansRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        stairwellToOuterWall: { // stairwellToOuterWall, loadingRoomToOuterWall, triggerTeleporterToOuterWall
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'stairwellToOuterWall',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'clockTower',
                    room: 'loadingRoomToOuterWall',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'clockTower',
                    room: 'triggerTeleporterToOuterWall',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '1=#',
                '1..',
            ],
            edges: {
                leftUpper: {
                    roomName: 'stairwellToOuterWall',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'stairwellToOuterWall',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        leftGearRoom: { // spire, belfry, leftGearRoom, hiddenArmory
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'spire',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'clockTower',
                    room: 'belfry',
                    row: 2,
                    column: 1,
                },
                {
                    stage: 'clockTower',
                    room: 'leftGearRoom',
                    row: 3,
                    column: 1,
                },
                {
                    stage: 'clockTower',
                    room: 'hiddenArmory',
                    row: 6,
                    column: 0,
                },
            ],
            cells: [
                ',,2,,',
                ',222,',
                '.333.',
                '.433.',
                '.4...',
                '.4...',
                '54...',
            ],
            edges: {
                left: {
                    roomName: 'leftGearRoom',
                    collision: '######....######',
                    row: 3.5,
                    column: 1.0,
                },
                right: {
                    roomName: 'leftGearRoom',
                    collision: '######....######',
                    row: 6.5,
                    column: 2.0,
                },
            },
        },
        pendulumRoom: { // pathToKarasuman, pendulumRoom
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'pathToKarasuman',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'clockTower',
                    room: 'pendulumRoom',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '666777777',
                '..7777777',
            ],
            edges: {
                leftUpper: {
                    roomName: 'pathToKarasuman',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'pendulumRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 2.0,
                },
                right: {
                    roomName: 'pendulumRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 9.0,
                },
            },
        },
        healingMailRoom: { // healingMailRoom
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'healingMailRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '8',
            ],
            edges: {
                right: {
                    roomName: 'healingMailRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        rightGearRoom: { // rightGearRoom
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'rightGearRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
                '9',
                '9',
            ],
            edges: {
                right: {
                    roomName: 'rightGearRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                left: {
                    roomName: 'rightGearRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
            },
        },
        exitToCourtyard: { // exitToCourtyard
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'exitToCourtyard',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'a',
                'a',
                'a',
            ],
            edges: {
                left: {
                    roomName: 'exitToCourtyard',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'exitToCourtyard',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'exitToCourtyard',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
            },
        },
        openCourtyard: { // openCourtyard
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'openCourtyard',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'bbbbbb',
                'bbbbbb',
                'bbbbbb',
                'bbbbbb',
                'bbbbbb',
            ],
            edges: {
                leftUpper: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 3.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 0.5,
                    column: 6.0,
                },
                right: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 3.5,
                    column: 6.0,
                },
                rightLower: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 4.5,
                    column: 6.0,
                },
            },
        },
        fireOfBatRoom: { // fireOfBatRoom
            rooms: [
                {
                    stage: 'clockTower',
                    room: 'fireOfBatRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'c',
            ],
            edges: {
                left: {
                    roomName: 'fireOfBatRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
    },
    colosseum: {
        arena: { // triggerTeleporterToRoyalChapel, loadingRoomToRoyalChapel, passagewayBetweenArenaAndRoyalChapel, arena, topOfElevatorShaft, loadingRoomToOlroxsQuarters, triggerTeleporterToOlroxsQuarters, bottomOfElevatorShaft
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'triggerTeleporterToRoyalChapel',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'colosseum',
                    room: 'loadingRoomToRoyalChapel',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'colosseum',
                    room: 'passagewayBetweenArenaAndRoyalChapel',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'colosseum',
                    room: 'arena',
                    row: 0,
                    column: 7,
                },
                {
                    stage: 'colosseum',
                    room: 'topOfElevatorShaft',
                    row: 0,
                    column: 9,
                },
                {
                    stage: 'colosseum',
                    room: 'loadingRoomToOlroxsQuarters',
                    row: 0,
                    column: 14,
                },
                {
                    stage: 'colosseum',
                    room: 'triggerTeleporterToOlroxsQuarters',
                    row: 0,
                    column: 15,
                },
                {
                    stage: 'colosseum',
                    room: 'bottomOfElevatorShaft',
                    row: 1,
                    column: 9,
                },
            ],
            cells: [
                '#=000001122222=#',
                '.........3333...',
                '.........3333....'
            ],
            edges: {
                topLeft: {
                    roomName: 'passagewayBetweenArenaAndRoyalChapel',
                    collision: '######....######',
                    row: 0.0,
                    column: 5.5,
                },
                topRight: {
                    roomName: 'bottomOfElevatorShaft',
                    collision: '######....######',
                    row: 0.0,
                    column: 10.5,
                },
                bottom: {
                    roomName: 'passagewayBetweenArenaAndRoyalChapel',
                    collision: '######....######',
                    row: 1.0,
                    column: 3.5,
                },
                leftUpper: {
                    roomName: 'bottomOfElevatorShaft',
                    collision: '######....######',
                    row: 1.5,
                    column: 9.0,
                },
                leftLower: {
                    roomName: 'bottomOfElevatorShaft',
                    collision: '######....######',
                    row: 2.5,
                    column: 9.0,
                },
                rightUpper: {
                    roomName: 'bottomOfElevatorShaft',
                    collision: '######....######',
                    row: 1.5,
                    column: 13.0,
                },
                rightLower: {
                    roomName: 'bottomOfElevatorShaft',
                    collision: '######....######',
                    row: 2.5,
                    column: 13.0,
                },
            },
        },
        bladeMasterRoom: { // bladeMasterRoom
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'bladeMasterRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '4444',
            ],
            edges: {
                top: {
                    roomName: 'bladeMasterRoom',
                    collision: '######....######',
                    row: 0.0,
                    column: 3.5,
                },
                left: {
                    roomName: 'bladeMasterRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'bladeMasterRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        bloodCloakRoom: { // bloodCloakRoom
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'bloodCloakRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '5',
            ],
            edges: {
                right: {
                    roomName: 'bloodCloakRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        fountainRoom: { // fountainRoom
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'fountainRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '6',
            ],
            edges: {
                left: {
                    roomName: 'fountainRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        holySwordRoom: { // holySwordRoom
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'holySwordRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '77',
            ],
            edges: {
                bottom: {
                    roomName: 'holySwordRoom',
                    collision: '######....######',
                    row: 1.0,
                    column: 1.5,
                },
            },
        },
        leftSideArmory: { // leftSideArmory
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'leftSideArmory',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '88',
            ],
            edges: {
                right: {
                    roomName: 'leftSideArmory',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        rightSideArmory: { // rightSideArmory
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'rightSideArmory',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '99',
            ],
            edges: {
                left: {
                    roomName: 'rightSideArmory',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
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
        saveRoomB: { // saveRoomB
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
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
        spiralStaircases: { // spiralStaircases
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'spiralStaircases',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'aaaa',
                'aaaa',
            ],
            edges: {
                top: {
                    roomName: 'spiralStaircases',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                leftUpper: {
                    roomName: 'spiralStaircases',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'spiralStaircases',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'spiralStaircases',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
                rightLower: {
                    roomName: 'spiralStaircases',
                    collision: '######....######',
                    row: 1.5,
                    column: 4.0,
                },
            },
        },
        topOfLeftSpiralStaircase: { // topOfLeftSpiralStaircase
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'topOfLeftSpiralStaircase',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'b',
            ],
            edges: {
                right: {
                    roomName: 'topOfLeftSpiralStaircase',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                bottom: {
                    roomName: 'topOfLeftSpiralStaircase',
                    collision: '######....######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        topOfRightSpiralStaircase: { // topOfRightSpiralStaircase
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'topOfRightSpiralStaircase',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'c',
            ],
            edges: {
                left: {
                    roomName: 'topOfRightSpiralStaircase',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'topOfRightSpiralStaircase',
                    collision: '######....######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        valhallaKnightRoom: { // valhallaKnightRoom
            rooms: [
                {
                    stage: 'colosseum',
                    room: 'valhallaKnightRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'dd',
            ],
            edges: {
                left: {
                    roomName: 'valhallaKnightRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'valhallaKnightRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
    },
    longLibrary: {
        exitToOuterWall: { // exitToOuterWall, loadingRoomToOuterWall, triggerTeleporterToOuterWall
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'exitToOuterWall',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'longLibrary',
                    room: 'loadingRoomToOuterWall',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'longLibrary',
                    room: 'triggerTeleporterToOuterWall',
                    row: 0,
                    column: 4,
                },
            ],
            cells: [
                '000=#',
            ],
            edges: {
                left: {
                    roomName: 'exitToOuterWall',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        spellbookArea: { // spellbookArea, footOfStaircase
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'spellbookArea',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'longLibrary',
                    room: 'footOfStaircase',
                    row: 3,
                    column: 2,
                },
            ],
            cells: [
                '1111111',
                '1111111',
                '1111111',
                '..2....',
            ],
            edges: {
                leftUpperA: {
                    roomName: 'spellbookArea',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftUpperB: {
                    roomName: 'spellbookArea',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                leftLowerA: {
                    roomName: 'spellbookArea',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                leftLowerB: {
                    roomName: 'footOfStaircase',
                    collision: '######....######',
                    row: 3.5,
                    column: 2.0,
                },
                right: {
                    roomName: 'footOfStaircase',
                    collision: '######....######',
                    row: 3.5,
                    column: 3.0,
                },
            },
        },
        lesserDemonArea: { // lesserDemonArea
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'lesserDemonArea',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                ',3333',
                ',3333',
                '33333',
                '33333',
            ],
            edges: {
                rightUpper: {
                    roomName: 'lesserDemonArea',
                    collision: '######....######',
                    row: 0.5,
                    column: 5.0,
                },
                rightLower: {
                    roomName: 'lesserDemonArea',
                    collision: '######....######',
                    row: 1.5,
                    column: 5.0,
                },
            },
        },
        secretBookcaseRoom: { // secretBookcaseRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'secretBookcaseRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '4',
            ],
            edges: {
                left: {
                    roomName: 'secretBookcaseRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'secretBookcaseRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        holyRodRoom: { // holyRodRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'holyRodRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '5',
            ],
            edges: {
                left: {
                    roomName: 'holyRodRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        dhuronAndFleaArmorRoom: { // dhuronAndFleaArmorRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'dhuronAndFleaArmorRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '66',
            ],
            edges: {
                left: {
                    roomName: 'dhuronAndFleaArmorRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'dhuronAndFleaArmorRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        shop: { // shop
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'shop',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '7',
                '7',
            ],
            edges: {
                rightUpper: {
                    roomName: 'shop',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'shop',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        outsideShop: { // outsideShop
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'outsideShop',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '88',
            ],
            edges: {
                left: {
                    roomName: 'outsideShop',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'outsideShop',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        fleaManRoom: { // fleaManRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'fleaManRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '99',
            ],
            edges: {
                left: {
                    roomName: 'fleaManRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'fleaManRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        faerieCardRoom: { // faerieCardRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'faerieCardRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'a',
            ],
            edges: {
                right: {
                    roomName: 'faerieCardRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        threeLayerRoom: { // threeLayerRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'threeLayerRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'b',
                'b',
                'b',
            ],
            edges: {
                leftUpper: {
                    roomName: 'threeLayerRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'threeLayerRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                left: {
                    roomName: 'threeLayerRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'threeLayerRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
                leftLower: {
                    roomName: 'threeLayerRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                rightLower: {
                    roomName: 'threeLayerRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
            },
        },
        dhuronAndFleaManRoom: { // dhuronAndFleaManRoom
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'dhuronAndFleaManRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'cc',
            ],
            edges: {
                left: {
                    roomName: 'dhuronAndFleaManRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'dhuronAndFleaManRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'longLibrary',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
    },
    marbleGallery: {
        clockRoom: { // threePaths, leftOfClockRoom, clockRoom, rightOfClockRoom, saveRoomA, elevatorRoom, powerUpRoom, triggerTeleporterToCastleCenter, triggerTeleporterToMarbleGallery, elevatorShaft, centerCube, triggerTeleporterToBO6, unknownRoomId02
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'threePaths',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'marbleGallery',
                    room: 'leftOfClockRoom',
                    row: 2,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'clockRoom',
                    row: 2,
                    column: 3,
                },
                {
                    stage: 'marbleGallery',
                    room: 'rightOfClockRoom',
                    row: 2,
                    column: 4,
                },
                {
                    stage: 'marbleGallery',
                    room: 'saveRoomA',
                    row: 3,
                    column: 2,
                },
                {
                    stage: 'marbleGallery',
                    room: 'elevatorRoom',
                    row: 3,
                    column: 3,
                },
                {
                    stage: 'castleCenter',
                    room: 'triggerTeleporterToMarbleGallery',
                    row: 3,
                    column: 3,
                },
                {
                    stage: 'marbleGallery',
                    room: 'powerUpRoom',
                    row: 3,
                    column: 4,
                },
                {
                    stage: 'marbleGallery',
                    room: 'triggerTeleporterToCastleCenter',
                    row: 4,
                    column: 3,
                },
                {
                    stage: 'castleCenter',
                    room: 'elevatorShaft',
                    row: 4,
                    column: 3,
                },
                {
                    stage: 'castleCenter',
                    room: 'centerCube',
                    row: 6,
                    column: 2,
                },
                {
                    stage: 'castleCenter',
                    room: 'triggerTeleporterToBO6',
                    row: 7,
                    column: 5,
                },
                {
                    stage: 'castleCenter',
                    room: 'unknownRoomId02',
                    row: 9,
                    column: 3,
                },
            ],
            cells: [
                '...0...',
                '...0...',
                '1112333',
                '..456..',
                '...7...',
                '...7...',
                '..888..',
                '..888..',
                '..888..',
            ],
            edges: {
                top: {
                    roomName: 'threePaths',
                    collision: '#######..#######',
                    row: 0.0,
                    column: 3.5,
                },
                leftUpper: {
                    roomName: 'threePaths',
                    collision: '######....######',
                    row: 1.5,
                    column: 3.0,
                },
                rightUpper: {
                    roomName: 'threePaths',
                    collision: '######....######',
                    row: 1.5,
                    column: 4.0,
                },
                leftLower: {
                    roomName: 'leftOfClockRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                rightLower: {
                    roomName: 'rightOfClockRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 7.0,
                },
            },
        },
        longHallway: { // longHallway, loadingRoomToOuterWall, triggerTeleporterToOuterWall
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'longHallway',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'loadingRoomToOuterWall',
                    row: 0,
                    column: 15,
                },
                {
                    stage: 'marbleGallery',
                    room: 'triggerTeleporterToOuterWall',
                    row: 0,
                    column: 16,
                },
            ],
            cells: [
                '999999999999999=#',
            ],
            edges: {
                left: {
                    roomName: 'longHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        sShapedHallways: { // triggerTeleporterToCastleEntrance, loadingRoomToCastleEntrance, sShapedHallways
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'triggerTeleporterToCastleEntrance',
                    row: 2,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'loadingRoomToCastleEntrance',
                    row: 2,
                    column: 1,
                },
                {
                    stage: 'marbleGallery',
                    room: 'sShapedHallways',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '..aaaaaa',
                '..aaaaaa',
                '#=aaaaaa',
            ],
            edges: {
                right: {
                    roomName: 'sShapedHallways',
                    collision: '######....######',
                    row: 0.5,
                    column: 8.0,
                },
            },
        },
        entrance: { // triggerTeleporterToAlchemyLaboratory, loadingRoomToAlchemyLaboratory, entrance
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'triggerTeleporterToAlchemyLaboratory',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'loadingRoomToAlchemyLaboratory',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'marbleGallery',
                    room: 'entrance',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=bbbb',
            ],
            edges: {
                right: {
                    roomName: 'entrance',
                    collision: '######....######',
                    row: 0.5,
                    column: 6.0,
                },
            },
        },
        pathwayAfterLeftStatue: { // triggerTeleporterToOlroxsQuarters, loadingRoomToOlroxsQuarters, pathwayAfterLeftStatue
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'triggerTeleporterToOlroxsQuarters',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'loadingRoomToOlroxsQuarters',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'marbleGallery',
                    room: 'pathwayAfterLeftStatue',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=c',
            ],
            edges: {
                right: {
                    roomName: 'pathwayAfterLeftStatue',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        stairwellToUndergroundCaverns: { // triggerTeleporterToUndergroundCaverns, loadingRoomToUndergroundCaverns, stairwellToUndergroundCaverns
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'triggerTeleporterToUndergroundCaverns',
                    row: 1,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'loadingRoomToUndergroundCaverns',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'marbleGallery',
                    room: 'stairwellToUndergroundCaverns',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '..d',
                '#=d',
            ],
            edges: {
                right: {
                    roomName: 'stairwellToUndergroundCaverns',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        dropoff: { // dropoff, beneathDropoff, stainedGlassCorner
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'dropoff',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'marbleGallery',
                    room: 'beneathDropoff',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'marbleGallery',
                    room: 'stainedGlassCorner',
                    row: 2,
                    column: 1,
                },
            ],
            cells: [
                'eee',
                '.ff',
                '.g.',
            ],
            edges: {
                leftUpper: {
                    roomName: 'dropoff',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'dropoff',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
                rightLower: {
                    roomName: 'beneathDropoff',
                    collision: '######....######',
                    row: 1.5,
                    column: 3.0,
                },
                leftLower: {
                    roomName: 'stainedGlassCorner',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
            },
        },
        alucartRoom: { // alucartRoom
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'alucartRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'h',
            ],
            edges: {
                left: {
                    roomName: 'alucartRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        gravityBootsRoom: { // gravityBootsRoom
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'gravityBootsRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'iiiii',
            ],
            edges: {
                bottom: {
                    roomName: 'gravityBootsRoom',
                    collision: '#######..#######',
                    row: 1.0,
                    column: 2.5,
                },
            },
        },
        beneathRightTrapdoor: { // beneathRightTrapdoor
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'beneathRightTrapdoor',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'j',
            ],
            edges: {
                top: {
                    roomName: 'beneathRightTrapdoor',
                    collision: '####....########',
                    row: 0.0,
                    column: 0.5,
                },
            },
        },
        tallStainedGlassWindows: { // tallStainedGlassWindows
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'tallStainedGlassWindows',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'k',
                'k',
                'k',
            ],
            edges: {
                leftUpper: {
                    roomName: 'tallStainedGlassWindows',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'tallStainedGlassWindows',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
            },
        },
        spiritOrbRoom: { // spiritOrbRoom
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'spiritOrbRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'll',
                'll',
                'll',
                'll',
                'll',
            ],
            edges: {
                rightUpper: {
                    roomName: 'spiritOrbRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
                rightLower: {
                    roomName: 'spiritOrbRoom',
                    collision: '######....######',
                    row: 4.5,
                    column: 2.0,
                },
            },
        },
        stopwatchRoom: { // stopwatchRoom
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'stopwatchRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'mmm',
            ],
            edges: {
                left: {
                    roomName: 'stopwatchRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'stopwatchRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
                bottom: {
                    roomName: 'stopwatchRoom',
                    collision: '######....######',
                    row: 1.0,
                    column: 1.5,
                },
            },
        },
        emptyRoom: { // emptyRoom
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'emptyRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'n',
            ],
            edges: {
                left: {
                    roomName: 'emptyRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'emptyRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        blueDoorRoom: { // blueDoorRoom
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'blueDoorRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'oo',
            ],
            edges: {
                left: {
                    roomName: 'blueDoorRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        pathwayAfterRightStatue: { // pathwayAfterRightStatue
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'pathwayAfterRightStatue',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'p',
            ],
            edges: {
                left: {
                    roomName: 'pathwayAfterRightStatue',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'pathwayAfterRightStatue',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        ouijaTableStairway: { // ouijaTableStairway
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'ouijaTableStairway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'qq',
                'qq',
                'qq',
            ],
            edges: {
                left: {
                    roomName: 'ouijaTableStairway',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'ouijaTableStairway',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        slingerStaircase: { // slingerStaircase
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'slingerStaircase',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'rrr',
                'rrr',
            ],
            edges: {
                left: {
                    roomName: 'slingerStaircase',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'slingerStaircase',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
                rightLower: {
                    roomName: 'slingerStaircase',
                    collision: '######....######',
                    row: 1.5,
                    column: 3.0,
                },
                bottom: {
                    roomName: 'slingerStaircase',
                    collision: '####....########',
                    row: 2.0,
                    column: 2.5,
                },
            },
        },
        beneathLeftTrapdoor: { // beneathLeftTrapdoor
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'beneathLeftTrapdoor',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                's',
            ],
            edges: {
                top: {
                    roomName: 'beneathLeftTrapdoor',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                right: {
                    roomName: 'beneathLeftTrapdoor',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        saveRoomB: { // saveRoomB
            rooms: [
                {
                    stage: 'marbleGallery',
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                't',
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
    },
    olroxsQuarters: {
        skelerangRoom: { // skelerangRoom, loadingRoomToMarbleGallery, triggerTeleporterToMarbleGallery
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'skelerangRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'loadingRoomToMarbleGallery',
                    row: 2,
                    column: 1,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'triggerTeleporterToMarbleGallery',
                    row: 2,
                    column: 2,
                },
            ],
            cells: [
                '0..',
                '0..',
                '0=#',
            ],
            edges: {
                left: {
                    roomName: 'skelerangRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        catwalkCrypt: { // triggerTeleporterToRoyalChapel, loadingRoomToRoyalChapel, catwalkCrypt
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'triggerTeleporterToRoyalChapel',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'loadingRoomToRoyalChapel',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'catwalkCrypt',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=4444444',
            ],
            edges: {
                top: {
                    roomName: 'catwalkCrypt',
                    collision: '#######..#######',
                    row: 0.0,
                    column: 3.5,
                },
                right: {
                    roomName: 'catwalkCrypt',
                    collision: '######....######',
                    row: 0.5,
                    column: 9.0,
                },
            },
        },
        grandStaircase: { // triggerTeleporterToColosseum, loadingRoomToColosseum, grandStaircase, bottomOfStairwell
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'triggerTeleporterToColosseum',
                    row: 1,
                    column: 0,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'loadingRoomToColosseum',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'grandStaircase',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'bottomOfStairwell',
                    row: 2,
                    column: 3,
                },
            ],
            cells: [
                '..111',
                '#=111',
                '...2.',
            ],
            edges: {
                rightUpper: {
                    roomName: 'grandStaircase',
                    collision: '######....######',
                    row: 0.5,
                    column: 5.0,
                },
                right: {
                    roomName: 'grandStaircase',
                    collision: '######....######',
                    row: 1.5,
                    column: 5.0,
                },
                rightLower: {
                    roomName: 'bottomOfStairwell',
                    collision: '######....######',
                    row: 2.5,
                    column: 4.0,
                },
            },
        },
        tallShaft: { // tallShaft, loadingRoomToWarpRooms, triggerTeleporterToWarpRooms
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'tallShaft',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'loadingRoomToWarpRooms',
                    row: 5,
                    column: 1,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'triggerTeleporterToWarpRooms',
                    row: 5,
                    column: 2,
                },
            ],
            cells: [
                '3..',
                '3..',
                '3..',
                '3..',
                '3..',
                '3=#',
            ],
            edges: {
                top: {
                    roomName: 'tallShaft',
                    collision: '#########..#####',
                    row: 0.0,
                    column: 0.5,
                },
                left: {
                    roomName: 'tallShaft',
                    collision: '######....######',
                    row: 5.5,
                    column: 0.0,
                },
            },
        },
        olroxsRoom: { // echoOfBatRoom, olroxsRoom, narrowHallwayToOlrox
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'echoOfBatRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'olroxsRoom',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'olroxsQuarters',
                    room: 'narrowHallwayToOlrox',
                    row: 0,
                    column: 5,
                },
            ],
            cells: [
                '555667777',
                '...66....',
            ],
            edges: {
                right: {
                    roomName: 'narrowHallwayToOlrox',
                    collision: '######....######',
                    row: 0.5,
                    column: 9.0,
                },
            },
        },
        emptyRoom: { // emptyRoom
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'emptyRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
            ],
            edges: {
                left: {
                    roomName: 'emptyRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'emptyRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        hammerAndBladeRoom: { // hammerAndBladeRoom
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'hammerAndBladeRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'bbbb',
            ],
            edges: {
                left: {
                    roomName: 'hammerAndBladeRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'hammerAndBladeRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        emptyCells: { // emptyCells
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'emptyCells',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '88',
            ],
            edges: {
                left: {
                    roomName: 'emptyCells',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'emptyCells',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        garnetRoom: { // garnetRoom
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'garnetRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'a',
            ],
            edges: {
                left: {
                    roomName: 'garnetRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        prison: { // prison
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'prison',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'dddddd',
            ],
            edges: {
                bottomLeft: {
                    roomName: 'prison',
                    collision: '#####..#########',
                    row: 1.0,
                    column: 0.5,
                },
                bottomRight: {
                    roomName: 'prison',
                    collision: '#########..#####',
                    row: 1.0,
                    column: 5.5,
                },
            },
        },
        openCourtyard: { // openCourtyard
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'openCourtyard',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'cccccc',
                'cccccc',
                'cccccc',
                'cccccc',
            ],
            edges: {
                top: {
                    roomName: 'openCourtyard',
                    collision: '#####..#########',
                    row: 0.0,
                    column: 5.5,
                },
                leftUpper: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 3.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 1.5,
                    column: 6.0,
                },
                rightLower: {
                    roomName: 'openCourtyard',
                    collision: '######....######',
                    row: 2.5,
                    column: 6.0,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
            ],
            edges: {
                left: {
                    roomName: 'saveRoomA',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        secretOnyxRoom: { // secretOnyxRoom
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'secretOnyxRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'eee',
            ],
            edges: {
                left: {
                    roomName: 'secretOnyxRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        swordCardRoom: { // swordCardRoom
            rooms: [
                {
                    stage: 'olroxsQuarters',
                    room: 'swordCardRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ff',
            ],
            edges: {
                bottom: {
                    roomName: 'swordCardRoom',
                    collision: '#######..#######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
    },
    outerWall: {
        elevatorShaftRoom: { // elevatorShaftRoom, triggerTeleporterToWarpRooms, loadingRoomToWarpRooms, triggerTeleporterToLongLibrary, loadingRoomToLongLibrary
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'elevatorShaftRoom',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'outerWall',
                    room: 'triggerTeleporterToWarpRooms',
                    row: 2,
                    column: 1,
                },
                {
                    stage: 'outerWall',
                    room: 'loadingRoomToWarpRooms',
                    row: 2,
                    column: 2,
                },
                {
                    stage: 'outerWall',
                    room: 'triggerTeleporterToLongLibrary',
                    row: 6,
                    column: 0,
                },
                {
                    stage: 'outerWall',
                    room: 'loadingRoomToLongLibrary',
                    row: 6,
                    column: 1,
                },
            ],
            cells: [
                '..00',
                '..00',
                '.#=0',
                '..00',
                '..00',
                '..00',
                '#=00',
                '..00',
                '..00',
            ],
            edges: {
                top: {
                    roomName: 'elevatorShaftRoom',
                    collision: '###......../####',
                    row: 0.0,
                    column: 3.5,
                },
                left: {
                    roomName: 'elevatorShaftRoom',
                    collision: '######....######',
                    row: 8.5,
                    column: 2.0,
                },
                bottom: {
                    roomName: 'elevatorShaftRoom',
                    collision: '##...###########',
                    row: 9.0,
                    column: 3.5,
                },
            },
        },
        exitToClockTower: { // triggerTeleporterToClockTower, loadingRoomToClockTower, exitToClockTower
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'triggerTeleporterToClockTower',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'outerWall',
                    room: 'loadingRoomToClockTower',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'outerWall',
                    room: 'exitToClockTower',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=1',
            ],
            edges: {
                top: {
                    roomName: 'exitToClockTower',
                    collision: '#######\\........',
                    row: 0.0,
                    column: 2.5,
                },
                bottom: {
                    roomName: 'exitToClockTower',
                    collision: '###......../####',
                    row: 1.0,
                    column: 2.5,
                },
            },
        },
        exitToMarbleGallery: { // triggerTeleporterToMarbleGallery, loadingRoomToMarbleGallery, exitToMarbleGallery
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'triggerTeleporterToMarbleGallery',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'outerWall',
                    room: 'loadingRoomToMarbleGallery',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'outerWall',
                    room: 'exitToMarbleGallery',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=2',
            ],
            edges: {
                top: {
                    roomName: 'exitToMarbleGallery',
                    collision: '#####\\..........',
                    row: 0.0,
                    column: 2.5,
                },
                bottom: {
                    roomName: 'exitToMarbleGallery',
                    collision: '#######\\........',
                    row: 1.0,
                    column: 2.5,
                },
            },
        },
        telescopeRoom: { // lowerMedusaRoom, telescopeRoom
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'lowerMedusaRoom',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'outerWall',
                    room: 'telescopeRoom',
                    row: 3,
                    column: 0,
                },
            ],
            cells: [
                '.33.',
                '.33.',
                '.33.',
                ',44,',
                ',,,,',
            ],
            edges: {
                top: {
                    roomName: 'lowerMedusaRoom',
                    collision: '#######\\........',
                    row: 0.0,
                    column: 2.5,
                },
                leftUpper: {
                    roomName: 'lowerMedusaRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                leftLower: {
                    roomName: 'lowerMedusaRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        doppelgangerRoom: { // garlicRoom, doppelgangerRoom, gladiusRoom
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'garlicRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'outerWall',
                    room: 'doppelgangerRoom',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'outerWall',
                    room: 'gladiusRoom',
                    row: 0,
                    column: 3,
                },
            ],
            cells: [
                '5667',
                '5...',
            ],
            edges: {
                left: {
                    roomName: 'garlicRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'gladiusRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
                rightLower: {
                    roomName: 'garlicRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        secretPlatformRoom: { // secretPlatformRoom, jewelKnucklesRoom
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'secretPlatformRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'outerWall',
                    room: 'jewelKnucklesRoom',
                    row: 1,
                    column: 0,
                },
            ],
            cells: [
                '8',
                '9',
            ],
            edges: {
                rightUpper: {
                    roomName: 'secretPlatformRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'jewelKnucklesRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        blueAxeKnightRoom: { // blueAxeKnightRoom
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'blueAxeKnightRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'aaa',
            ],
            edges: {
                left: {
                    roomName: 'blueAxeKnightRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'blueAxeKnightRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        garnetVaseRoom: { // garnetVaseRoom
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'garnetVaseRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'bb',
            ],
            edges: {
                top: {
                    roomName: 'garnetVaseRoom',
                    collision: '##...###########',
                    row: 0.0,
                    column: 1.5,
                },
                left: {
                    roomName: 'garnetVaseRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'garnetVaseRoom',
                    collision: '#####\\..........',
                    row: 1.0,
                    column: 1.5,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
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
        saveRoomB: { // saveRoomB
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
            ],
            edges: {
                right: {
                    roomName: 'saveRoomB',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        topOfOuterWall: { // topOfOuterWall
            rooms: [
                {
                    stage: 'outerWall',
                    room: 'topOfOuterWall',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'c',
            ],
            edges: {
                left: {
                    roomName: 'topOfOuterWall',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'topOfOuterWall',
                    collision: '#######\\........',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
    },
    royalChapel: {
        hippogryphRoom: { // walkwayLeftOfHippogryph, hippogryphRoom, walkwayRightOfHippogryph
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'walkwayLeftOfHippogryph',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'royalChapel',
                    room: 'hippogryphRoom',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'royalChapel',
                    room: 'walkwayRightOfHippogryph',
                    row: 0,
                    column: 5,
                },
            ],
            cells: [
                '.001122.',
            ],
            edges: {
                left: {
                    roomName: 'walkwayLeftOfHippogryph',
                    collision: '######<<<<######',
                    row: 0.5,
                    column: 1.0,
                },
                right: {
                    roomName: 'walkwayRightOfHippogryph',
                    collision: '######>>>>######',
                    row: 0.5,
                    column: 7.0,
                },
            },
        },
        rightTower: { // rightTower, loadingRoomToCastleKeep, triggerTeleporterToCastleKeep, saveRoomB
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'rightTower',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'royalChapel',
                    room: 'loadingRoomToCastleKeep',
                    row: 2,
                    column: 3,
                },
                {
                    stage: 'royalChapel',
                    room: 'triggerTeleporterToCastleKeep',
                    row: 2,
                    column: 4,
                },
                {
                    stage: 'royalChapel',
                    room: 'saveRoomB',
                    row: 3,
                    column: 3,
                },
            ],
            cells: [
                '.33..',
                '.33..',
                '.33=#',
                '.334.',
            ],
            edges: {
                left: {
                    roomName: 'rightTower',
                    collision: '######>>>>######',
                    row: 3.5,
                    column: 1.0,
                },
            },
        },
        pushingStatueShortcut: { // pushingStatueShortcut, loadingRoomToOlroxsQuarters, triggerTeleporterToOlroxsQuarters
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'pushingStatueShortcut',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'royalChapel',
                    room: 'loadingRoomToOlroxsQuarters',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'royalChapel',
                    room: 'triggerTeleporterToOlroxsQuarters',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '5=#',
            ],
            edges: {
                left: {
                    roomName: 'pushingStatueShortcut',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        nave: { // nave, loadingRoomToColosseum, triggerTeleporterToColosseum
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'nave',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'royalChapel',
                    room: 'loadingRoomToColosseum',
                    row: 1,
                    column: 2,
                },
                {
                    stage: 'royalChapel',
                    room: 'triggerTeleporterToColosseum',
                    row: 1,
                    column: 3,
                },
            ],
            cells: [
                '66..',
                '66=#',
            ],
            edges: {
                leftUpper: {
                    roomName: 'nave',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'nave',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
                leftLower: {
                    roomName: 'nave',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
            },
        },
        statueLedge: { // saveRoomA, statueLedge, loadingRoomToAlchemyLaboratory, triggerTeleporterToAlchemyLaboratory
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'royalChapel',
                    room: 'statueLedge',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'royalChapel',
                    room: 'loadingRoomToAlchemyLaboratory',
                    row: 0,
                    column: 2,
                },
                {
                    stage: 'royalChapel',
                    room: 'triggerTeleporterToAlchemyLaboratory',
                    row: 0,
                    column: 3,
                },
            ],
            cells: [
                '@7=#',
            ],
            edges: {
                top: {
                    roomName: 'statueLedge',
                    collision: '######....######',
                    row: 0.0,
                    column: 1.5,
                },
            },
        },
        chapelStaircase: { // chapelStaircase
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'chapelStaircase',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                ',,,,,,88',
                ',,,,,888',
                ',,,,8888',
                ',,,888,,',
                ',,888,,,',
                ',888,,,,',
                '888,,,,,',
            ],
            edges: {
                right: {
                    roomName: 'chapelStaircase',
                    collision: '######....######',
                    row: 1.5,
                    column: 8.0,
                },
                bottom: {
                    roomName: 'chapelStaircase',
                    collision: '######....######',
                    row: 7.0,
                    column: 1.5,
                },
            },
        },
        confessionalBooth: { // confessionalBooth
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'confessionalBooth',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '9',
            ],
            edges: {
                left: {
                    roomName: 'confessionalBooth',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        emptyRoom: { // emptyRoom
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'emptyRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'a',
            ],
            edges: {
                left: {
                    roomName: 'emptyRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'emptyRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        gogglesRoom: { // gogglesRoom
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'gogglesRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'b',
                'b',
                'b',
            ],
            edges: {
                left: {
                    roomName: 'gogglesRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'gogglesRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'gogglesRoom',
                    collision: '######....######',
                    row: 2.5,
                    column: 1.0,
                },
            },
        },
        leftTower: { // leftTower
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'leftTower',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
                '.cc.',
            ],
            edges: {
                leftUpper: {
                    roomName: 'leftTower',
                    collision: '######>>>>######',
                    row: 3.5,
                    column: 1.0,
                },
                leftLower: {
                    roomName: 'leftTower',
                    collision: '######....######',
                    row: 9.5,
                    column: 1.0,
                },
                rightUpper: {
                    roomName: 'leftTower',
                    collision: '######<<<<######',
                    row: 2.5,
                    column: 3.0,
                },
                right: {
                    roomName: 'leftTower',
                    collision: '######....######',
                    row: 7.5,
                    column: 3.0,
                },
                rightLower: {
                    roomName: 'leftTower',
                    collision: '######....######',
                    row: 8.5,
                    column: 3.0,
                },
            },
        },
        middleTower: { // middleTower
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'middleTower',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '.dd.',
                '.dd.',
                '.dd.',
                '.dd.',
            ],
            edges: {
                left: {
                    roomName: 'middleTower',
                    collision: '######>>>>######',
                    row: 3.5,
                    column: 1.0,
                },
                right: {
                    roomName: 'middleTower',
                    collision: '######<<<<######',
                    row: 2.5,
                    column: 3.0,
                },
            },
        },
        silverRingRoom: { // silverRingRoom
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'silverRingRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ee',
            ],
            edges: {
                right: {
                    roomName: 'silverRingRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        spikeHallway: { // spikeHallway
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'spikeHallway',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ffff.',
            ],
            edges: {
                left: {
                    roomName: 'spikeHallway',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'spikeHallway',
                    collision: '######>>>>######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        walkwayBetweenTowers: { // walkwayBetweenTowers
            rooms: [
                {
                    stage: 'royalChapel',
                    room: 'walkwayBetweenTowers',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '.ggg.',
            ],
            edges: {
                left: {
                    roomName: 'walkwayBetweenTowers',
                    collision: '######<<<<######',
                    row: 0.5,
                    column: 1.0,
                },
                right: {
                    roomName: 'walkwayBetweenTowers',
                    collision: '######>>>>######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
    },
    undergroundCaverns: {
        falseSaveRoom: { // falseSaveRoom, triggerTeleporterToBossSuccubus
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'falseSaveRoom',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'triggerTeleporterToBossSuccubus',
                    row: 0,
                    column: 1,
                },
            ],
            cells: [
                '@#',
            ],
            edges: {
                left: {
                    roomName: 'falseSaveRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        exitToCastleEntrance: { // triggerTeleporterToCastleEntrance, loadingRoomToCastleEntrance, exitToCastleEntrance
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'triggerTeleporterToCastleEntrance',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'loadingRoomToCastleEntrance',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'exitToCastleEntrance',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '#=00',
            ],
            edges: {
                bottom: {
                    roomName: 'exitToCastleEntrance',
                    collision: '######....######',
                    row: 1.0,
                    column: 1.5,
                },
            },
        },
        longDrop: { // longDrop, loadingRoomToMarbleGallery, triggerTeleporterToMarbleGallery
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'longDrop',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'loadingRoomToMarbleGallery',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'triggerTeleporterToMarbleGallery',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '1=#',
                '1..',
                '1..',
                '1..',
                '1..',
                '1..',
                '1..',
                '1..',
                '1..',
                '1..',
                '1..',
            ],
            edges: {
                left: {
                    roomName: 'longDrop',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                rightUpper: {
                    roomName: 'longDrop',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
                rightLower: {
                    roomName: 'longDrop',
                    collision: '######....######',
                    row: 3.5,
                    column: 1.0,
                },
                bottom: {
                    roomName: 'longDrop',
                    collision: '######....######',
                    row: 11.0,
                    column: 0.5,
                },
            },
        },
        exitToAbandonedMine: { // triggerTeleporterToAbandonedMine, loadingRoomToAbandonedMine, exitToAbandonedMine
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'triggerTeleporterToAbandonedMine',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'loadingRoomToAbandonedMine',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'exitToAbandonedMine',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '2=#',
            ],
            edges: {
                top: {
                    roomName: 'exitToAbandonedMine',
                    collision: '######....######',
                    row: 0.0,
                    column: 2.5,
                },
            },
        },
        scyllaRoom: { // hiddenCrystalEntrance, crystalCloakRoom, scyllaRoom, scyllaWyrmRoom, risingWaterRoom
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'hiddenCrystalEntrance',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'crystalCloakRoom',
                    row: 1,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'scyllaRoom',
                    row: 1,
                    column: 2,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'scyllaWyrmRoom',
                    row: 2,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'risingWaterRoom',
                    row: 2,
                    column: 2,
                },
            ],
            cells: [
                '3......',
                '3455555',
                '3677777',
            ],
            edges: {
                top: {
                    roomName: 'hiddenCrystalEntrance',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                left: {
                    roomName: 'hiddenCrystalEntrance',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'hiddenCrystalEntrance',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
                bottom: {
                    roomName: 'hiddenCrystalEntrance',
                    collision: '######....######',
                    row: 3.0,
                    column: 0.5,
                },
            },
        },
        waterfall: { // dKButton, waterfall, pentagramRoom, roomId19, roomId18
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'dKButton',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'waterfall',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'pentagramRoom',
                    row: 0,
                    column: 3,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'roomId19',
                    row: 5,
                    column: 1,
                },
                {
                    stage: 'undergroundCaverns',
                    room: 'roomId18',
                    row: 5,
                    column: 3,
                },
            ],
            cells: [
                '899a',
                '.99.',
                '.99.',
                '.99.',
                '.99.',
                'b99c',
            ],
            edges: {
                left: {
                    roomName: 'roomId19',
                    collision: '######....######',
                    row: 5.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'pentagramRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
            },
        },
        saveRoomA: { // saveRoomA
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'saveRoomA',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
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
        saveRoomB: { // saveRoomB
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'saveRoomB',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
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
        saveRoomC: { // saveRoomC
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'saveRoomC',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                '@',
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
        crystalBend: { // crystalBend
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'crystalBend',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'd',
                'd',
            ],
            edges: {
                top: {
                    roomName: 'crystalBend',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                right: {
                    roomName: 'crystalBend',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        tallStairwell: { // tallStairwell
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'tallStairwell',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'e',
                'e',
                'e',
                'e',
                'e',
                'e',
                'e',
                'e',
                'e',
            ],
            edges: {
                leftUpper: {
                    roomName: 'tallStairwell',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'tallStairwell',
                    collision: '######....######',
                    row: 6.5,
                    column: 0.0,
                },
                bottom: {
                    roomName: 'tallStairwell',
                    collision: '######....######',
                    row: 9.0,
                    column: 0.5,
                },
            },
        },
        plaqueRoomWithLifeMaxUp: { // plaqueRoomWithLifeMaxUp
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'plaqueRoomWithLifeMaxUp',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'f',
            ],
            edges: {
                bottom: {
                    roomName: 'plaqueRoomWithLifeMaxUp',
                    collision: '######....######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        smallStairwell: { // smallStairwell
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'smallStairwell',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'g',
                'g',
            ],
            edges: {
                top: {
                    roomName: 'smallStairwell',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                right: {
                    roomName: 'smallStairwell',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        claymoreStairwell: { // claymoreStairwell
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'claymoreStairwell',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'h',
                'h',
                'h',
                'h',
            ],
            edges: {
                left: {
                    roomName: 'claymoreStairwell',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'claymoreStairwell',
                    collision: '######....######',
                    row: 3.5,
                    column: 1.0,
                },
            },
        },
        mealTicketsAndMoonstoneRoom: { // mealTicketsAndMoonstoneRoom
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'mealTicketsAndMoonstoneRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'i',
                'i',
            ],
            edges: {
                leftUpper: {
                    roomName: 'mealTicketsAndMoonstoneRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                leftLower: {
                    roomName: 'mealTicketsAndMoonstoneRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'mealTicketsAndMoonstoneRoom',
                    collision: '######....######',
                    row: 1.5,
                    column: 1.0,
                },
            },
        },
        plaqueRoomWithBreakableWall: { // plaqueRoomWithBreakableWall
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'plaqueRoomWithBreakableWall',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'j',
            ],
            edges: {
                left: {
                    roomName: 'plaqueRoomWithBreakableWall',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'plaqueRoomWithBreakableWall',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        roomId09: { // roomId09
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'roomId09',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'kk',
            ],
            edges: {
                left: {
                    roomName: 'roomId09',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId09',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
                bottom: {
                    roomName: 'roomId09',
                    collision: '######....######',
                    row: 1.0,
                    column: 0.5,
                },
            },
        },
        roomId10: { // roomId10
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'roomId10',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'l',
            ],
            edges: {
                top: {
                    roomName: 'roomId10',
                    collision: '######....######',
                    row: 0.0,
                    column: 0.5,
                },
                bottom: {
                    roomName: 'roomId10',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        roomId11: { // roomId11
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'roomId11',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'mmm',
            ],
            edges: {
                left: {
                    roomName: 'roomId11',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId11',
                    collision: '######....######',
                    row: 0.5,
                    column: 3.0,
                },
            },
        },
        roomId12: { // roomId12
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'roomId12',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'nn',
            ],
            edges: {
                left: {
                    roomName: 'roomId12',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'roomId12',
                    collision: '######....######',
                    row: 0.5,
                    column: 2.0,
                },
            },
        },
        holySymbolRoom: { // holySymbolRoom
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'holySymbolRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'o',
            ],
            edges: {
                left: {
                    roomName: 'holySymbolRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
            },
        },
        dKBridge: { // dKBridge
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'dKBridge',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'pppp',
            ],
            edges: {
                left: {
                    roomName: 'dKBridge',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'dKBridge',
                    collision: '######....######',
                    row: 0.5,
                    column: 4.0,
                },
                bottom: {
                    roomName: 'dKBridge',
                    collision: '######....######',
                    row: 1.0,
                    column: 3.5,
                },
            },
        },
        mermanStatueRoom: { // mermanStatueRoom
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'mermanStatueRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'q',
            ],
            edges: {
                right: {
                    roomName: 'mermanStatueRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
        iceFloeRoom: { // iceFloeRoom
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'iceFloeRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'rrrrrrrrr',
                'rr,rrrrrr',
            ],
            edges: {
                top: {
                    roomName: 'iceFloeRoom',
                    collision: '######....######',
                    row: 0.0,
                    column: 8.5,
                },
                left: {
                    roomName: 'iceFloeRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'iceFloeRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 9.0,
                },
            },
        },
        rightFerrymanRoute: { // rightFerrymanRoute
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'rightFerrymanRoute',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'sssssssssssss',
                'sss,,,ss,ssss',
            ],
            edges: {
                left: {
                    roomName: 'rightFerrymanRoute',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'rightFerrymanRoute',
                    collision: '######....######',
                    row: 0.5,
                    column: 13.0,
                },
            },
        },
        leftFerrymanRoute: { // leftFerrymanRoute
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'leftFerrymanRoute',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'ttttttttttttt',
                'ttttt,,,,,,,,',
            ],
            edges: {
                top: {
                    roomName: 'leftFerrymanRoute',
                    collision: '######....######',
                    row: 0.0,
                    column: 8.5,
                },
                left: {
                    roomName: 'leftFerrymanRoute',
                    collision: '######....######',
                    row: 0.5,
                    column: 0.0,
                },
                right: {
                    roomName: 'leftFerrymanRoute',
                    collision: '######....######',
                    row: 0.5,
                    column: 13.0,
                },
            },
        },
        bandannaRoom: { // bandannaRoom
            rooms: [
                {
                    stage: 'undergroundCaverns',
                    room: 'bandannaRoom',
                    row: 0,
                    column: 0,
                },
            ],
            cells: [
                'u',
            ],
            edges: {
                right: {
                    roomName: 'bandannaRoom',
                    collision: '######....######',
                    row: 0.5,
                    column: 1.0,
                },
            },
        },
    },
    warpRooms: {
        warpRoomToCastleEntrance: { // warpRoomToCastleEntrance, loadingRoomToCastleEntrance, triggerTeleporterToCastleEntrance
            rooms: [
                {
                    stage: 'warpRooms',
                    room: 'warpRoomToCastleEntrance',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'warpRooms',
                    room: 'loadingRoomToCastleEntrance',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'warpRooms',
                    room: 'triggerTeleporterToCastleEntrance',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                'W..',
            ],
            edges: {},
        },
        warpRoomToCastleKeep: { // triggerTeleporterToCastleKeep, loadingRoomToCastleKeep, warpRoomToCastleKeep
            rooms: [
                {
                    stage: 'warpRooms',
                    room: 'triggerTeleporterToCastleKeep',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'warpRooms',
                    room: 'loadingRoomToCastleKeep',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'warpRooms',
                    room: 'warpRoomToCastleKeep',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '..W',
            ],
            edges: {},
        },
        warpRoomToOlroxsQuarters: { // triggerTeleporterToOlroxsQuarters, loadingRoomToOlroxsQuarters, warpRoomToOlroxsQuarters
            rooms: [
                {
                    stage: 'warpRooms',
                    room: 'triggerTeleporterToOlroxsQuarters',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'warpRooms',
                    room: 'loadingRoomToOlroxsQuarters',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'warpRooms',
                    room: 'warpRoomToOlroxsQuarters',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '..W',
            ],
            edges: {},
        },
        warpRoomToOuterWall: { // warpRoomToOuterWall, loadingRoomToOuterWall, triggerTeleporterToOuterWall
            rooms: [
                {
                    stage: 'warpRooms',
                    room: 'warpRoomToOuterWall',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'warpRooms',
                    room: 'loadingRoomToOuterWall',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'warpRooms',
                    room: 'triggerTeleporterToOuterWall',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                'W..',
            ],
            edges: {},
        },
        warpRoomToAbandonedMine: { // triggerTeleporterToAbandonedMine, loadingRoomToAbandonedMine, warpRoomToAbandonedMine
            rooms: [
                {
                    stage: 'warpRooms',
                    room: 'triggerTeleporterToAbandonedMine',
                    row: 0,
                    column: 0,
                },
                {
                    stage: 'warpRooms',
                    room: 'loadingRoomToAbandonedMine',
                    row: 0,
                    column: 1,
                },
                {
                    stage: 'warpRooms',
                    room: 'warpRoomToAbandonedMine',
                    row: 0,
                    column: 2,
                },
            ],
            cells: [
                '..W',
            ],
            edges: {},
        },
    },
}

export function combineNodeGroups(baseNodeGroup, nodeGroup, rowOffset, columnOffset, options={}) {
    const result = {
        rooms: [],
        cells: [],
        edges: [],
    }
    baseNodeGroup.rooms.forEach((roomInfo) => {
        result.rooms.push({
            stage: roomInfo.stage,
            room: roomInfo.room,
            row: roomInfo.row + Math.max(0, -rowOffset),
            column: roomInfo.column + Math.max(0, -columnOffset),
        })
    })
    nodeGroup.rooms.forEach((roomInfo) => {
        result.rooms.push({
            stage: roomInfo.stage,
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
    if (rows >= 59 || columns >= 64) {
        return null
    }
    result.cells = []
    for (let row = 0; row < rows; row++) {
        const rowData = []
        for (let column = 0; column < columns; column++) {
            const values = ['.']
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
                if (!(options.allowOverlaps ?? false)) {
                    return null
                }
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
                // edgeName: baseEdgeInfo.edgeName,
                collision: baseEdgeInfo.collision,
                row: baseRow,
                column: baseColumn,
            })
        })
    if (!validInd) {
        return null
    }
    const nodeEdges = Array.isArray(nodeGroup.edges) ? nodeGroup.edges : []
    nodeEdges
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
                collision: edgeInfo.collision,
                row: row,
                column: column,
            })
        })
    if (!validInd) {
        return null
    }
    // TODO(sestren): Verify that all open edges do not face a filled-in square
    const blockedEdges = result.edges
        .filter((edgeInfo) => {
            let rowA = edgeInfo.row
            let rowB = edgeInfo.row
            let columnA = edgeInfo.column
            let columnB = edgeInfo.column
            if (Number.isInteger(edgeInfo.row)) {
                columnA -= 0.5
                columnB -= 0.5
                rowA -= 1
            }
            else if (Number.isInteger(edgeInfo.column)) {
                rowA -= 0.5
                rowB -= 0.5
                columnA -= 1
            }
            else {
                throw Error('Either row or column of edge must be non-integer')
            }
            if (
                (0 <= rowA && rowA < result.cells.length) &&
                (0 <= rowB && rowB < result.cells.length) &&
                (0 <= columnA && columnA < result.cells.at(0).length) &&
                (0 <= columnB && columnB < result.cells.at(0).length)
            ) {
                const cellA = result.cells.at(rowA).at(columnA)
                const cellB = result.cells.at(rowB).at(columnB)
                return (cellA !== '.') && (cellB !== '.')
            }
            else {
                return false
            }
        })
    if (blockedEdges.length > 0) {
        return null
    }
    // console.log('result:', result)
    return result
}

export function shuffleRooms(seed, stageName, applyNormalization) {
    if (applyNormalization) {
        if (stageName in normalizationPatches) {
            Object.entries(normalizationPatches[stageName]).forEach(([patchKey, patchValue]) => {
                let context = nodeGroups[stageName]
                const properties = patchKey.split('.')
                for (let propertyIndex = 0; propertyIndex < properties.length - 1; propertyIndex++) {
                    context = context[properties.at(propertyIndex)]
                }
                context[properties.at(-1)] = patchValue
            })
        }
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
                // console.log('ERROR result.edges.length < 1:', result.edges.length)
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
                // console.log('ERROR nextResults.length < 1:', nextResults.length)
                validInd = false
                break
            }
            const spliceIndex = groupIndexes.indexOf(nextResults.at(-1).groupIndex)
            groupIndexes.splice(spliceIndex, 1)
            result = nextResults.at(-1).nextResult
        }
        if (groupIndexes.length > 0 || result.edges.length > 0) {
            // console.log('ERROR groupIndexes.length > 0 || result.edges.length > 0:', groupIndexes.length, result.edges.length)
            validInd = false
        }
        if (groupIndexes.length < 2) {
            groupIndexes.forEach((groupIndex) => {
                // console.log('stageNodeGroup:', groupIndex, stageNodeGroups.at(groupIndex))
            })
            // console.log('result:', result)
        }
    }
    console.log('attemptCount:', attemptCount)
    // console.log('result:', result)
    return result
}

export function getRoomChanges(rooms, rowOffset, columnOffset) {
    const roomData = {}
    rooms.forEach((roomInfo) => {
        const rowProperty = `stages.${roomInfo.stage}.rooms.${roomInfo.room}.top=`
        roomData[rowProperty] = rowOffset + roomInfo.row
        const columnProperty = `stages.${roomInfo.stage}.rooms.${roomInfo.room}.left=`
        roomData[columnProperty] = columnOffset + roomInfo.column
    })
    const result = {
        changeType: 'merge',
        merge: roomData,
    }
    return result
}
