#!/bin/bash

echo "Build script"

cd bloglist-frontend
npm install
cd ..

npm install
npm run build:ui
npm run start