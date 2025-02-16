
mkdir -p "build/extractor"
mkdir -p "build/mapper"
mkdir -p "build/patcher"

@REM First, make sure the BIN is placed inside build/patcher and is named "Castlevania - Symphony of the Night (Track 1).bin"

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/extractor/extraction.json" || goto :error

python src/mapper.py "Abandoned Mine" 100 || goto :error
python src/mapper.py "Alchemy Laboratory" 100 || goto :error
python src/mapper.py "Castle Center" 100 || goto :error
python src/mapper.py "Castle Entrance" 100 || goto :error
python src/mapper.py "Castle Keep" 100 || goto :error
python src/mapper.py "Catacombs" 100 || goto :error
python src/mapper.py "Clock Tower" 100 || goto :error
python src/mapper.py "Colosseum" 100 || goto :error
python src/mapper.py "Long Library" 100 || goto :error
python src/mapper.py "Marble Gallery" 100 || goto :error
python src/mapper.py "Olrox's Quarters" 100 || goto :error
python src/mapper.py "Outer Wall" 100 || goto :error
python src/mapper.py "Royal Chapel" 100 || goto :error
python src/mapper.py "Underground Caverns" 100 || goto :error
python src/mapper.py "Warp Rooms" 100 || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
