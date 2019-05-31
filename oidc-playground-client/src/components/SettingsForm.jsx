import React from "react";
import { ReactSelect, InfoLabel } from "components";
import {
  CodeChallenge,
  GrantType,
  ResponseMode,
  ResponseType,
  Scopes
} from "components/settings";
import { formPost } from "api";
import {authorizationProtocol, tokenEndpointAuthentication} from "./settings/Tooltips";

const excludedClaims = ["aud", "nbf", "iss", "exp", "iat", "jti", "nonce", "at_hash", "c_hash", "s_hash", "at_hash", "sub", "uids"];

export class SettingsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      auth_protocol: "OpenID",
      acr_values: [],
      claims: [],
      code_challenge_method: "",
      code_challenge: "",
      grant_type: "authorization_code",
      response_mode: "",
      response_type: "code",
      scope: [],
      token_endpoint_auth_method: "client_secret_basic",
      state: "example",
      nonce: "example"
    };
  }

  getSanitizedBody() {
    return {
      ...this.props.config,
      ...this.state,
      acr_values: this.state.acr_values.join(" ")
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    formPost(this.getSanitizedBody()).then(json => {
      if (json.url) {
        window.location.replace(json.url);
      } else {
        //TODO update data
      }

    });
  }

  setValue(attr, value) {
    this.setState({
      [attr]: value
    });
  }

  render() {
    const {
      acr_values,
      auth_protocol,
      claims,
      code_challenge_method,
      code_challenge,
      grant_type,
      nonce,
      response_mode,
      response_type,
      scope,
      state,
      token_endpoint_auth_method
    } = this.state;

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <fieldset className="form-header">
          <h2>Settings</h2>
        </fieldset>

        <fieldset>
          <InfoLabel label="Authorization protocol" toolTip={authorizationProtocol()}/>
          <ReactSelect
            value={auth_protocol}
            options={["OpenID", "Oauth2"]}
            onChange={val => this.setValue("auth_protocol", val)}
          />
        </fieldset>

        <GrantType
          value={grant_type}
          options={this.props.config.grant_types_supported}
          onChange={val => this.setValue("grant_type", val)}
          moderators={{ auth_protocol }}
        />

        <div className="field-block">
          <ResponseType
            value={response_type}
            options={this.props.config.response_types_supported}
            onChange={val => this.setValue("response_type", val)}
            moderators={{ auth_protocol, grant_type }}
          />

          <ResponseMode
            value={response_mode}
            options={this.props.config.response_modes_supported}
            onChange={val => this.setValue("response_mode", val)}
            moderators={{ grant_type }}
          />
        </div>

        <Scopes
          value={scope}
          options={this.props.config.scopes_supported}
          onChange={val => this.setValue("scope", val)}
          moderators={{ auth_protocol }}
        />

        <fieldset>
          <InfoLabel label="Token endpoint authentication" toolTip={tokenEndpointAuthentication()}/>
          <ReactSelect
            value={token_endpoint_auth_method}
            options={this.props.config.token_endpoint_auth_methods_supported}
            onChange={val => this.setValue("token_endpoint_auth_method", val)}
          />
        </fieldset>

        <fieldset>
          <label>Requested claims</label>
          <ReactSelect
            value={claims}
            options={this.props.config.claims_supported.filter(claim => excludedClaims.includes(claim))}
            onChange={val => this.setValue("claims", val)}
            isMulti
          />
        </fieldset>

        <div className="field-block">
          <CodeChallenge
            codeChallenge={{
              value: code_challenge,
              onChange: val => this.setValue("code_challenge", val)
            }}
            codeChallengeMethod={{
              value: code_challenge_method,
              options: this.props.config.code_challenge_methods_supported,
              onChange: val => this.setValue("code_challenge_method", val)
            }}
            moderators={{ grant_type }}
          />
        </div>

        <div className="field-block">
          <fieldset>
            <label>State</label>
            <input
              value={state}
              onChange={e => this.setValue("state", e.target.value)}
            />
          </fieldset>

          <fieldset>
            <label>Nonce</label>
            <input
              value={nonce}
              onChange={e => this.setValue("nonce", e.target.value)}
            />
          </fieldset>
        </div>
        <fieldset>
          <label>ACR values</label>
          <ReactSelect
            value={acr_values}
            options={this.props.config.acr_values_supported}
            onChange={val => this.setValue("acr_values", val)}
            isMulti
          />
        </fieldset>

        <fieldset>
          <button type="submit" className="button blue">
            Submit
          </button>
        </fieldset>
      </form>
    );
  }
}
