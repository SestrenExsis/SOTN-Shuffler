import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

import {
    getSeedName,
} from './src/generate-words.js'

import {
    getSongChanges,
    shuffleSongs,
} from './src/shuffle-music.js'

import {
    getRoomChanges,
    shuffleRooms,
} from './src/shuffle-rooms.js'

import {
    getTeleporterChanges,
    shuffleStages,
} from './src/shuffle-stages.js'

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
            if (shuffleData.settings.seedName) {
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
            // Some modules (those that modify or depend on logic) must be run inside a loop because the solver must verify them
            let solvable = false
            shuffleData.debugInfo.solverAttemptCount = 0
            let changesToAdd = []
            while (!solvable) {
                shuffleData.debugInfo.solverAttemptCount += 1
                changesToAdd = []
                if (argv.stageShuffler?.on) {
                    const seed = argv.stageShuffler.seed ?? (seedName + '_stageShuffler_' + shuffleData.debugInfo.solverAttemptCount)
                    const shuffledStages = shuffleStages(seed)
                    const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
                    changesToAdd.push(teleporterChanges)
                    shuffleData.debugInfo.finalSeedsUsed.stageShuffler = seed
                }
                if (argv.roomShuffler?.on) {
                    const seed = argv.roomShuffler.seed ?? (seedName + '_roomShuffler_' + shuffleData.debugInfo.solverAttemptCount)
                    // abandonedMine
                    // alchemyLaboratory
                    const shuffledRooms = shuffleRooms(seed, stageName, applyNormalization)
                    const roomChanges = getRoomChanges(shuffledRooms.rooms, rowOffset, columnOffset)
                    changesToAdd.push(roomChanges)
                    shuffleData.debugInfo.finalSeedsUsed.roomShuffler = seed
                }
                if (argv.solver?.on) {
                    // For now, the solver is only randomly accepting or rejecting; to be replaced with an actual solver at a later date
                    shuffleData.debugInfo.solvable = false
                    const seed = argv.solver.seed ?? (seedName + '_solver_' + shuffleData.debugInfo.solverAttemptCount)
                    const rng = seedrandom(seed)
                    if ((1000 * rng()) < shuffleData.debugInfo.solverAttemptCount) {
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
            for (let index = 0; index < changesToAdd.length; index++) {
                shuffleData.changes.push(changesToAdd.at(index))
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
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