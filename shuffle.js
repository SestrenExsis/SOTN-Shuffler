import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

import {
    arrangeStages,
} from './src/common.js'

import {
    getSeedName,
} from './src/generate-words.js'

import {
    getSongChanges,
    shuffleSongs,
} from './src/shuffle-music.js'

import {
    combineNodeGroups,
    getRoomChanges,
    mapPixels,
    nodeGroups,
    shuffleRooms,
} from './src/shuffle-rooms.js'

import {
    getTeleporterChanges,
    getVanillaStageLinks,
    shuffleStages,
} from './src/shuffle-stages.js'

// TODO(sestren): Generate a hash of options used to serve as a shorthand to help in quickly verifying if a set of options has changed

// NOTE(sestren): Proposed order of operations:
//   - Shuffle the rooms within each stage
//   - Shuffle the stage connections
//   - Assign warp rooms to the stage they connect to
//   - Arrange stages on the map

const MIN_MAP_ROW = 5

const argv = yargs(process.argv.slice(2))
    .command({ // multi
        command: 'multi',
        describe: 'Combine multiple randomization options into one patch',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
        // Music shuffler options
            .option('musicShuffler.on', {
                describe: 'Whether or not to enable shuffling of in-game music; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            .option('musicShuffler.seed', {
                describe: 'If supplied, this seed is alway used for supplying randomness to the music shuffler',
                type: 'string',
            })
        // Patcher options
            // IDEA(sestren): Add ability to specify relative or absolute filepath
            // IDEA(sestren): Add ability to specify shallow or deep copy of patch
            .option('patcher.on', {
                describe: 'Whether or not to apply the given list of patches',
                type: 'boolean',
            })
            .option('patcher.list', {
                describe: 'A list of filepaths of patches to apply, in order',
                type: 'array',
            })
        // Solver options
            .option('solver.on', {
                describe: 'Whether or not to verify that all the other configurations result in a gameplay experience that should be completable; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            .option('solver.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the solver',
                type: 'string',
            })
            .option('solver.maxAttempts', {
                describe: 'The maximum number of attempts before the solver will give up',
                type: 'number',
                default: 1000000,
            })
        // Room shuffler options
            .option('roomShuffler.on', {
                describe: 'Whether or not to shuffle how rooms within a stage connect. If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('roomShuffler.seed', {
                describe: 'If supplied, this seed is alway used for supplying randomness to the room shuffler',
                type: 'string',
            })
        // Stage shuffler options
            .option('stageShuffler.on', {
                describe: 'Whether or not to shuffle the connections between stages (aka, teleporters). If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('stageShuffler.seed', {
                describe: 'If supplied, this seed is alway used for supplying randomness to the stage shuffler',
                type: 'string',
            })
        // The following options must be declared
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            // TODO(sestren): Add ability to turn room and stage-shuffling on or off independently of one another
            console.log(argv)
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                debugInfo: {
                    finalSeedsUsed: {},
                },
                description: [
                    'Shuffle various things',
                ],
                settings: {},
            }
            // Translate arguments into settings
            let seedName = argv.seed
            if (seedName) {
                shuffleData.settings.seedName = argv.seed
            }
            else {
                const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                seedName = getSeedName(seed)
            }
            shuffleData.debugInfo.seedName = seedName
            if (argv.musicShuffler?.on) {
                shuffleData.settings.musicShuffler = argv.musicShuffler
            }
            if (argv.patcher?.on) {
                shuffleData.settings.patcher = argv.patcher
            }
            if (argv.roomShuffler?.on) {
                shuffleData.settings.roomShuffler = argv.roomShuffler
            }
            if (argv.stageShuffler?.on) {
                shuffleData.settings.stageShuffler = argv.stageShuffler
            }
            if (argv.solver?.on) {
                shuffleData.settings.solver = argv.solver
            }
            // Apply all enabled modules
            console.log('seedName:', seedName)
            // Patcher
            if (argv.patcher.on) {
                const patches = argv.patcher.list ?? []
                for (let i = 0; i < patches.length; i++) {
                    const patch = JSON.parse(fs.readFileSync(patches.at(i), 'utf8'))
                    for (let j = 0; j < patch.authors.length; j++) {
                        const element = patch.authors[j]
                        if (!shuffleData.authors.includes(element)) {
                            shuffleData.authors.push(element)
                        }
                    }
                    for (let j = 0; j < patch.description.length; j++) {
                        shuffleData.description.push(patch.description[j])
                    }
                    for (let j = 0; j < patch.changes.length; j++) {
                        shuffleData.changes.push(patch.changes[j])
                    }
                }
            }
            if (argv.musicShuffler?.on) {
                const seed = argv.musicShuffler.seed ?? (seedName + '_musicShuffler')
                const shuffledSongs = shuffleSongs(seed)
                const songChanges = getSongChanges(shuffledSongs)
                shuffleData.changes.push(songChanges)
                shuffleData.debugInfo.finalSeedsUsed.musicShuffler = seed
            }
            shuffleData.debugInfo.solverAttemptCount = 0
            let changesToAdd = []
            let stageConnections = getVanillaStageLinks()
            let roomArrangements = {}
            // Some modules (those that modify or depend on logic) must be run inside a loop because the solver must verify them
            let solvable = false
            while (!solvable) {
                shuffleData.debugInfo.solverAttemptCount += 1
                console.log('solverAttemptCount:', shuffleData.debugInfo.solverAttemptCount)
                changesToAdd = []
                if (argv.stageShuffler?.on) {
                    const seed = argv.stageShuffler.seed ?? (seedName + '_stageShuffler_' + shuffleData.debugInfo.solverAttemptCount)
                    stageConnections = shuffleStages(seed)
                    const teleporterChanges = getTeleporterChanges(extraction, stageConnections.links)
                    changesToAdd.push(teleporterChanges)
                    shuffleData.debugInfo.finalSeedsUsed.stageShuffler = seed
                }
                if (argv.roomShuffler?.on) {
                    const seed = argv.roomShuffler.seed ?? (seedName + '_roomShuffler_' + shuffleData.debugInfo.solverAttemptCount)
                    const stageNodeGroups = {
                        abandonedMine: shuffleRooms(seed + '_abandonedMine', 'abandonedMine', true),
                        alchemyLaboratory: shuffleRooms(seed + '_alchemyLaboratory', 'alchemyLaboratory', true),
                        castleEntrance: shuffleRooms(seed + '_castleEntrance', 'castleEntrance', true),
                        castleKeep: shuffleRooms(seed + '_castleKeep', 'castleKeep', true),
                        catacombs: shuffleRooms(seed + '_catacombs', 'catacombs', true),
                        clockTower: shuffleRooms(seed + '_clockTower', 'clockTower', true),
                        colosseum: shuffleRooms(seed + '_colosseum', 'colosseum', true),
                        longLibrary: shuffleRooms(seed + '_longLibrary', 'longLibrary', true),
                        marbleGallery: shuffleRooms(seed + '_marbleGallery', 'marbleGallery', true),
                        olroxsQuarters: shuffleRooms(seed + '_olroxsQuarters', 'olroxsQuarters', true),
                        outerWall: shuffleRooms(seed + '_outerWall', 'outerWall', true),
                        royalChapel: shuffleRooms(seed + '_royalChapel', 'royalChapel', true),
                        undergroundCaverns: shuffleRooms(seed + '_undergroundCaverns', 'undergroundCaverns', true),
                    }
                    // Attach warpRooms to the stages they lead to
                    Object.entries(stageConnections.links)
                        .filter(([teleporterSource, teleporterTarget]) => {
                            return teleporterSource.startsWith('fromWarpRoomsTo')
                        })
                        .forEach(([teleporterSource, teleporterTarget]) => {
                            // NOTE(sestren): This hack is to avoid matching the 'To' between stage names with the 'To' in ClockTower
                            const parts = teleporterTarget.replace('ClockTower', 'CLOCKTOWER').split('To')
                            const firstPart = parts.at(0).replace('CLOCKTOWER', 'ClockTower').slice(4)
                            const stageName = firstPart.at(0).toLowerCase() + firstPart.slice(1)
                            const roomName = 'loadingRoomTo' + parts.at(1).replace('CLOCKTOWER', 'ClockTower')
                            // NOTE(sestren): Centering on the loading room is a reliable way to match the rooms without having to know the direction
                            let matchingRoomCount = 0
                            stageNodeGroups[stageName].rooms
                                .filter((roomInfo) => {
                                    return (roomInfo.stage === stageName) && (roomInfo.room === roomName)
                                })
                                .forEach((roomInfo) => {
                                    matchingRoomCount += 1
                                    const rowOffset = roomInfo.row
                                    const columnOffset = roomInfo.column - 1
                                    const warpRoomGroupName = 'warpRoomTo' + teleporterSource.split('WarpRoomsTo').at(1)
                                    const warpRoomGroup = nodeGroups.warpRooms[warpRoomGroupName]
                                    stageNodeGroups[stageName] = combineNodeGroups(stageNodeGroups[stageName], warpRoomGroup, rowOffset, columnOffset, { allowOverlaps: true })
                                })
                            if (matchingRoomCount < 1)  {
                                throw Error(`Room not found for stage '${stageName}' and room '${roomName}'`)
                            }
                        })
                    roomArrangements = arrangeStages(seed + '_stageArranger', stageNodeGroups)
                    const roomChanges = getRoomChanges(roomArrangements.rooms, MIN_MAP_ROW, 0)
                    changesToAdd.push(roomChanges)
                    shuffleData.debugInfo.finalSeedsUsed.roomShuffler = seed
                }
                if (argv.solver?.on) {
                    // NOTE(sestren): For now, the solver is only randomly accepting or rejecting; to be replaced with an actual solver at a later date
                    shuffleData.debugInfo.solvable = false
                    const seed = argv.solver.seed ?? (seedName + '_solver_' + shuffleData.debugInfo.solverAttemptCount)
                    const rng = seedrandom(seed)
                    if ((10 * rng()) < shuffleData.debugInfo.solverAttemptCount) {
                        solvable = true
                        shuffleData.debugInfo.solvable = true
                    }
                    shuffleData.debugInfo.finalSeedsUsed.solver = seed
                }
                else {
                    solvable = true
                }
                if (shuffleData.debugInfo.solverAttemptCount > argv.solver.maxAttempts)  {
                    console.log('Took too many attempts to solve, abandoning ...')
                    break
                }
            }
            // TODO(sestren): Redraw map
            const mapGrid = []
            for (let row = 0; row < 256; row++) {
                const rowData = '0'.repeat(256)
                mapGrid.push(rowData)
            }
            roomArrangements.rooms.forEach((roomInfo) => {
                if (
                    !(
                        (roomInfo.stage in mapPixels) &&
                        (roomInfo.room in mapPixels[roomInfo.stage])
                    )
                )
                {
                    return
                }
                mapPixels[roomInfo.stage][roomInfo.room]
                    .forEach((fillData) => {
                        switch (fillData.command) {
                            case 'fillRect':
                                const MIN_MAP_COL = 0
                                const pixelRow = 4 * (MIN_MAP_ROW + roomInfo.row) + fillData.parameters.top
                                const pixelColumn = 4 * (MIN_MAP_COL + roomInfo.column) + fillData.parameters.left
                                for (let rowOffset = 0; rowOffset < fillData.parameters.rows; rowOffset++) {
                                    const leftSide = mapGrid.at(pixelRow + rowOffset).slice(0, pixelColumn)
                                    const rightSide = mapGrid.at(pixelRow + rowOffset).slice(pixelColumn + fillData.parameters.columns)
                                    mapGrid[pixelRow + rowOffset] = leftSide + fillData.parameters.colorIndex.repeat(fillData.parameters.columns) + rightSide
                                }
                                break
                            default:
                                console.log(`WARNING: Unknown value for command property: ${fillData.command}`)
                                break
                        }
                    })
            })
            const mapChanges = {
                changeType: 'merge',
                merge: {
                    'castleMap.data=': mapGrid,
                },
            }
            changesToAdd.push(mapChanges)
            for (let index = 0; index < changesToAdd.length; index++) {
                shuffleData.changes.push(changesToAdd.at(index))
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // map
        command: 'map',
        describe: 'Customize castle map',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            // TODO(sestren): Add ability to turn room and stage-shuffling on or off independently of one another
            // .option('shuffleRooms', {
            //     describe: 'Whether or not to shuffle how rooms within a stage connect',
            //     type: 'boolean',
            // })
            // .option('shuffleStages', {
            //     describe: 'Whether or not to shuffle the connections between stages (aka, teleporters)',
            //     type: 'boolean',
            // })
            .demandOption(['extraction'])
        },
        handler: (argv) => {
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            let seedName
            if (argv.seed) {
                seedName = argv.seed
            }
            else {
                const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                seedName = getSeedName(seed)
            }
            const stageNodeGroups = {
                abandonedMine: shuffleRooms(seedName + '_abandonedMine', 'abandonedMine', true),
                alchemyLaboratory: shuffleRooms(seedName + '_alchemyLaboratory', 'alchemyLaboratory', true),
                castleEntrance: shuffleRooms(seedName + '_castleEntrance', 'castleEntrance', true),
                castleKeep: shuffleRooms(seedName + '_castleKeep', 'castleKeep', true),
                catacombs: shuffleRooms(seedName + '_catacombs', 'catacombs', true),
                clockTower: shuffleRooms(seedName + '_clockTower', 'clockTower', true),
                colosseum: shuffleRooms(seedName + '_colosseum', 'colosseum', true),
                longLibrary: shuffleRooms(seedName + '_longLibrary', 'longLibrary', true),
                marbleGallery: shuffleRooms(seedName + '_marbleGallery', 'marbleGallery', true),
                olroxsQuarters: shuffleRooms(seedName + '_olroxsQuarters', 'olroxsQuarters', true),
                outerWall: shuffleRooms(seedName + '_outerWall', 'outerWall', true),
                royalChapel: shuffleRooms(seedName + '_royalChapel', 'royalChapel', true),
                undergroundCaverns: shuffleRooms(seedName + '_undergroundCaverns', 'undergroundCaverns', true),
            }
            const shuffledStages = shuffleStages(seedName + '_stageShuffler')
            // Attach warpRooms to the stages they lead to
            Object.entries(shuffledStages.links)
                .filter(([teleporterSource, teleporterTarget]) => {
                    return teleporterSource.startsWith('fromWarpRoomsTo')
                })
                .forEach(([teleporterSource, teleporterTarget]) => {
                    // NOTE(sestren): This hack is to avoid matching the 'To' between stage names with the 'To' in ClockTower
                    const parts = teleporterTarget.replace('ClockTower', 'CLOCKTOWER').split('To')
                    const firstPart = parts.at(0).replace('CLOCKTOWER', 'ClockTower').slice(4)
                    const stageName = firstPart.at(0).toLowerCase() + firstPart.slice(1)
                    const roomName = 'loadingRoomTo' + parts.at(1).replace('CLOCKTOWER', 'ClockTower')
                    // NOTE(sestren): Centering on the loading room is a reliable way to match the rooms without having to know the direction
                    let matchingRoomCount = 0
                    stageNodeGroups[stageName].rooms
                        .filter((roomInfo) => {
                            return (roomInfo.stage === stageName) && (roomInfo.room === roomName)
                        })
                        .forEach((roomInfo) => {
                            matchingRoomCount += 1
                            const rowOffset = roomInfo.row
                            const columnOffset = roomInfo.column - 1
                            const warpRoomGroupName = 'warpRoomTo' + teleporterSource.split('WarpRoomsTo').at(1)
                            const warpRoomGroup = nodeGroups.warpRooms[warpRoomGroupName]
                            stageNodeGroups[stageName] = combineNodeGroups(stageNodeGroups[stageName], warpRoomGroup, rowOffset, columnOffset, { allowOverlaps: true })
                        })
                    if (matchingRoomCount < 1)  {
                        throw Error(`Room not found for stage '${stageName}' and room '${roomName}'`)
                    }
                })
            const stageArrangements = arrangeStages(seedName + '_stageArranger', stageNodeGroups)
            console.log(stageArrangements)
            const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
            // TODO(sestren): Redraw castle map
            // TODO(sestren): Populate changes
            // changesToAdd.push(teleporterChanges)
        }
    })
    .command({ // seed
        command: 'seed',
        describe: 'Generate random seed name',
        builder: (yargs) => {
            return yargs
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .demandOption([])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const seedName = getSeedName(seed)
            console.log(seedName)
        }
    })
    .command({ // room
        command: 'room',
        describe: 'Shuffle rooms within stages',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .option('stage', {
                describe: 'Name of stage to shuffle rooms in',
                type: 'string',
            })
            .option('norm', {
                describe: 'Whether or not to apply normalization to room connections before shuffling',
                type: 'boolean',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle rooms',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledRooms = shuffleRooms(seed, argv.stage, argv.norm)
            console.log('shuffledRooms:', shuffledRooms)
            // const roomChanges = getRoomChanges(extraction, shuffledRooms.rooms, 16, 16)
            // shuffleData.changes.push(roomChanges)
            // fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // stage
        command: 'stage',
        describe: 'Shuffle connections between stages',
        builder: (yargs) => {
            return yargs
            .option('extraction', {
                alias: 'e',
                describe: 'Path to the aliased extraction file',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                alias: 'o',
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle teleporters',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledStages = shuffleStages(seed)
            const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
            shuffleData.changes.push(teleporterChanges)
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .command({ // music
        command: 'music',
        describe: 'Shuffle music',
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
                type: 'string',
            })
            .demandOption(['out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (!seed) {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle songs',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const shuffledSongs = shuffleSongs(seed)
            const songChanges = getSongChanges(shuffledSongs)
            shuffleData.changes.push(songChanges)
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .demandCommand(1)
    .help()
    .parse()