#!/bin/bash

# cd to the folder containing this script
cd "$(dirname "$0")"

# cd to the project's root folder
cd ../..

./node_modules/.bin/eslint .
