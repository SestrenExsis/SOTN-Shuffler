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
            .option('debug', {
                alias: 'd',
                describe: 'Whether or not to enable debug mode',
                type: 'boolean',
            })
            .option('music', {
                alias: 'm',
                describe: 'Whether or not to shuffle music',
                type: 'boolean',
            })
            .option('normalize', {
                alias: 'n',
                describe: 'Whether or not to normalize room connections in the game',
                type: 'string',
            })
            .option('stages', {
                alias: 't',
                describe: 'Whether or not to shuffle the connections between stages (aka, teleporters)',
                type: 'boolean',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seedName = argv.seed
            if (!seedName) {
                const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                seedName = getSeedName(seed)
            }
            console.log(seedName)
            const rng = seedrandom(seedName)
            const seeds = {}
            // NOTE(sestren): The order in which the following seed values are generated should not change
            // NOTE(sestren): All of the following seed values should be called, even if they don't get used
            seeds.music = Math.floor(rng() * Number.MAX_SAFE_INTEGER)
            seeds.stages = Math.floor(rng() * Number.MAX_SAFE_INTEGER)
            seeds.relics = Math.floor(rng() * Number.MAX_SAFE_INTEGER)
            // NOTE(sestren): If a new seed value needs to be added, it should be added here at the end of the list
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
            if (argv.debug) {
                const debugChanges = getDebugChanges()
                shuffleData.changes.push(debugChanges)
            }
            if (argv.music) {
                const shuffledSongs = shuffleSongs(seeds.music)
                const songChanges = getSongChanges(extraction, shuffledSongs)
                shuffleData.changes.push(songChanges)
            }
            if (argv.stages) {
                const shuffledStages = shuffleStages(seeds.stages)
                const teleporterChanges = getTeleporterChanges(extraction, shuffledStages.links)
                shuffleData.changes.push(teleporterChanges)
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4));
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
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4));
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
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4));
        }
    })
    .demandCommand(1)
    .help()
    .parse()