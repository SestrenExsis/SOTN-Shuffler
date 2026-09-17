BIN=$1

mkdir "build"
mkdir "build/patcher"
mkdir "build/shuffler"
mkdir "lib/BIN-Patcher/build"

rm -f build/extraction-template.json
rm -f build/extraction.json

cp "build/patcher/aliases.json" "lib/BIN-Patcher/build/aliases.json"

# If the next step fails, make sure you are passing the correct path to the BIN as the first argument
# After doing so, rerun this script

node lib/BIN-Patcher/bins/sotn-us/util extract -t "lib/BIN-Patcher/bins/sotn-us/data/extraction-template.json" -o "build/patcher/extraction-template.json"
node lib/BIN-Patcher/bin extract -b "$BIN" -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json"

node lib/BIN-Patcher/bins/sotn-us/util extract -t "lib/BIN-Patcher/bins/sotn-us/data/extraction-template.json" -o "build/patcher/extraction-template.json" --previous "build/patcher/extraction.json"
node lib/BIN-Patcher/bin extract -b "$BIN" -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json"

node lib/BIN-Patcher/bins/sotn-us/util extract -t "lib/BIN-Patcher/bins/sotn-us/data/extraction-template.json" -o "build/patcher/extraction-template.json" --previous "build/patcher/extraction.json"
node lib/BIN-Patcher/bin extract -b "$BIN" -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json"

node lib/BIN-Patcher/bins/sotn-us/util extract -t "lib/BIN-Patcher/bins/sotn-us/data/extraction-template.json" -o "build/patcher/extraction-template.json" --previous "build/patcher/extraction.json"
node lib/BIN-Patcher/bin extract -b "$BIN" -t "build/patcher/extraction-template.json" -e "build/patcher/extraction.json"

node lib/BIN-Patcher/bins/sotn-us/util teleporters -e "build/patcher/extraction.json" -o "build/patcher/extraction-processed.json"
node lib/BIN-Patcher/bins/sotn-us/util dependencies -t "lib/BIN-Patcher/bins/sotn-us/data/change-dependencies-template.json" -o "build/patcher/change-dependencies.json"
node lib/BIN-Patcher/bin alter -s "build/patcher/extraction-processed.json" -t "build/patcher/extraction-aliased.json" --aliases "build/patcher/aliases.json"
node lib/BIN-Patcher/bin alter -s "build/patcher/extraction-aliased.json" -t "build/patcher/extraction-masked-aliased.json" --mask "data"
