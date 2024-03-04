#!/bin/bash

echo "Build script"
ls
cd bloglist-frontend
npm install
cd ..
ls
npm install
npm run build:ui
npm run start