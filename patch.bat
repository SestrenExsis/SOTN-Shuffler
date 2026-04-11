@REM IF [%1]==[] goto :error

node shuffle multi -e "build/patcher/extraction-aliased.json" -o "build/current-seed.json" ^
  --musicShuffler.on=true ^
  --patcher.on=true ^
  --patcher.list="lib/BIN-Patcher/patches/assign-power-of-wolf-relic-a-unique-id.json" ^
  --patcher.list="lib/BIN-Patcher/patches/clock-hands-display-minutes-and-seconds.json" ^
  --patcher.list="lib/BIN-Patcher/patches/customize-map-colors.json" ^
  --patcher.list="lib/BIN-Patcher/patches/enable-debug-mode.json" ^
  --patcher.list="lib/BIN-Patcher/patches/fix-boss-scylla.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-abandoned-mine.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-alchemy-laboratory.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-castle-entrance.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-clock-tower.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-long-library.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-marble-gallery.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-olroxs-quarters.json" ^
  --patcher.list="lib/BIN-Patcher/patches/normalize-underground-caverns.json" ^
  --patcher.list="lib/BIN-Patcher/patches/simplify-gear-puzzle.json" ^
  --solver.on=true ^
  --stageShuffler.on=true

node lib/BIN-Patcher/sotn alter -s "build/patcher/extraction-masked-aliased.json" -t "build/current-patch.json" || goto :error
node lib/BIN-Patcher/sotn patch -p "build/current-patch.json" -c "build/current-seed.json" || goto :error
node lib/BIN-Patcher/sotn patch -p "build/current-patch.json" -c "build/patcher/change-dependencies.json"
node lib/BIN-Patcher/sotn ppf   -p "build/current-patch.json" -t "build/current-patch.ppf" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
