#!/bin/bash
rm -rf ./build
mkdir ./build

yarn webpack
cp dist/background.js build/
cp static/* build/
cp manifest.json build/

curl -o build/vue.js https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js
curl -o build/vuetify.js https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js
