import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

import {
    shuffleArray
} from './common.js'

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
            // NOTE(sestren): The only available connection at the start of the game should not lead to a Warp
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleEntrance',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
        ]),
        // NOTE(sestren): The only available connection at the start of the game should not lead to a "dead end" stage
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
            // NOTE(sestren): Do not pair one-ways with initially-locked locations
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
            // NOTE(sestren): Do not pair one-ways with initially-locked locations
            'fromWarpRoomsToAbandonedMine',
            'fromWarpRoomsToCastleKeep',
            'fromWarpRoomsToOlroxsQuarters',
            'fromWarpRoomsToOuterWall',
            // NOTE(sestren): Do not require a Library Card to unlock an initially-locked location
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
            // NOTE(sestren): The source is a one-way path, so these connections would become "orphaned"
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

export function shuffleStages(seed) {
    const rng = seedrandom(seed)
    let validInd = false
    let result
    while (!validInd) {
        validInd = true
        result = {}
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
            const workRemaining = shuffleArray(rng, Array.from(work.values()).sort())
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
            const targetTeleporterName = shuffleArray(rng, possibleLinks.sort()).at(0)
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
            // console.log(teleporterNamesRemaining.size, Array.from(teleporterNamesRemaining).sort().at(0))
            validInd = false
        }
        result.linkedStages = {}
        Object.entries(linkedStages)
            .forEach(([stageName, stageLinks]) => {
                result.linkedStages[stageName] = Array.from(stageLinks.values()).sort()
            })
        result.links = links
    }
    return result
}

export function getTeleporterData(extraction, links) {
    const result = {}
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
                result[teleporterNameA] = {
                    'playerX=': teleporterB.playerX,
                    'playerY=': teleporterB.playerY,
                    'roomOffset=': teleporterB.roomOffset,
                    'targetStageId=': teleporterB.targetStageId,
                }
            })
        })
    return result
}
