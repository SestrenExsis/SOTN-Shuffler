import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

const teleporters = {
    fromAbandonedMineToCatacombs: {
        stage: 'abandonedMine',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromAbandonedMineToUndergroundCaverns: {
        stage: 'abandonedMine',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromAbandonedMineToWarpRooms: {
        stage: 'abandonedMine',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromAlchemyLaboratoryToCastleEntrance: {
        stage: 'alchemyLaboratory',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromAlchemyLaboratoryToMarbleGallery: {
        stage: 'alchemyLaboratory',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromAlchemyLaboratoryToRoyalChapel: {
        stage: 'alchemyLaboratory',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromCastleEntranceToAlchemyLaboratory: {
        stage: 'castleEntrance',
        direction: 'left',
        forbiddenConnections: new Set([
            // NOTE(sestren): Forbidden from leading to Warp Rooms
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleEntrance',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ]),
        // NOTE(sestren): Forbidden from leading to "dead end" stages
        minimumTargetLinkCount: 2,
    },
    fromCastleEntranceToMarbleGallery: {
        stage: 'castleEntrance',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromCastleEntranceToUndergroundCaverns: {
        stage: 'castleEntrance',
        direction: 'right',
        forbiddenConnections: new Set([
            // NOTE(sestren): Forbidden from being "orphaned" by one-way paths
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ]),
        minimumTargetLinkCount: 1,
    },
    fromCastleEntranceToWarpRooms: {
        stage: 'castleEntrance',
        direction: 'left',
        forbiddenConnections: new Set([
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
        ]),
        minimumTargetLinkCount: 1,
    },
    fromCastleKeepToClockTower: {
        stage: 'castleKeep',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromCastleKeepToRoyalChapel: {
        stage: 'castleKeep',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromCastleKeepToWarpRooms: {
        stage: 'castleKeep',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromCatacombsToAbandonedMine: {
        stage: 'catacombs',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromClockTowerToCastleKeep: {
        stage: 'clockTower',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromClockTowerToOuterWall: {
        stage: 'clockTower',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromColosseumToOlroxsQuarters: {
        stage: 'colosseum',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromColosseumToRoyalChapel: {
        stage: 'colosseum',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromLongLibraryToOuterWall: {
        stage: 'longLibrary',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromMarbleGalleryToAlchemyLaboratory: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromMarbleGalleryToCastleEntrance: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromMarbleGalleryToOlroxsQuarters: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromMarbleGalleryToOuterWall: {
        stage: 'marbleGallery',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromMarbleGalleryToUndergroundCaverns: {
        stage: 'marbleGallery',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOlroxsQuartersToColosseum: {
        stage: 'olroxsQuarters',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOlroxsQuartersToMarbleGallery: {
        stage: 'olroxsQuarters',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOlroxsQuartersToRoyalChapel: {
        stage: 'olroxsQuarters',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOlroxsQuartersToWarpRooms: {
        stage: 'olroxsQuarters',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOuterWallToClockTower: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOuterWallToLongLibrary: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOuterWallToMarbleGallery: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromOuterWallToWarpRooms: {
        stage: 'outerWall',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromRoyalChapelToAlchemyLaboratory: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromRoyalChapelToCastleKeep: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromRoyalChapelToColosseum: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromRoyalChapelToOlroxsQuarters: {
        stage: 'royalChapel',
        direction: 'right',
        forbiddenConnections: new Set([
            // NOTE(sestren): Forbidden from being "orphaned" by one-way paths
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ]),
        minimumTargetLinkCount: 1,
    },
    fromUndergroundCavernsToAbandonedMine: {
        stage: 'undergroundCaverns',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromUndergroundCavernsToCastleEntrance: {
        stage: 'undergroundCaverns',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromUndergroundCavernsToMarbleGallery: {
        stage: 'undergroundCaverns',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 1,
    },
    fromWarpRoomsToAbandonedMine: {
        stage: 'warpRooms',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 3,
    },
    fromWarpRoomsToCastleEntrance: {
        stage: 'warpRooms',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 3,
    },
    fromWarpRoomsToCastleKeep: {
        stage: 'warpRooms',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 3,
    },
    fromWarpRoomsToOlroxsQuarters: {
        stage: 'warpRooms',
        direction: 'left',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 3,
    },
    fromWarpRoomsToOuterWall: {
        stage: 'warpRooms',
        direction: 'right',
        forbiddenConnections: new Set(),
        minimumTargetLinkCount: 3,
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
                validInd = true
                shuffleData = {}
                // Try to match every teleporter with a random valid other teleporter
                const links = {}
                Object.keys(teleporters)
                    .forEach((teleporterName) => {
                        links[teleporterName] = null
                    })
                const linkedStages = {}
                Object.keys(stages)
                    .forEach((stageName) => {
                        linkedStages[stageName] = new Set()
                    })
                const teleporterNamesRemaining = new Set(Object.keys(teleporters))
                const work = new Set()
                work.add('fromCastleEntranceToAlchemyLaboratory')
                while (work.size > 0) {
                    const workRemaining = shuffle(rng, Array.from(work.values()).sort())
                    const sourceTeleporterName = workRemaining.at(0)
                    work.delete(sourceTeleporterName)
                    const sourceTeleporter = teleporters[sourceTeleporterName]
                    const possibleLinks = Object.keys(teleporters)
                        .filter((targetTeleporterName) => {
                            const targetTeleporter = teleporters[targetTeleporterName]
                            return (
                                teleporterNamesRemaining.has(targetTeleporterName) &&
                                stages[sourceTeleporter.stage].teleporterNames.length >= targetTeleporter.minimumTargetLinkCount &&
                                stages[targetTeleporter.stage].teleporterNames.length >= sourceTeleporter.minimumTargetLinkCount &&
                                sourceTeleporter.stage != targetTeleporter.stage &&
                                sourceTeleporter.direction != targetTeleporter.direction &&
                                !sourceTeleporter.forbiddenConnections.has(targetTeleporterName) &&
                                !targetTeleporter.forbiddenConnections.has(sourceTeleporterName) &&
                                !linkedStages[sourceTeleporter.stage].has(targetTeleporter.stage) &&
                                !linkedStages[targetTeleporter.stage].has(sourceTeleporter.stage)
                            )
                        })
                    if (possibleLinks.length < 1) {
                        validInd = false
                        break
                    }
                    const targetTeleporterName = shuffle(rng, possibleLinks.sort()).at(0)
                    const targetTeleporter = teleporters[targetTeleporterName]
                    links[targetTeleporterName] = sourceTeleporterName
                    links[sourceTeleporterName] = targetTeleporterName
                    linkedStages[sourceTeleporter.stage].add(targetTeleporter.stage)
                    linkedStages[targetTeleporter.stage].add(sourceTeleporter.stage)
                    teleporterNamesRemaining.delete(sourceTeleporterName)
                    teleporterNamesRemaining.delete(targetTeleporterName)
                    work.delete(sourceTeleporterName)
                    work.delete(targetTeleporterName)
                    teleporterNamesRemaining
                        .forEach((nextTeleporterName) => {
                            if (teleporters[nextTeleporterName].stage == targetTeleporter.stage) {
                                work.add(nextTeleporterName)
                            }
                        })
                }
                if (teleporterNamesRemaining.size > 0) {
                    console.log(teleporterNamesRemaining.size, Array.from(teleporterNamesRemaining).sort().at(0))
                    validInd = false
                }
                shuffleData.linkedStages = {}
                Object.entries(linkedStages)
                    .forEach(([stageName, stageLinks]) => {
                        shuffleData.linkedStages[stageName] = Array.from(stageLinks.values()).sort()
                    })
                shuffleData.links = links
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4));
        }
    })
    .demandCommand(1)
    .help()
    .parse()