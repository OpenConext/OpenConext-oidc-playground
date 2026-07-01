# Changelog

## 4.2.2.
* Removed the `client_credentials` grant_type option when the OAuth2 protocol is selected. Both in the GUI as on the Server.

## 4.2.1.
* Add changelog

## 4.2.0

Feature:
* Add a setting `features.api_endpoint_enabled` which allows disabling of the API endpoint. THe API endpoint is very
  useful for testing, but in essence acts as a open proxy. Do **not** enable this on publically available sites. Note
  that this was enabled by defualt in previous releases.

## 4.1.0

Maintenance:
* Updated dependencies
* Built container images for arm64
* Added small fixes to README.md

Bug fixes

* Removed sub and uids from excludedClaims (#57)
