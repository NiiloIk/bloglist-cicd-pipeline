#!/bin/bash

echo "Build script"

ls
npm install

cd ./bloglist-frontend
npm install
npm run build 
cp -r dist ../ 
cd ..

npm run start