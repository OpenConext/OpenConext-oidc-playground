#!/bin/bash
rm -Rf dist/*
rm -Rf target/*
source $NVM_DIR/nvm.sh
nvm use
yarn install && CI=true yarn test && yarn build
