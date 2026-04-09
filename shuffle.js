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
            // The rest of these options are listed alphabetically
            .option('debugger', {
                describe: 'Configuration for enabling debug features',
                type: 'object',
            })
            .option('musicShuffler', {
                describe: 'Configuration for shuffling in-game music',
                type: 'object',
            })
            .option('roomNormalizer', {
                describe: 'Configuration for normalizing room connections in the game',
                type: 'object',
            })
            .option('solver', {
                describe: 'Configuration for verifying that all the other configurations result in a gameplay experience that should be completable',
                type: 'object',
            })
            .option('stageShuffler', {
                describe: 'Configuration for shuffling the connections between stages (aka, teleporters)',
                type: 'object',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seedName = argv.seed
            if (!seedName) {
                const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                seedName = getSeedName(seed)
            }
            console.log('seedName:', seedName)
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [],
                description: [
                    'Shuffle various things',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            if (argv.debugger) {
                console.log('debugger:', argv.debugger)
                if (argv.debugger.on === 'true') {
                    const debugChanges = getDebugChanges()
                    shuffleData.changes.push(debugChanges)
                }
            }
            if (argv.musicShuffler) {
                console.log('musicShuffler:', argv.musicShuffler)
                if (argv.musicShuffler.on === 'true') {
                    const seed = (argv.musicShuffler.seed ?? seedName) + '_musicShuffler'
                    const shuffledSongs = shuffleSongs(seed)
                    const songChanges = getSongChanges(extraction, shuffledSongs)
                    shuffleData.changes.push(songChanges)
                }
            }
            let solvable = false
            let attemptCount = 0
            let changesToAdd = []
            while (!solvable) {
                attemptCount += 1
                changesToAdd = []
                if (argv.stageShuffler) {
                    console.log('stageShuffler:', argv.stageShuffler)
                    if (argv.stageShuffler.on === 'true') {
                        const seed = (argv.musicShuffler.seed ?? seedName) + '_stageShuffler_' + attemptCount
                        const shuffledStages = shuffleStages(seed)
                        const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
                        changesToAdd.push(teleporterChanges)
                    }
                }
                if (argv.solver) {
                    if (argv.solver.on === 'true') {
                        if ((10 * Math.random()) < attemptCount) {
                            solvable = true
                        }
                    }
                    else {
                        solvable = true
                    }
                }
                else {
                    solvable = true
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