date
node shuffle multi -e "build/patcher/extraction-aliased.json" -o "build/current-seed.json" \
  --hinter.seedName=true \
  --hinter.settings=true \
  --hinter.stageLinks=true \
  --patcher.on=true \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/assign-power-of-wolf-relic-a-unique-id.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/clock-hands-display-minutes-and-seconds.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/customize-map-colors.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/enable-debug-mode.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/fix-boss-scylla.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-abandoned-mine.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-alchemy-laboratory.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-castle-entrance.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-clock-tower.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-long-library.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-marble-gallery.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-olroxs-quarters.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/normalize-underground-caverns.json" \
  --patcher.list="lib/BIN-Patcher/bins/sotn-us/patches/simplify-gear-puzzle.json" \
  --rewardShuffler.on=false \
  --roomShuffler.on=true \
  --solver.on=true \
  --stageShuffler.on=true

node lib/BIN-Patcher/bin alter -s "build/patcher/extraction-masked-aliased.json" -t "build/current-patch.json"
node lib/BIN-Patcher/bin patch -p "build/current-patch.json" -c "build/current-seed.json"
node lib/BIN-Patcher/bin patch -p "build/current-patch.json" -c "build/patcher/change-dependencies.json"
node lib/BIN-Patcher/bin ppf   -p "build/current-patch.json" -t "build/current-patch.ppf"
date
