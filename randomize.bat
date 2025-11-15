
set PRESET=%1
set SKILLSET=%2
set SEED=%3
set BUILD=BetaRelease8

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher" || goto :error
python lib/SOTN-Patcher/src/sotn_patcher.py "build/patcher" || goto :error
python lib/SOTN-Patcher/src/sotn_ppf.py "build/patcher" --data="lib/SOTN-Patcher/data" || goto :error
python src/shuffler.py "presets/%PRESET%.yaml" "data/solver/stage_validations.yaml" --output="build/shuffler/current-seed.json" --seed=%SEED% --skillset=%SKILLSET% || goto :error
python lib/SOTN-Patcher/src/sotn_ppf.py "build/patcher" --data="lib/SOTN-Patcher/data/" --changes="build/shuffler/current-seed.json" --ppf="build/patcher/"%SEED%"_"%PRESET%"_"%SKILLSET%"_"%BUILD%.ppf" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
