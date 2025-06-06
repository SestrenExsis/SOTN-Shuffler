
set SEED=%1
set BUILD=AlphaBuild77

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher/extraction.json" || goto :error
python lib/SOTN-Patcher/src/sotn_patcher.py "build/patcher/extraction.json" || goto :error
python src/shuffler.py "examples/default-settings.yaml" "data/solver/stage_validations.yaml" --output="build/shuffler/current-seed.json" --seed=%SEED% || goto :error
python lib/SOTN-Patcher/src/sotn_patcher.py "build/patcher/extraction.json" --data="lib/SOTN-Patcher/data/" --changes="build/shuffler/current-seed.json" --ppf="build/patcher/"%BUILD%"_"%SEED%".ppf" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
