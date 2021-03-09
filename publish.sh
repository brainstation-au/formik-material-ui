#!/usr/bin/env bash

message=$(git log -1 --pretty=%B)
echo $message

version=$(node ./version.js $message)
echo $version

if [[ -z ${version} ]]; then
  echo "No new version to publish."
  exit 0
fi

# npm config set @brainstationau:registry https://registry.npmjs.org/
# npm config set //registry.npmjs.org/:_authToken ${{ secrets.NPM_AUTH_TOKEN }}
# npm publish
# npm config delete //registry.npmjs.org/:_authToken
