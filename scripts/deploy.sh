#!/usr/bin/env bash

# Exit with nonzero exit code if anything fails
set -e

# Configure git
git config user.name "Travis CI"
git config user.email "contact@travis-ci.org"
git remote set-url origin $ORIGIN_URL
git checkout master

# Setup the deploy key by decrypting using Travis's stored variables
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in deploy-key.enc -out deploy-key -d
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa

# Setup npm config
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN -q

# All set up, run the release task
npm run release