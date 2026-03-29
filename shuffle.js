import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

const teleporters = {
    fromAbandonedMineToCatacombs: {
        stage: 'abandonedMine',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromAbandonedMineToUndergroundCaverns: {
        stage: 'abandonedMine',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromAbandonedMineToWarpRooms: {
        stage: 'abandonedMine',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromAlchemyLaboratoryToCastleEntrance: {
        stage: 'alchemyLaboratory',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromAlchemyLaboratoryToMarbleGallery: {
        stage: 'alchemyLaboratory',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromAlchemyLaboratoryToRoyalChapel: {
        stage: 'alchemyLaboratory',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromCastleEntranceToAlchemyLaboratory: {
        stage: 'castleEntrance',
        direction: 'left',
        forbiddenConnections: [
            // NOTE(sestren): Forbidden from leading to Warp Rooms
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleEntrance',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
            // NOTE(sestren): Forbidden from leading to "dead end" stages
            'fromCatacombsToAbandonedMine',
            'fromLongLibraryToOuterWall',
        ],
    },
    fromCastleEntranceToMarbleGallery: {
        stage: 'castleEntrance',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromCastleEntranceToUndergroundCaverns: {
        stage: 'castleEntrance',
        direction: 'right',
        forbiddenConnections: [
            // NOTE(sestren): Forbidden from being "orphaned" by one-way paths
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ],
    },
    fromCastleEntranceToWarpRooms: {
        stage: 'castleEntrance',
        direction: 'left',
        forbiddenConnections: [
            // NOTE(sestren): Forbidden from being "orphaned" by one-way paths
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
            // NOTE(sestren): Forbidden from requiring a Library Card to open
            'fromLongLibraryToOuterWall',
            // NOTE(sestren): Forbidden from requiring one-way paths to open
            'fromCatacombsToAbandonedMine',
            'fromColosseumToOlroxsQuarters',
            'fromRoyalChapelToOlroxsQuarters',
        ],
    },
    fromCastleKeepToClockTower: {
        stage: 'castleKeep',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromCastleKeepToRoyalChapel: {
        stage: 'castleKeep',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromCastleKeepToWarpRooms: {
        stage: 'castleKeep',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromCatacombsToAbandonedMine: {
        stage: 'catacombs',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromClockTowerToCastleKeep: {
        stage: 'clockTower',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromClockTowerToOuterWall: {
        stage: 'clockTower',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromColosseumToOlroxsQuarters: {
        stage: 'colosseum',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromColosseumToRoyalChapel: {
        stage: 'colosseum',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromLongLibraryToOuterWall: {
        stage: 'longLibrary',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromMarbleGalleryToAlchemyLaboratory: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromMarbleGalleryToCastleEntrance: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromMarbleGalleryToOlroxsQuarters: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromMarbleGalleryToOuterWall: {
        stage: 'marbleGallery',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromMarbleGalleryToUndergroundCaverns: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromOlroxsQuartersToColosseum: {
        stage: 'olroxsQuarters',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromOlroxsQuartersToMarbleGallery: {
        stage: 'olroxsQuarters',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromOlroxsQuartersToRoyalChapel: {
        stage: 'olroxsQuarters',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromOlroxsQuartersToWarpRooms: {
        stage: 'olroxsQuarters',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromOuterWallToClockTower: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromOuterWallToLongLibrary: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromOuterWallToMarbleGallery: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromOuterWallToWarpRooms: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromRoyalChapelToAlchemyLaboratory: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromRoyalChapelToCastleKeep: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromRoyalChapelToColosseum: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromRoyalChapelToOlroxsQuarters: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: [
            // NOTE(sestren): Forbidden from being "orphaned" by one-way paths
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ],
    },
    fromUndergroundCavernsToAbandonedMine: {
        stage: 'undergroundCaverns',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromUndergroundCavernsToCastleEntrance: {
        stage: 'undergroundCaverns',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromUndergroundCavernsToMarbleGallery: {
        stage: 'undergroundCaverns',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromWarpRoomsToAbandonedMine: {
        stage: 'warpRooms',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromWarpRoomsToCastleEntrance: {
        stage: 'warpRooms',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromWarpRoomsToCastleKeep: {
        stage: 'warpRooms',
        direction: 'right',
        forbiddenConnections: [],
    },
    fromWarpRoomsToOlroxsQuarters: {
        stage: 'warpRooms',
        direction: 'left',
        forbiddenConnections: [],
    },
    fromWarpRoomsToOuterWall: {
        stage: 'warpRooms',
        direction: 'right',
        forbiddenConnections: [],
    },
}

const stages = {
    abandonedMine: {
        teleporterNames: [
            'fromAbandonedMineToCatacombs',
            'fromAbandonedMineToUndergroundCaverns',
            'fromAbandonedMineToWarpRooms',
        ],
    },
    alchemyLaboratory: {
        teleporterNames: [
            'fromAlchemyLaboratoryToCastleEntrance',
            'fromAlchemyLaboratoryToMarbleGallery',
            'fromAlchemyLaboratoryToRoyalChapel',
        ],
    },
    castleEntrance: {
        teleporterNames: [
            'fromCastleEntranceToAlchemyLaboratory',
            'fromCastleEntranceToMarbleGallery',
            'fromCastleEntranceToUndergroundCaverns',
            'fromCastleEntranceToWarpRooms',
        ],
    },
    castleKeep: {
        teleporterNames: [
            'fromCastleKeepToClockTower',
            'fromCastleKeepToRoyalChapel',
            'fromCastleKeepToWarpRooms',
        ],
    },
    catacombs: {
        teleporterNames: [
            'fromCatacombsToAbandonedMine',
        ],
    },
    clockTower: {
        teleporterNames: [
            'fromClockTowerToCastleKeep',
            'fromClockTowerToOuterWall',
        ],
    },
    colosseum: {
        teleporterNames: [
            'fromColosseumToOlroxsQuarters',
            'fromColosseumToRoyalChapel',
        ],
    },
    longLibrary: {
        teleporterNames: [
            'fromLongLibraryToOuterWall',
        ],
    },
    marbleGallery: {
        teleporterNames: [
            'fromMarbleGalleryToAlchemyLaboratory',
            'fromMarbleGalleryToCastleEntrance',
            'fromMarbleGalleryToOlroxsQuarters',
            'fromMarbleGalleryToOuterWall',
            'fromMarbleGalleryToUndergroundCaverns',
        ],
    },
    olroxsQuarters: {
        teleporterNames: [
            'fromOlroxsQuartersToColosseum',
            'fromOlroxsQuartersToMarbleGallery',
            'fromOlroxsQuartersToRoyalChapel',
            'fromOlroxsQuartersToWarpRooms',
        ],
    },
    outerWall: {
        teleporterNames: [
            'fromOuterWallToClockTower',
            'fromOuterWallToLongLibrary',
            'fromOuterWallToMarbleGallery',
            'fromOuterWallToWarpRooms',
        ],
    },
    royalChapel: {
        teleporterNames: [
            'fromRoyalChapelToAlchemyLaboratory',
            'fromRoyalChapelToCastleKeep',
            'fromRoyalChapelToColosseum',
            'fromRoyalChapelToOlroxsQuarters',
        ],
    },
    undergroundCaverns: {
        teleporterNames: [
            'fromUndergroundCavernsToAbandonedMine',
            'fromUndergroundCavernsToCastleEntrance',
            'fromUndergroundCavernsToMarbleGallery',
        ],
    },
    warpRooms: {
        teleporterNames: [
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleEntrance',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ],
    },
}

function shuffle(rng, array) {
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(rng() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

const argv = yargs(process.argv.slice(2))
    .command({ // stage
        command: 'stage',
        describe: 'Shuffle connections between stages',
        builder: (yargs) => {
            return yargs
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                normalize: true,
            })
            .demandOption(['out'])
        },
        handler: (argv) => {
            const rng = seedrandom(argv.seed)
            let validInd = false
            let shuffleData
            while (!validInd) {
                shuffleData = {}
                let highlyLinkableStageNames = new Set()
                Object.entries(stages)
                    .filter(([stageName, stage]) => {
                        return stage.teleporterNames.length >= 3
                    })
                    .forEach(([stageName, stage]) => {
                        highlyLinkableStageNames.add(stageName)
                    })
                const warpRoomConnectedStages = shuffle(rng,
                    Array.from(highlyLinkableStageNames.values()).sort()
                ).slice(0, 5)
                const teleporterNamesLeft = new Set(Object.keys(teleporters))
                // TODO(sestren): Try to match every teleporter with a random valid other teleporter
                shuffleData.warpRoomConnectedStages = warpRoomConnectedStages
                validInd = true
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4));
        }
    })
    .demandCommand(1)
    .help()
    .parse()