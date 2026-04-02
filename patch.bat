IF [%1]==[] goto :error

set SEED=%1

node shuffle stage -e build/patcher/extraction-aliased.json -o build/shuffler/shuffle-stages.json -s %SEED% || goto :error

node lib/BIN-Patcher/sotn alter -s "build/patcher/extraction-masked-aliased.json" -t "build/current-patch.json" || goto :error
node lib/BIN-Patcher/sotn patch -p "build/current-patch.json" -c "build/shuffler/shuffle-stages.json" || goto :error
node lib/BIN-Patcher/sotn ppf   -p "build/current-patch.json" -t "build/current-patch.ppf" || goto :error

goto :EOF

:error
echo Failed with error #%errorlevel%
exit /b %errorlevel%
