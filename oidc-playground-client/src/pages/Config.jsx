import React from "react";
import { SettingsForm, RetrieveContent } from "components";
import { discovery } from "api";

export class Config extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
        jwks_uri: "",
        response_modes_supported: [],
        response_types_supported: [],
        scopes_supported: [],
        subject_types_supported: [],
        token_endpoint_auth_methods_supported: [],
        token_endpoint: "",
        userinfo_endpoint: ""
      }
    };
  }

  componentDidMount() {
    discovery().then(config => {
      this.setState({ config });
    });
  }

  render() {
    return (
      <div className="config">
        <SettingsForm config={this.state.config} />
        <RetrieveContent
          token="access_token_value"
          introspect_endpoint={this.state.config.introspect_endpoint}
          userinfo_endpoint={this.state.config.userinfo_endpoint}
          jwks_uri={this.state.config.jwks_uri}
        />
      </div>
    );
  }
}
