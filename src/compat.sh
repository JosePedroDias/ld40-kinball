#!/bin/bash

# requires doing 1st:
# cd src
# npm install
#
# then on prior to every deploy
# ./compat.sh

cat storage.js > tmp.js
cat loadMusic.js >> tmp.js
cat sound.js >> tmp.js
cat level0.js >> tmp.js
cat level.js >> tmp.js
cat flipper.js >> tmp.js
node_modules/.bin/buble --objectAssign --target safari:9,edge:13 tmp.js -o compat.js
