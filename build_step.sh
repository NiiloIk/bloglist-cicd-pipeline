#!/bin/bash

echo "Build script"
echo "listing start"

cd bloglist-frontend
echo "npm install in frontend"
ls
npm install

cd ..
echo "listing after frontend install"
ls

npm install
npm run build:ui
npm run start