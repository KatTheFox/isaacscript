#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Get the name of the repository:
# https://stackoverflow.com/questions/23162299/how-to-get-the-last-part-of-dirname-in-bash/23162553
REPO_NAME="$(basename "$DIR")"

SECONDS=0

cd "$DIR"

REPO_ROOT="$DIR/../.."
OUT_DIR="$REPO_ROOT/dist/packages/$REPO_NAME"

# First, copy some interfaces from "isaacscript-common".
# (Normally, we would reference them directly, but "paths" in the "tsconfig.json" file do not work
# properly with TSTL.)
INTERFACE_FILES=( CustomStageTSConfig JSONRoomsFile )
INTERFACE_SOURCE_DIRECTORY="$DIR/../isaacscript-common/src/interfaces"
INTERFACE_DESTINATION_DIRECTORY="$DIR/src/interfaces/copied"
mkdir -p "$INTERFACE_DESTINATION_DIRECTORY"
for i in "${INTERFACE_FILES[@]}"; do
  SOURCE_PATH="$INTERFACE_SOURCE_DIRECTORY/$i.ts"
  DESTINATION_PATH="$INTERFACE_DESTINATION_DIRECTORY/$i.ts"
  cp "$SOURCE_PATH" "$DESTINATION_PATH"
  sed --in-place '1i // THIS FILE IS AUTOMATICALLY GENERATED BY THE "build.sh" SCRIPT. DO NOT EDIT THIS FILE!\n' "$DESTINATION_PATH"
  sed --in-place 's/"..\/types\/Immutable"/"isaacscript-common-ts"/' "$DESTINATION_PATH"
done

# Second, generate the JSON schema for the special "isaacscript" section in "tsconfig.json".
SCHEMA_PATH="$DIR/schemas/tsconfig-isaacscript-section-schema.json"
pnpx ts-json-schema-generator --path "$DIR/src/interfaces/IsaacScriptTSConfig.ts" --tsconfig "$DIR/tsconfig.json" --out "$SCHEMA_PATH"
pnpx prettier "$SCHEMA_PATH" --write

# Also, generate the JSON schema for the "isaacscript.json" file.
# The `ts-json-schema-generator` tool is broken with classes:
# https://github.com/vega/ts-json-schema-generator/issues/1531
#SCHEMA_PATH="$DIR/schemas/isaacscript-schema.json"
#pnpx ts-json-schema-generator --path "$DIR/src/classes/Config.ts" --tsconfig "$DIR/tsconfig.json" --out "$SCHEMA_PATH"
#pnpx prettier "$SCHEMA_PATH" --write

# Third, compile the program.
# (Normally, we would use the "@nrwl/js:tsc" plugin to do this, but we always want to generate the
# schema.)
rm -rf "$OUT_DIR"
pnpx tsc

# Copy the rest of the files needed for npm.
cp --recursive "$DIR/custom-stage" "$OUT_DIR/"
cp --recursive "$DIR/file-templates" "$OUT_DIR/"
cp --recursive "$DIR/isaacscript-watcher" "$OUT_DIR/"
cp "$DIR/LICENSE" "$OUT_DIR/"
cp "$DIR/package.json" "$OUT_DIR/"
cp "$DIR/README.md" "$OUT_DIR/"
cp --recursive "$DIR/schemas" "$OUT_DIR/"

if [ "$1" == "global" ]; then
  # We make a separate variable because "REPO_NAME" is equal to "isaacscript-cli".
  BINARY_NAME="isaacscript"

  rm -rf "$DIR/dist" # Remove any previous build artifacts
  rm -rf "$HOME/AppData/Roaming/npm/$BINARY_NAME" # Previous file from "npm i . -g"
  rm -rf "$HOME/AppData/Roaming/npm/$BINARY_NAME.cmd" # Previous file from "npm i . -g"
  rm -rf "$HOME/AppData/Roaming/npm/$BINARY_NAME.ps1" # Previous file from "npm i . -g"
  rm -rf "$HOME/AppData/Roaming/npm/node_modules/$BINARY_NAME" # Previous link from "npm i . -g"

  cd "$OUT_DIR"
  npm install . --global
fi

echo "Successfully built in $SECONDS seconds."
