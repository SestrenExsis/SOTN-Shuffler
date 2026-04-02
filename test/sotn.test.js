import { test } from 'node:test'
import { deepStrictEqual } from 'node:assert'
import {
    shuffleStages,
} from '../src/shuffle-stages.js'

const testLinks = [
    {
        testDescription: 'asdf',
        input: {
            seed: 'asdf',
        },
        expected: {
            linkedStages: {
                abandonedMine: [ 'castleKeep', 'clockTower', 'warpRooms' ],
                alchemyLaboratory: [ 'castleEntrance', 'catacombs', 'colosseum' ],
                castleEntrance: [
                    'alchemyLaboratory',
                    'marbleGallery',
                    'olroxsQuarters',
                    'outerWall'
                ],
                castleKeep: [ 'abandonedMine', 'clockTower', 'olroxsQuarters' ],
                catacombs: [ 'alchemyLaboratory' ],
                clockTower: [ 'abandonedMine', 'castleKeep' ],
                colosseum: [ 'alchemyLaboratory', 'undergroundCaverns' ],
                longLibrary: [ 'marbleGallery' ],
                marbleGallery: [
                    'castleEntrance',
                    'longLibrary',
                    'royalChapel',
                    'undergroundCaverns',
                    'warpRooms'
                ],
                olroxsQuarters: [ 'castleEntrance', 'castleKeep', 'outerWall', 'royalChapel' ],
                outerWall: [ 'castleEntrance', 'olroxsQuarters', 'royalChapel', 'warpRooms' ],
                royalChapel: [ 'marbleGallery', 'olroxsQuarters', 'outerWall', 'warpRooms' ],
                undergroundCaverns: [ 'colosseum', 'marbleGallery', 'warpRooms' ],
                warpRooms: [
                    'abandonedMine',
                    'marbleGallery',
                    'outerWall',
                    'royalChapel',
                    'undergroundCaverns'
                ]
            },
            links: {
                fromAbandonedMineToCatacombs: 'fromCastleKeepToWarpRooms',
                fromAbandonedMineToUndergroundCaverns: 'fromWarpRoomsToOlroxsQuarters',
                fromAbandonedMineToWarpRooms: 'fromClockTowerToCastleKeep',
                fromAlchemyLaboratoryToCastleEntrance: 'fromCastleEntranceToWarpRooms',
                fromAlchemyLaboratoryToMarbleGallery: 'fromColosseumToRoyalChapel',
                fromAlchemyLaboratoryToRoyalChapel: 'fromCatacombsToAbandonedMine',
                fromCastleEntranceToAlchemyLaboratory: 'fromOlroxsQuartersToMarbleGallery',
                fromCastleEntranceToMarbleGallery: 'fromMarbleGalleryToUndergroundCaverns',
                fromCastleEntranceToUndergroundCaverns: 'fromOuterWallToClockTower',
                fromCastleEntranceToWarpRooms: 'fromAlchemyLaboratoryToCastleEntrance',
                fromCastleKeepToClockTower: 'fromOlroxsQuartersToRoyalChapel',
                fromCastleKeepToRoyalChapel: 'fromClockTowerToOuterWall',
                fromCastleKeepToWarpRooms: 'fromAbandonedMineToCatacombs',
                fromCatacombsToAbandonedMine: 'fromAlchemyLaboratoryToRoyalChapel',
                fromClockTowerToCastleKeep: 'fromAbandonedMineToWarpRooms',
                fromClockTowerToOuterWall: 'fromCastleKeepToRoyalChapel',
                fromColosseumToOlroxsQuarters: 'fromUndergroundCavernsToAbandonedMine',
                fromColosseumToRoyalChapel: 'fromAlchemyLaboratoryToMarbleGallery',
                fromLongLibraryToOuterWall: 'fromMarbleGalleryToCastleEntrance',
                fromMarbleGalleryToAlchemyLaboratory: 'fromRoyalChapelToOlroxsQuarters',
                fromMarbleGalleryToCastleEntrance: 'fromLongLibraryToOuterWall',
                fromMarbleGalleryToOlroxsQuarters: 'fromUndergroundCavernsToMarbleGallery',
                fromMarbleGalleryToOuterWall: 'fromWarpRoomsToCastleKeep',
                fromMarbleGalleryToUndergroundCaverns: 'fromCastleEntranceToMarbleGallery',
                fromOlroxsQuartersToColosseum: 'fromRoyalChapelToCastleKeep',
                fromOlroxsQuartersToMarbleGallery: 'fromCastleEntranceToAlchemyLaboratory',
                fromOlroxsQuartersToRoyalChapel: 'fromCastleKeepToClockTower',
                fromOlroxsQuartersToWarpRooms: 'fromOuterWallToWarpRooms',
                fromOuterWallToClockTower: 'fromCastleEntranceToUndergroundCaverns',
                fromOuterWallToLongLibrary: 'fromRoyalChapelToAlchemyLaboratory',
                fromOuterWallToMarbleGallery: 'fromWarpRoomsToOuterWall',
                fromOuterWallToWarpRooms: 'fromOlroxsQuartersToWarpRooms',
                fromRoyalChapelToAlchemyLaboratory: 'fromOuterWallToLongLibrary',
                fromRoyalChapelToCastleKeep: 'fromOlroxsQuartersToColosseum',
                fromRoyalChapelToColosseum: 'fromWarpRoomsToAbandonedMine',
                fromRoyalChapelToOlroxsQuarters: 'fromMarbleGalleryToAlchemyLaboratory',
                fromUndergroundCavernsToAbandonedMine: 'fromColosseumToOlroxsQuarters',
                fromUndergroundCavernsToCastleEntrance: 'fromWarpRoomsToCastleEntrance',
                fromUndergroundCavernsToMarbleGallery: 'fromMarbleGalleryToOlroxsQuarters',
                fromWarpRoomsToAbandonedMine: 'fromRoyalChapelToColosseum',
                fromWarpRoomsToCastleEntrance: 'fromUndergroundCavernsToCastleEntrance',
                fromWarpRoomsToCastleKeep: 'fromMarbleGalleryToOuterWall',
                fromWarpRoomsToOlroxsQuarters: 'fromAbandonedMineToUndergroundCaverns',
                fromWarpRoomsToOuterWall: 'fromOuterWallToMarbleGallery'
            }
        },
    },
]

for (const testData of testLinks) {
    test('shuffleStages - ' + testData.testDescription, () => {
        deepStrictEqual(shuffleStages(testData.input.seed), testData.expected)
    })
}