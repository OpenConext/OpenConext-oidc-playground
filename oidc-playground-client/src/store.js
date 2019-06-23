// Store.js

import {decorate, observable} from "mobx";

class Store {
  message = undefined;
  request = undefined;
  normalFlowIdToken = undefined;
  normalFlowAccessToken = undefined;
  hybridFlowIdToken = undefined;
  hybridFlowAccessToken = undefined;
  clientCredentialsAccessToken = undefined;
  refreshToken = undefined;
  configLoaded = false;
  activeTab = "JWT";
  config = {
    authorization_endpoint: "",
    token_endpoint: "",
    acr_values_supported: [],
    claims_parameter_supported: false,
    claims_supported: [],
    code_challenge_methods_supported: [],
    grant_types_supported: [],
    id_token_signing_alg_values_supported: [],
    introspect_endpoint: "",
    issuer: "",
    response_modes_supported: [],
    response_types_supported: [],
    scopes_supported: [],
    subject_types_supported: [],
    token_endpoint_auth_methods_supported: [],
    token_endpoint_auth_method: "",
    userinfo_endpoint: ""
  };
}

decorate(Store, {
  message: observable,
  request: observable,
  normalFlowIdToken: observable,
  normalFlowAccessToken: observable,
  hybridFlowIdToken: observable,
  hybridFlowAccessToken: observable,
  clientCredentialsAccessToken: observable,
  refreshToken: observable,
  config: observable,
  configLoaded: observable,
  activeTab: observable
});

const store = new Store();

export default store;
