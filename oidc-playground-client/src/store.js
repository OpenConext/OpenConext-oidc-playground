// Store.js

import {configure, makeAutoObservable} from "mobx";

// This app mutates observables directly from event/promise handlers rather than
// wrapping them in mobx actions (a pattern that was allowed by default in mobx 5).
configure({enforceActions: "never"});

class Store {
  message = undefined;
  request = undefined;
  processingTime = undefined;
  normalFlowIdToken = undefined;
  normalFlowAccessToken = undefined;
  hybridFlowIdToken = undefined;
  hybridFlowAccessToken = undefined;
  clientCredentialsAccessToken = undefined;
  refreshToken = undefined;
  configLoaded = false;
  activeTab = "JWT";
  apiCall = false;
  deviceAuthentication = undefined;
  apiEndpointEnabled = false;
  config = {
    acr_values_supported: [],
    claims_parameter_supported: false,
    claims_supported: [],
    code_challenge_methods_supported: [],
    grant_types_supported: [],
    id_token_signing_alg_values_supported: [],
    issuer: "",
    response_modes_supported: [],
    response_types_supported: [],
    scopes_supported: [],
    subject_types_supported: [],
    token_endpoint_auth_methods_supported: [],
    token_endpoint_auth_method: "",
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const store = new Store();

export default store;
