
@REM To recompute hashes, run the following:
@REM sha1sum build/seeds/* > tests/checksums.sha1

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher" || goto :error
python lib/SOTN-Patcher/src/sotn_patcher.py "build/patcher" || goto :error

python src/shuffler.py "presets/Standard.yaml" "data/solver/stage_validations.yaml" --seed=1 --output="build/seeds/1.json" --no-metadata || goto :error

sha1sum -c tests/checksums.sha1

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%