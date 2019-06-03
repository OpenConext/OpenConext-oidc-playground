import React from "react";
import { mount } from "enzyme";
import { SettingsForm } from "components";

const props = {
  config: {
    authorization_endpoint: "",
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
  }
};

it("renders without crashing", () => {
  mount(<SettingsForm {...props} />);
});
