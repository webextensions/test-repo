#!/bin/bash

# cd to the folder containing this script
cd "$(dirname "$0")"

set -x
./deploy-manager/scripts/cacheable-node_modules-installation.js
