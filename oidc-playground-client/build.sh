#!/bin/bash
rm -Rf build/*
rm -Rf target/*
export NODE_OPTIONS=--openssl-legacy-provider
yarn install && CI=true yarn test && yarn build
