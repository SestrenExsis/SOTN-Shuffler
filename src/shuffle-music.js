import seedrandom from 'seedrandom'

import {
    shuffleArray
} from './common.js'

const songs = {
    abandonedMine: {
        stage: {
            defaultValue: 'abandonedPit',
            keys: [
                'overlays.abandonedMine.musicId',
                'stages.bossCerberus.constants.music.stage.data',
            ],
        },
        bossCerberus: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossCerberus.constants.music.boss.data',
            ],
        },
    },
    alchemyLaboratory: {
        stage: {
            defaultValue: 'danceOfGold',
            keys: [
                'overlays.alchemyLaboratory.musicId',
                'stages.alchemyLaboratory.constants.music.afterSlograAndGaibon.data',
                'stages.alchemyLaboratory.constants.music.afterSlograAndGaibon2.data',
            ],
        },
        bossSlograAndGaibon: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.alchemyLaboratory.constants.music.boss.data',
            ],
        },
    },
    antiChapel: {
        stage: {
            defaultValue: 'lostPainting',
            keys: [
                'overlays.antiChapel.musicId',
                'stages.bossMedusa.constants.music.stage.data',
                'stages.bossMedusa.constants.music.stage2.data',
            ],
        },
        bossMedusa: {
            defaultValue: 'enchantedBanquet',
            keys: [
                'stages.bossMedusa.constants.music.boss.data',
            ],
        },
    },
    blackMarbleGallery: {
        stage: {
            defaultValue: 'finaleToccata',
            keys: [
                'overlays.blackMarbleGallery.musicId',
            ],
        },
    },
    castleCenter: {
        stage: {
            defaultValue: 'theDoorToTheAbyss',
            keys: [
                'overlays.castleCenter.musicId',
            ],
        },
    },
    castleEntrance: {
        stage: {
            defaultValue: 'draculasCastle',
            keys: [
                'overlays.castleEntrance.musicId',
                'overlays.castleEntranceRevisited.musicId',
                'stages.castleEntrance.constants.music.afterCastleAwakes.data',
                'stages.castleEntrance.constants.music.afterMeetingDeath.data',
            ],
        },
        ambienceInForestCutscene: {
            defaultValue: 'howlingWind',
            keys: [
                'ambienceInForestCutscene.data',
            ],
        },
    },
    castleKeep: {
        stage: {
            defaultValue: 'heavenlyDoorway',
            keys: [
                'overlays.castleKeep.musicId',
            ],
        },
    },
    catacombs: {
        stage: {
            defaultValue: 'rainbowCemetary',
            keys: [
                'overlays.catacombs.musicId',
                'stages.catacombs.constants.music.stage.data',
            ],
        },
        bossGranfaloon: {
            defaultValue: 'deathBallad',
            keys: [
                'overlays.bossGranfaloon.musicId',
                'stages.catacombs.constants.music.boss.data',
                'stages.catacombs.constants.music.boss2.data',
            ],
        },
    },
    cave: {
        stage: {
            defaultValue: 'abandonedPit',
            keys: [
                'overlays.cave.musicId',
                'stages.cave.constants.music.stage.data',
            ],
        },
        bossDeath: {
            defaultValue: 'deathBallad',
            keys: [
                'overlays.bossDeath.musicId',
                'stages.cave.constants.music.boss.data',
            ],
        },
    },
    clockTower: {
        stage: {
            defaultValue: 'theTragicPrince',
            keys: [
                'overlays.clockTower.musicId',
                'stages.clockTower.constants.music.stage.data',
                'stages.clockTower.constants.music.stage2.data',
            ],
        },
        bossKarasuman: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.clockTower.constants.music.boss.data',
            ],
        },
    },
    colosseum: {
        stage: {
            defaultValue: 'wanderingGhosts',
            keys: [
                'overlays.colosseum.musicId',
                'stages.bossMinotaurAndWerewolf.constants.music.stage.data',
            ],
        },
        bossMinotaurAndWerewolf: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossMinotaurAndWerewolf.constants.music.boss.data',
            ],
        },
    },
    deathWingsLair: {
        stage: {
            defaultValue: 'finaleToccata',
            keys: [
                'overlays.deathWingsLair.musicId',
                'stages.bossAkmodanII.constants.music.stage.data',
                'stages.bossAkmodanII.constants.music.stage2.data',
            ],
        },
        bossAkmodanII: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossAkmodanII.constants.music.boss.data',
            ],
        },
    },
    forbiddenLibrary: {
        stage: {
            defaultValue: 'lostPainting',
            keys: [
                'overlays.forbiddenLibrary.musicId',
            ],
        },
    },
    floatingCatacombs: {
        stage: {
            defaultValue: 'curseZone',
            keys: [
                'overlays.floatingCatacombs.musicId',
                'stages.bossGalamoth.constants.music.stage.data',
                'stages.bossGalamoth.constants.music.stage2.data',
            ],
        },
        bossGalamoth: {
            defaultValue: 'deathBallad',
            keys: [
                'stages.bossGalamoth.constants.music.boss.data',
            ],
        },
    },
    longLibrary: {
        stage: {
            defaultValue: 'woodCarvingPartita',
            keys: [
                'overlays.longLibrary.musicId',
                'stages.longLibrary.constants.music.stage.data',
                'stages.longLibrary.constants.music.stage2.data',
            ],
        },
        bossLesserDemon: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.longLibrary.constants.music.boss.data',
            ],
        },
    },
    marbleGallery: {
        stage: {
            defaultValue: 'marbleGallery',
            keys: [
                'overlays.marbleGallery.musicId',
            ],
        },
    },
    necromancyLaboratory: {
        stage: {
            defaultValue: 'finaleToccata',
            keys: [
                'overlays.necromancyLaboratory.musicId',
                'stages.bossBeelzebub.constants.music.stage.data',
                'stages.bossBeelzebub.constants.music.stage2.data',
            ],
        },
        bossBeelzebub: {
            defaultValue: 'deathBallad',
            keys: [
                'stages.bossBeelzebub.constants.music.boss.data',
                'stages.bossBeelzebub.constants.music.boss2.data',
            ],
        },
    },
    outerWall: {
        stage: {
            defaultValue: 'towerOfMist',
            keys: [
                'overlays.outerWall.musicId',
                'stages.bossDoppelganger10.constants.music.stage.data',
            ],
        },
        bossDoppelganger10: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossDoppelganger10.constants.music.boss.data',
            ],
        },
    },
    olroxsQuarters: {
        stage: {
            defaultValue: 'danceOfPales',
            keys: [
                'overlays.olroxsQuarters.musicId',
                'stages.bossOlrox.constants.music.stage.data',
            ],
        },
        bossOlrox: {
            defaultValue: 'deathBallad',
            keys: [
                'stages.bossOlrox.constants.music.boss.data',
                'stages.bossOlrox.constants.music.boss2.data',
                'stages.bossOlrox.constants.music.boss3.data',
                'stages.bossOlrox.constants.music.boss4.data',
            ],
        },
    },
    prologue: {
        bossDracula: {
            defaultValue: 'prologue',
            keys: [
                'overlays.prologue.musicId',
            ],
        },
    },
    reverseCastleCenter: {
        stage: {
            defaultValue: 'theDoorToTheAbyss',
            keys: [
                'overlays.reverseCastleCenter.musicId',
            ],
        },
        bossShaft: {
            defaultValue: 'deathBallad',
            keys: [
                'stages.reverseCastleCenter.constants.music.boss.data',
            ],
        },
    },
    reverseKeep: {
        stage: {
            defaultValue: 'heavenlyDoorway',
            keys: [
                'overlays.reverseKeep.musicId',
            ],
        },
    },
    reverseCastleEntrance: {
        stage: {
            defaultValue: 'finaleToccata',
            keys: [
                'overlays.reverseCastleEntrance.musicId',
            ],
        },
    },
    reverseCaverns: {
        stage: {
            defaultValue: 'lostPainting',
            keys: [
                'overlays.reverseCaverns.musicId',
            ],
        },
        bossDoppelganger40: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossDoppelganger40.constants.music.boss.data',
            ],
        },
    },
    reverseClockTower: {
        stage: {
            defaultValue: 'finaleToccata',
            keys: [
                'overlays.reverseClockTower.musicId',
                'stages.reverseClockTower.constants.music.stage.data',
                'stages.reverseClockTower.constants.music.stage2.data',
            ],
        },
        bossDarkwingBat: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.reverseClockTower.constants.music.boss.data',
            ],
        },
    },
    reverseColosseum: {
        stage: {
            defaultValue: 'doorOfHolySpirits',
            keys: [
                'overlays.reverseColosseum.musicId',
                'stages.bossTrio.constants.music.stage.data',
                'stages.bossTrio.constants.music.stage2.data',
            ],
        },
        bossTrio: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossTrio.constants.music.boss.data',
            ],
        },
    },
    reverseOuterWall: {
        stage: {
            defaultValue: 'finaleToccata',
            keys: [
                'overlays.reverseOuterWall.musicId',
                'stages.bossCreature.constants.music.stage.data',
                'stages.bossCreature.constants.music.stage2.data',
            ],
        },
        bossCreature: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossCreature.constants.music.boss.data',
            ],
        },
    },
    reverseWarpRooms: {
        stage: {
            defaultValue: 'noAudio',
            keys: [
                'overlays.reverseWarpRooms.musicId',
            ],
        },
    },
    royalChapel: {
        stage: {
            defaultValue: 'requiemForTheGods',
            keys: [
                'overlays.royalChapel.musicId',
            ],
        },
        bossHippogryph: {
            defaultValue: 'deathBallad',
            keys: [
                'stages.bossHippogryph.constants.music.boss.data',
            ],
        },
    },
    undergroundCaverns: {
        stage: {
            defaultValue: 'crystalTeardrops',
            keys: [
                'overlays.undergroundCaverns.musicId',
                'stages.bossScylla.constants.music.stage.data',
                'stages.bossScylla.constants.music.stage2.data',
                'stages.bossScylla.constants.music.stage3.data',
            ],
        },
        bossScylla: {
            defaultValue: 'festivalOfServants',
            keys: [
                'stages.bossScylla.constants.music.boss.data',
            ],
        },
        bossSuccubus: {
            defaultValue: 'enchantedBanquet',
            keys: [
                'stages.bossSuccubus.constants.music.boss.data',
            ],
        },
    },
    warpRooms: {
        stage: {
            defaultValue: 'noAudio',
            keys: [
                'overlays.warpRooms.musicId',
            ],
        },
    },
}

