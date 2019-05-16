#!/bin/bash
rm -Rf build/*
rm -Rf target/*
yarn install && CI=true yarn test && yarn build
