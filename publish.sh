#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$DIR"

# First, validate that we are logged in to npm.
npm whoami > /dev/null

if [ -z "$1" ]; then
  echo "Error: The package name is required."
  exit 1
fi
PACKAGE_NAME="$1"

PACKAGE_DIR="$DIR/packages/$PACKAGE_NAME"
if ! test -d "$PACKAGE_DIR"; then
  echo "Error: The directory of \"$PACKAGE_DIR\" does not exist."
  exit 1
fi

cd "$PACKAGE_DIR"

if [ -z "$2" ]; then
  echo "Error: The version bump description is required."
  exit 1
fi
VERSION_BUMP="$2"

# Before bumping the version, check to see if this package compiles (so that we can avoid
# unnecessary version bumps).
bash "$PACKAGE_DIR/build.sh"

if [ "$VERSION_BUMP" == "dev" ]; then
  pnpm version --prerelease --preid=dev --message "chore(release): $PACKAGE_NAME-%s"
else
  pnpm version --set-version $VERSION_BUMP
fi

# We have to build again after bumping the version so that the new "package.json" file gets copied
# to the "dist" directory.
bash "$PACKAGE_DIR/build.sh"

# Upload the package to npm.
# The "--access=public" flag is only technically needed for the first publish, but it is saved here
# for posterity.
cd "$DIR/dist/packages/$PACKAGE_NAME"
if [ "$VERSION_BUMP" == "dev" ]; then
  NPM_TAG=next
else
  NPM_TAG=latest
fi
npm publish --access=public --tag=$NPM_TAG

sleep 1
bash "$DIR/update.sh"
pnpx syncpack fix-mismatches --prod --dev
bash "$DIR/packages/isaacscript-cli/update.sh"
bash "$DIR/packages/isaacscript-lint/update.sh"

set +e
if pnpx git-dirty; then
  git commit -a -m "chore: updating dependencies"
  git push --set-upstream origin main
fi
set -e
