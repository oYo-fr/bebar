#!/bin/bash
# Get directory of calling script
DIR="$( cd "$( dirname "$0" )" &> /dev/null && pwd )"
if [ "$(echo $DIR | grep '.nvm')" ]; then
    DIR="$(dirname "$(readlink -f "$0")")"
fi
/usr/bin/env node --experimental-specifier-resolution=node $DIR/../dist/index.js $@
