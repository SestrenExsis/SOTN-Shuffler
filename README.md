# SOTN Shuffler

A tool for shuffling the locations of rooms in SOTN, in the form of change files. Intended to be used in conjunction with the [SOTN Patcher](https://github.com/SestrenExsis/SOTN-Patcher) tool, which turns those JSON files into patch (PPF) files.

## Current status of the project

This project is still actively in the prototyping phase of development. It almost definitely has bugs, will cause softlocks, and may even corrupt the game BIN in its current state. Use at your own risk.

While still in the prototyping and proof-of-concept phase, much of this project will be coded in Python. As the project matures, it may be translated to Javascript over time.

## Usage

Make a folder called `build` in the root directory of this repository.

Inside the `build` folder, make a folder called `patcher`.

Make a **COPY** of your target BIN (`SLUS-00067`) and place it inside the `build/patcher` folder. Make sure it is called `Castlevania - Symphony of the Night (Track 1).bin`.

From the root of the repository, run `git submodule update --init --recursive` to fetch the required SOTN-Patcher repo as a submodule.

Run the `setup.bat` script, which will generate the necessary extraction and randomly-generated map files for shuffling. It will also run validation checks against the generated map files. Be aware that this step can take several minutes to run.

Once the necessary files have been generated, running the `randomize.bat` script will go through the process of building a randomized PPF file. Be aware that this step can also take a few minutes to complete.

Once that step has completed, a file called `current-seed.ppf` will have been created inside the `build/patcher` folder. This file can be used in conjunction with [ppf.sotn.io](https://ppf.sotn.io/) to apply the changes to your BIN file.

## Acknowledgements

Most of the knowledge present in this project is only possible due to the immense efforts of the SOTN and rom-hacking community:

- Forat Negre, for their research into room layouts, which helped demystify a lot of how stages and rooms worked in this game
- [TalicZealot](https://github.com/taliczealot), for furthering knowledge about the game and making available tons of SOTN-related resources
- [MainMemory](https://github.com/MainMemory), for their [CastleEditor](https://github.com/MainMemory/SotNCastleEditor) project, which provided key insight into a few addresses as well as extremely helpful visualizations of the castle stages
- [Mottzilla](https://github.com/MottZilla), for their _StartAnywhere_ script, which dramatically improved turnaround time during playtesting
- Contributors and maintainers of the [SOTN-Decomp](https://github.com/Xeeynamo/sotn-decomp) project, including:
  - [Xeeynamo](https://github.com/Xeeynamo)
  - [Bismurphy](https://github.com/bismurphy)
  - [Sozud](https://github.com/sozud)
  - [Sonic Dreamcaster](https://github.com/sonicdcer)
- Contributors and maintainers of the [SOTN-Randomizer](https://github.com/3snowp7im/SotN-Randomizer) project, including:
  - [3snowp7im](https://github.com/3snowp7im) (Wild Mouse)
  - [Mottzilla](https://github.com/MottZilla)
  - [eldri7ch](https://github.com/eldri7ch2)
  - [LuciaRolon](https://github.com/LuciaRolon)
- The entire SOTN community, for their generosity and kindness