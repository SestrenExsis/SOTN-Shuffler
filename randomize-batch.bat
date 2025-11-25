
set BUILD=BetaRelease8
set COUNT=%1
set PRESET=%2
set SKILLSET=%3

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher" || goto :error
python lib/SOTN-Patcher/src/sotn_patcher.py "build/patcher" || goto :error
python lib/SOTN-Patcher/src/sotn_ppf.py "build/patcher" --data="lib/SOTN-Patcher/data" || goto :error
python src/generate_seed_names.py data/words.yaml %COUNT% %PRESET% %SKILLSET% --output build/batch.txt
for /f "tokens=1,2,3" %%i in (build/batch.txt) do call :process %%i %%j %%k

goto :EOF

:process
    @echo %1 %2 %3
    set PRESET=%1
    set SKILLSET=%2
    set SEED=%3
    python src/shuffler.py "presets/%PRESET%.yaml" "data/solver/stage_validations.yaml" --output="build/shuffler/current-seed.json" --seed=%SEED% --skillset=%SKILLSET% || goto :error
    python lib/SOTN-Patcher/src/sotn_ppf.py "build/patcher" --data="lib/SOTN-Patcher/data/" --changes="build/shuffler/current-seed.json" --ppf="build/patcher/batch/"%SEED%"_"%PRESET%"_"%SKILLSET%"_"%BUILD%".ppf" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
