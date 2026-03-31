
node shuffle stage -e build/patcher/extraction-aliased.json -o build/shuffler/shuffle-stages.json

node lib/BIN-Patcher/sotn alter -s "build/patcher/extraction-masked-aliased.json" -t "build/current-patch.json"
node lib/BIN-Patcher/sotn patch -p "build/current-patch.json" -c "build/shuffler/shuffle-stages.json"
node lib/BIN-Patcher/sotn ppf   -p "build/current-patch.json" -t "build/current-patch.ppf"