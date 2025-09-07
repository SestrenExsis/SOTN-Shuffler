
mkdir "build/patcher"
mkdir "build/shuffler"

@REM If the next step fails, make sure the BIN is placed inside build/patcher and is named "Castlevania - Symphony of the Night (Track 1).bin"
@REM After doing so, rerun this script

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher" || goto :error
python lib/SOTN-Patcher/src/sotn_patcher.py "build/patcher" --data="lib/SOTN-Patcher/data/" --template="build/shuffler/vanilla-changes.json"

python src/mapper.py "Abandoned Mine"        250  600 --seed="1" || goto :error
python src/mapper.py "Alchemy Laboratory"    900 1800 --seed="1" || goto :error
python src/mapper.py "Castle Center"           1    1 --seed="1" || goto :error
python src/mapper.py "Castle Entrance"      3000 6000 --seed="1" || goto :error
python src/mapper.py "Castle Keep"             6  100 --seed="1" || goto :error
python src/mapper.py "Catacombs"             800 1600 --seed="1" || goto :error
python src/mapper.py "Clock Tower"            50  300 --seed="1" || goto :error
python src/mapper.py "Colosseum"              25  100 --seed="1" || goto :error
python src/mapper.py "Long Library"          900 1800 --seed="1" || goto :error
python src/mapper.py "Marble Gallery"       1200 2400 --seed="1" || goto :error
python src/mapper.py "Olrox's Quarters"     3500 7000 --seed="1" || goto :error
python src/mapper.py "Outer Wall"              8  100 --seed="1" || goto :error
python src/mapper.py "Royal Chapel"          200  600 --seed="1" --match-nodes || goto :error
python src/mapper.py "Underground Caverns"  1200 2400 --seed="1" || goto :error
python src/mapper.py "Warp Rooms"              1    1 --seed="1" || goto :error

python src/validator.py "data/solver/stage_validations.yaml" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
