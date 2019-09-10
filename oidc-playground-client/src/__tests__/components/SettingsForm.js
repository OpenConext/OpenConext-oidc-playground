import React from "react";
import { shallow } from "enzyme";
import { SettingsForm } from "components";

const props = {
  onChange: () => {},
  config: {
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
    token_endpoint_auth_method: ""
  },
  form: {
    auth_protocol: "OpenID",
    acr_values: [],
    claims: [],
    code_challenge_method: "",
    code_verifier: "",
    code_challenge: "",
    pkce: false,
    grant_type: "authorization_code",
    response_mode: "fragment",
    response_type: "code",
    scope: [],
    token_endpoint_auth_method: "client_secret_basic",
    state: "example",
    nonce: "example"
  }
};

it("renders without crashing", () => {
  shallow(<SettingsForm {...props} />);
});
