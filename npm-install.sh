#!/bin/bash

# cd to the folder containing this script
cd "$(dirname "$0")"

set -x
./node_modules-archive/install.js --package-lock-must-be-in-sync-when-available
