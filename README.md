# OpenConext-oidc-playground
[![Build Status](https://travis-ci.org/OpenConext/OpenConext-oidc-playground.svg)](https://travis-ci.org/OpenConext/OpenConext-oidc-playground)
[![codecov.io](https://codecov.io/github/OpenConext/OpenConext-oidc-playground/coverage.svg)](https://codecov.io/github/OpenConext/OpenConext-oidc-playground)

Test app for an OpenID Connect server

## [Getting started](#getting-started)

### [System Requirements](#system-requirements)

- Java 8
- Maven 3
- yarn 1.x
- NodeJS v8.12.0 (best managed with `nvm`)
- ansible

## [Building and running](#building-and-running)

### [The oidc-playground-server](#playground-server)

This project uses Spring Boot and Maven. To run locally, type:

`cd oidc-playground-server`

`mvn spring-boot:run`

When developing, it's convenient to just execute the applications main-method, which is in [Application](oidc-playground-server/src/main/java/playground/PlaygroundServerApplication.java).

### [The oidc-playground-client](#playground-client)

The client is build with react and to get initially started:

```
cd oidc-playground-client
yarn install
yarn start
```

Browse to the [application homepage](http://localhost:8081/).

To add new dependencies:

`yarn add package --dev`

When new yarn dependencies are added:

`yarn install`

To run all JavaScript tests:
```
cd client
yarn test
```
Or to run all the tests and do not watch - like CI:
```
cd client
CI=true yarn test
```
