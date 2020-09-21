#!/bin/bash
rm -rf ./build
mkdir ./build

yarn webpack
cp dist/background.js build/
cp static/* build/
cp manifest.json build/
