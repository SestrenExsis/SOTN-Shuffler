
mkdir "build/patcher"
mkdir "build/shuffler"

@REM If the next step fails, make sure the BIN is placed inside build/patcher and is named "Castlevania - Symphony of the Night (Track 1).bin"
@REM After doing so, rerun this script

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher/extraction.json" || goto :error

python src/mapper.py "Abandoned Mine"       200  400 --seed="1" || goto :error
python src/mapper.py "Alchemy Laboratory"   500 1000 --seed="1" || goto :error
python src/mapper.py "Castle Center"          1    1 --seed="1" || goto :error
python src/mapper.py "Castle Entrance"      500 1000 --seed="1" || goto :error
python src/mapper.py "Castle Keep"            6  100 --seed="1" || goto :error
python src/mapper.py "Catacombs"            500 1000 --seed="1" || goto :error
python src/mapper.py "Clock Tower"          300  600 --seed="1" || goto :error
python src/mapper.py "Colosseum"             25  100 --seed="1" || goto :error
python src/mapper.py "Long Library"         600 1200 --seed="1" || goto :error
python src/mapper.py "Marble Gallery"       700 1400 --seed="1" || goto :error
python src/mapper.py "Olrox's Quarters"     500 1000 --seed="1" || goto :error
python src/mapper.py "Outer Wall"             8  100 --seed="1" || goto :error
python src/mapper.py "Royal Chapel"          80  160 --seed="1" || goto :error
python src/mapper.py "Underground Caverns"  600 1200 --seed="2" || goto :error
python src/mapper.py "Warp Rooms"             1    1 --seed="1" || goto :error

python src/validator.py "data/solver/stage_validations.yaml" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
