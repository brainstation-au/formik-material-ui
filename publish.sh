#!/usr/bin/env bash

message=$(git log -1 --pretty=%B)
version=$(node ./version.js "$message")

if [[ "$version" == "null" ]]; then
  echo "No new version to publish."
  exit 0
fi

git config --local user.email "action@github.com"
git config --local user.name "GitHub Action"
tag=$(npm version $version)
git tag -a $tag -m "Publishing new version to NPM"

npm config set @brainstationau:registry https://registry.npmjs.org/
npm config set //registry.npmjs.org/:_authToken ${{ secrets.NPM_AUTH_TOKEN }}
npm publish
npm config delete //registry.npmjs.org/:_authToken
