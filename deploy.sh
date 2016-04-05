#!/bin/bash

set -o errexit
set -o pipefail

destination_repo=${1:-${GITHUB_REPO}}
build_dir=styleguide
target=18f-pages

if [ -z "$GITHUB_TOKEN" ]; then
    echo "GITHUB_TOKEN is required." >&2
    exit 1
fi

# Clean
rm -rf $build_dir

# Build
npm run build

# Git init
cd $build_dir
git --version
git init
git config user.name "Travis deploy script"
git config user.email "aaron.borden+fec-style@gsa.gov"
git add .
git commit -m "Deploy to GitHub Pages"
# Force push from the current repo's master branch to the remote
# repo's target branch. (All previous history on the target branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://x-api-token:${GITHUB_TOKEN}@${destination_repo}.git" master:${target} > /dev/null 2>&1
