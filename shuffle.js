import fs from 'fs'
import seedrandom from 'seedrandom'
import yargs from 'yargs'

import {
    getSongData,
    shuffleSongs,
} from './src/shuffle-music.js'

import {
    getTeleporterData,
    shuffleStages,
} from './src/shuffle-stages.js'

const argv = yargs(process.argv.slice(2))
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
                normalize: true,
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (seed === null || seed === '') {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledStages = shuffleStages(seed)
            const teleporterData = getTeleporterData(extraction, shuffledStages.links)
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [
                    {
                        changeType: 'merge',
                        merge: {
                            teleporters: teleporterData,
                        },
                    },
                ],
                description: [
                    'Shuffle teleporters',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
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
                normalize: true,
            })
            .demandOption(['extraction', 'out'])
        },
        handler: (argv) => {
            let seed = argv.seed
            if (seed === null || seed === '') {
                seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }
            const extraction = JSON.parse(fs.readFileSync(argv.extraction, 'utf8'))
            const shuffledSongs = shuffleSongs(seed)
            const songData = getSongData(extraction, shuffledSongs)
            const shuffleData = {
                authors: [
                    'Sestren',
                ],
                changes: [
                    {
                        changeType: 'merge',
                        merge: songData,
                    },
                ],
                description: [
                    'Shuffle songs',
                ],
                settings: {
                    seed: argv.seed,
                },
            }
            fs.writeFileSync(argv.out, JSON.stringify(shuffleData, null, 4));
        }
    })
    .demandCommand(1)
    .help()
    .parse()