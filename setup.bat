
mkdir "build/patcher"
mkdir "build/shuffler"

@REM If the next step fails, make sure the BIN is placed inside build/patcher and is named "Castlevania - Symphony of the Night (Track 1).bin"
@REM After doing so, rerun this script

python lib/SOTN-Patcher/src/sotn_extractor.py "build/patcher/Castlevania - Symphony of the Night (Track 1).bin" "build/patcher/extraction.json" || goto :error

python src/mapper.py "Abandoned Mine" 100 || goto :error
python src/mapper.py "Alchemy Laboratory" 200 || goto :error
python src/mapper.py "Castle Center" 100 || goto :error
python src/mapper.py "Castle Entrance" 100 || goto :error
python src/mapper.py "Castle Keep" 100 || goto :error
python src/mapper.py "Catacombs" 100 || goto :error
python src/mapper.py "Clock Tower" 100 || goto :error
python src/mapper.py "Colosseum" 200 || goto :error
python src/mapper.py "Long Library" 200 || goto :error
python src/mapper.py "Marble Gallery" 300 || goto :error
python src/mapper.py "Olrox's Quarters" 200 || goto :error
python src/mapper.py "Outer Wall" 200 || goto :error
python src/mapper.py "Royal Chapel" 200 || goto :error
python src/mapper.py "Underground Caverns" 100 || goto :error
python src/mapper.py "Warp Rooms" 100 || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
