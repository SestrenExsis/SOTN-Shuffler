set BIN=%1

mkdir "build/patcher"
mkdir "build/shuffler"
mkdir "lib/BIN-Patcher/build"

rm -f build/extraction-template.json
rm -f build/extraction.json

python lib/BIN-Patcher/tools/yaml-to-json.py "lib/BIN-Patcher/data/aliases.yaml" "build/patcher/aliases.json" || goto :error
cp "build/patcher/aliases.json" "lib/BIN-Patcher/build/aliases.json"

@REM If the next step fails, make sure you are passing the correct path to the BIN as the first argument
@REM After doing so, rerun this script

python lib/BIN-Patcher/tools/generate-extraction-template.py "lib/BIN-Patcher/data/extraction-template.yaml" "build/patcher/extraction-template.json" || goto :error
node lib/BIN-Patcher/sotn extract -b %BIN% -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json" || goto :error

python lib/BIN-Patcher/tools/generate-extraction-template.py "lib/BIN-Patcher/data/extraction-template.yaml" "build/patcher/extraction-template.json" --previous "build/patcher/extraction.json" || goto :error
node lib/BIN-Patcher/sotn extract -b %BIN% -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json" || goto :error

python lib/BIN-Patcher/tools/generate-extraction-template.py "lib/BIN-Patcher/data/extraction-template.yaml" "build/patcher/extraction-template.json" --previous "build/patcher/extraction.json" || goto :error
node lib/BIN-Patcher/sotn extract -b %BIN% -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json" || goto :error

python lib/BIN-Patcher/tools/generate-extraction-template.py "lib/BIN-Patcher/data/extraction-template.yaml" "build/patcher/extraction-template.json" --previous "build/patcher/extraction.json" || goto :error
node lib/BIN-Patcher/sotn extract -b %BIN% -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json" || goto :error

python lib/BIN-Patcher/tools/post-process-extraction.py "build/patcher/extraction.json" "build/patcher/aliases.json" "build/patcher/extraction-processed.json" || goto :error
python lib/BIN-Patcher/tools/generate-change-dependencies-template.py "lib/BIN-Patcher/data/change-dependencies-template.yaml" "build/patcher/change-dependencies.json" || goto :error
node lib/BIN-Patcher/sotn alter -s "build/patcher/extraction-processed.json" -t "build/patcher/extraction-aliased.json" --aliases "build/patcher/aliases.json" || goto :error
node lib/BIN-Patcher/sotn alter -s "build/patcher/extraction-aliased.json" -t "build/patcher/extraction-masked-aliased.json" --mask "data"

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
