import React from "react";
import { observer } from "mobx-react";
import store from "store";
import { ReactSelect, InfoLabel } from "components";
import { CodeChallenge, GrantType, ResponseMode, ResponseType, Scopes } from "components/settings";
import { authorizationProtocolT, tokenEndpointAuthenticationT } from "components/settings/Tooltips";
import { generateCodeChallenge, formPost } from "api";
import { getRedirectParams } from "utils/Url";

const excludedClaims = [
  "aud",
  "nbf",
  "iss",
  "exp",
  "iat",
  "jti",
  "nonce",
  "at_hash",
  "c_hash",
  "s_hash",
  "at_hash",
  "sub",
  "uids"
];

export const SettingsForm = observer(
  class SettingsForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
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
      };
    }

    componentDidMount() {
      const params = getRedirectParams();

      if (params && params.state) {
        const decodedStateString = window.atob(params.state);

        this.setState({
          ...this.state,
          ...JSON.parse(decodedStateString),
          state: JSON.stringify(decodedStateString)
        });
      }

      if (window.location.pathname === "/") {
        generateCodeChallenge(this.state.code_challenge_method).then(json =>
          this.setState({
            code_challenge_method: json.codeChallengeMethod,
            code_verifier: json.codeVerifier,
            code_challenge: json.codeChallenge
          })
        );
      }
    }

    getSanitizedBody() {
      return {
        ...store.config,
        ...this.state,
        acr_values: this.state.acr_values.join(" "),
        state: window.btoa(JSON.stringify(this.state))
      };
    }

    handleSubmit = e => {
      e.preventDefault();

      formPost(this.getSanitizedBody()).then(json => {
        if (json.url) {
          window.location.replace(json.url);
        }

        if (json.result) {
          store.request = json;
        }
      });
    };

    setValue(attr, value, callback = () => this) {
      this.setState({ [attr]: value }, callback);
    }

    render() {
      const {
        acr_values,
        auth_protocol,
        claims,
        code_challenge_method,
        code_challenge,
        code_verifier,
        pkce,
        grant_type,
        nonce,
        response_mode,
        response_type,
        scope,
        state,
        token_endpoint_auth_method
      } = this.state;

      return (
        <form onSubmit={this.handleSubmit}>
          <fieldset className="form-header">
            <h2>Settings</h2>
          </fieldset>

          <fieldset>
            <InfoLabel label="Authorization protocol" toolTip={authorizationProtocolT()} />
            <ReactSelect
              value={auth_protocol}
              options={["OpenID", "Oauth2"]}
              onChange={val => this.setValue("auth_protocol", val)}
            />
          </fieldset>

          <GrantType
            value={grant_type}
            options={store.config.grant_types_supported}
            onChange={val =>
              this.setState({
                grant_type: val,
                response_type: val === "implicit" ? "token id_token" : val === "client_credentials" ? "token" : "code"
              })
            }
            moderators={{ auth_protocol }}
          />

          <div className="field-block">
            <ResponseType
              value={response_type}
              options={store.config.response_types_supported}
              onChange={val => this.setValue("response_type", val)}
              moderators={{ auth_protocol, grant_type }}
            />

            <ResponseMode
              value={response_mode}
              options={store.config.response_modes_supported}
              onChange={val => this.setValue("response_mode", val)}
              moderators={{ grant_type }}
            />
          </div>

          <Scopes
            value={scope}
            options={store.config.scopes_supported}
            onChange={val => this.setValue("scope", val)}
            moderators={{ auth_protocol }}
          />
          {grant_type !== "implicit" && (
            <fieldset>
              <InfoLabel label="Token endpoint authentication" toolTip={tokenEndpointAuthenticationT()} />
              <ReactSelect
                value={token_endpoint_auth_method}
                options={store.config.token_endpoint_auth_methods_supported}
                onChange={val => this.setValue("token_endpoint_auth_method", val)}
              />
            </fieldset>
          )}

          <fieldset>
            <label>Requested claims</label>
            <ReactSelect
              value={claims}
              options={store.config.claims_supported.filter(claim => !excludedClaims.includes(claim))}
              onChange={val => this.setValue("claims", val)}
              isMulti
            />
          </fieldset>

          <div className="field-block">
            <fieldset>
              <label>State</label>
              <input value={state} disabled />
            </fieldset>

            <fieldset>
              <label>Nonce</label>
              <input value={nonce} onChange={e => this.setValue("nonce", e.target.value)} />
            </fieldset>
          </div>
          <fieldset>
            <label>ACR values</label>
            <ReactSelect
              value={acr_values}
              options={store.config.acr_values_supported}
              onChange={val => this.setValue("acr_values", val)}
              isMulti
            />
          </fieldset>

          <div className="field-block">
            <CodeChallenge
              codeChallenge={code_challenge}
              codeVerifier={code_verifier}
              pkce={pkce}
              togglePkce={() => this.setValue("pkce", !pkce)}
              codeChallengeMethod={{
                value: code_challenge_method,
                options: store.config.code_challenge_methods_supported,
                onChange: val => this.setValue("code_challenge_method", val, this.componentDidMount)
              }}
              moderators={{ grant_type }}
            />
          </div>

          <fieldset>
            <button type="submit" className="button blue">
              Submit
            </button>
          </fieldset>
        </form>
      );
    }
  }
);
