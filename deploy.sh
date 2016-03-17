#!/bin/bash

set -o errexit
set -o pipefail

destination_repo=${1:-${GITHUB_REPO}}
build_dir=styleguide

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
git push --force --quiet "https://x-api-token:${GITHUB_TOKEN}@${destination_repo}.git" master:gh-pages > /dev/null 2>&1
