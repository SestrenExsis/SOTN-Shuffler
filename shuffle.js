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
    getTeleporterChanges,
    shuffleStages,
} from './src/shuffle-stages.js'

import {
    getDebugChanges,
} from './src/enable-debug.js'

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
            // Debugger options
            .option('debugger.on', {
                describe: 'Whether or not to enable debug mode; if disabled, all other options in this category are ignored',
                type: 'boolean',
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
            // Room normalizer options
            .option('roomNormalizer.on', {
                describe: 'Whether or not to normalize room connections in the game; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            // Solver options
            .option('solver.on', {
                describe: 'Whether or not to verify that all the other configurations result in a gameplay experience that should be completable; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            .option('solver.seed', {
                describe: 'If supplied, this seed is alway used for supplying randomness to the solver',
                type: 'string',
            })
            .option('solver.maxAttempts', {
                describe: 'The maximum number of attempts before the solver will give up',
                type: 'number',
                default: 1000000,
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
            if (argv.debugger.on) {
                shuffleData.settings.debugger = argv.debugger
            }
            if (argv.musicShuffler.on) {
                shuffleData.settings.musicShuffler = argv.musicShuffler
            }
            if (argv.stageShuffler.on) {
                shuffleData.settings.stageShuffler = argv.stageShuffler
            }
            if (argv.solver.on) {
                shuffleData.settings.solver = argv.solver
            }
            console.log('seedName:', seedName)
            // Apply all enabled modules
            if (argv.debugger.on) {
                const debugChanges = getDebugChanges()
                shuffleData.changes.push(debugChanges)
            }
            if (argv.musicShuffler.on) {
                const seed = argv.musicShuffler.seed ?? (seedName + '_musicShuffler')
                const shuffledSongs = shuffleSongs(seed)
                const songChanges = getSongChanges(extraction, shuffledSongs)
                shuffleData.changes.push(songChanges)
                shuffleData.debugInfo.finalSeedsUsed.musicShuffler = seed
            }
            // Some modules must be run inside a loop because the solver must verify 
            let solvable = false
            shuffleData.debugInfo.solverAttemptCount = 0
            let changesToAdd = []
            while (!solvable) {
                shuffleData.debugInfo.solverAttemptCount += 1
                changesToAdd = []
                if (argv.stageShuffler.on) {
                    const seed = argv.stageShuffler.seed ?? (seedName + '_stageShuffler_' + shuffleData.debugInfo.solverAttemptCount)
                    const shuffledStages = shuffleStages(seed)
                    const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
                    changesToAdd.push(teleporterChanges)
                    shuffleData.debugInfo.finalSeedsUsed.stageShuffler = seed
                }
                if (argv.solver.on) {
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
                if (shuffleData.debugInfo.solverAttemptCount > 1000000)  {
                    throw Error('Took too many attempts to solve, abandoning')
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
                    'Shuffle songs',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledSongs = shuffleSongs(seed)
            const songChanges = getSongChanges(extraction, shuffledSongs)
            shuffleData.changes.push(songChanges)
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4))
        }
    })
    .demandCommand(1)
    .help()
    .parse()