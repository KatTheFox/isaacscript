#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# The website repository will be already cloned at this point by the parent GitHub action, including
# switching to the "gh-pages" branch. See "ci.yml" for more information.
REPO_ROOT="$DIR/../.."
BUILD_PATH="$REPO_ROOT/dist/packages/docs"
DOCS_REPO_NAME="isaacscript.github.io"
DOCS_REPO="$REPO_ROOT/$DOCS_REPO_NAME"
DOCS_REPO_GIT_BACKUP="/tmp/$DOCS_REPO_NAME.git"

mv "$DOCS_REPO/.git" "$DOCS_REPO_GIT_BACKUP"
rm -rf "$DOCS_REPO"
cp --recursive "$BUILD_PATH" "$DOCS_REPO"
mv "$DOCS_REPO_GIT_BACKUP" "$DOCS_REPO/.git"
cd "$DOCS_REPO"

set +e
if pnpx git-dirty; then
  echo "There are no docs changes to deploy."
  exit 0
fi
set -e

# Before committing to the docs repo, ensure that the checked out version of the `isaacscript`
# repository is the latest version. (It is possible that another commit has been pushed in the
# meantime, in which case we should do nothing and wait for the CI on that commit to finish.)
# https://stackoverflow.com/questions/3258243/check-if-pull-needed-in-git
cd "$REPO_ROOT"
git fetch
if [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ]; then
  exit 0
fi

echo "Deploying changes to the docs website: $DOCS_REPO_NAME"
cd "$DOCS_REPO"

git config --global user.email "github-actions@users.noreply.github.com"
git config --global user.name "github-actions"

# We overwrite the previous commit instead of adding a new one in order to keep the size of the
# repository as small as possible. This speeds up deployment because with thousands of commits, it
# takes a very long time to clone.
git add --all
git commit --message "deploy" --amend
git push --force-with-lease
