import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

import {
    getSongChanges,
    shuffleSongs,
} from './src/shuffle-music.js'

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
            .option('music', {
                alias: 'm',
                describe: 'Whether or not to shuffle music',
                type: 'boolean',
            })
            .option('stages', {
                alias: 't',
                describe: 'Whether or not to shuffle the connections between stages (aka, teleporters',
                type: 'boolean',
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (seed === null || seed === '') {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const rng = seedrandom(seed)
            const seeds = {}
            // NOTE(sestren): All of the following seed values should all be called, regardless of whether they are used
            // NOTE(sestren): The order in which the following seed values are generated should not change
            seeds.music = Math.floor(rng() * Number.MAX_SAFE_INTEGER)
            seeds.stages = Math.floor(rng() * Number.MAX_SAFE_INTEGER)
            seeds.relics = Math.floor(rng() * Number.MAX_SAFE_INTEGER)
            // NOTE(sestren): If a new seed value needs to be added, it should be added here -- after all the others
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
            if (seed === null || seed === '') {
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
            if (seed === null || seed === '') {
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