#!/bin/bash

echo "Build script"

cd bloglist-frontend
ls
npm install
cd ..

ls
npm install
npm run build:ui