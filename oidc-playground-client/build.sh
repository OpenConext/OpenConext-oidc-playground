#!/bin/bash
rm -Rf build/*
rm -Rf target/*
export NODE_OPTIONS=--openssl-legacy-provider
source $NVM_DIR/nvm.sh
nvm use
yarn install && CI=true yarn test && yarn build