export function shuffleSongs(seed) {
    const rng = seedrandom(seed)
    const stageMusic = {}
    const stageSongs = []
    const songPools = {
        stage: [],
        boss: [],
    }
    const bossMusic = {}
    Object.entries(songs)
        .forEach(([stageName, songsInfo]) => {
            // Add stage music to its own pool
            Object.entries(songsInfo)
                .filter(([songName, songInfo]) => {
                    return songName.startsWith('stage')
                })
                .filter(([songName, songInfo]) => {
                    return songInfo.defaultValue !== 'noAudio'
                })
                .forEach(([songName, songInfo]) => {
                    stageMusic[stageName] = songInfo.defaultValue
                    if (!songPools.stage.includes(songInfo.defaultValue)) {
                        songPools.stage.push(songInfo.defaultValue)
                    }
                })
            // Add boss music to its own pool, do nothing with it for now ...
            Object.entries(songsInfo)
                .filter(([songName, songInfo]) => {
                    return songName.startsWith('boss')
                })
                .forEach(([songName, songInfo]) => {
                    bossMusic[songName] = songInfo.defaultValue
                })
        })
    const songsNeeded = Object.keys(stageMusic).length - songPools.stage.length
    const duplicateSongPool = shuffleArray(rng, songPools.stage).slice(0, songsNeeded)
    const fullSongPool = shuffleArray(rng, songPools.stage.concat(duplicateSongPool))
    Object.keys(stageMusic).toSorted()
        .forEach((stageName) => {
            stageMusic[stageName] = fullSongPool.pop()
        })
    const result = {}
    result.stage = stageMusic
    return result
}

export function getSongChanges(extraction, songData) {
    const songChanges = {}
    Object.entries(songData.stage)
        .forEach(([stageName, songName]) => {
            songs[stageName].stage.keys.forEach((keyName) => {
                songChanges[keyName + '='] = songName
            })
        })
    const result = {
        changeType: 'merge',
        merge: songChanges,
    }
    return result
}
