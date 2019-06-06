import React from "react";
import { observer } from "mobx-react";
import store from "store";
import { ReactSelect, InfoLabel } from "components";
import {
  AcrValues,
  Claims,
  CodeChallenge,
  GrantType,
  ResponseMode,
  ResponseType,
  Scopes,
  TokenEndpointAuthMethod
} from "components/settings";
import { authorizationProtocolT, nonceT, stateT } from "./settings/Tooltips";

export const SettingsForm = observer(props => {
  const { onSubmit, onChange } = props;

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
  } = props.form;

  return (
    <form className="block" onSubmit={onSubmit}>
      <fieldset>
        <InfoLabel label="Authorization protocol" toolTip={authorizationProtocolT()} />
        <ReactSelect
          value={auth_protocol}
          options={["OpenID", "Oauth2"]}
          onChange={val => onChange("auth_protocol", val)}
        />
      </fieldset>

      <GrantType
        value={grant_type}
        options={store.config.grant_types_supported}
        onChange={val => onChange("grant_type", val)}
        moderators={{ auth_protocol }}
      />

      <div className="field-block">
        <ResponseType
          value={response_type}
          options={store.config.response_types_supported}
          onChange={val => onChange("response_type", val)}
          moderators={{ auth_protocol, grant_type }}
        />

        <ResponseMode
          value={response_mode}
          options={store.config.response_modes_supported}
          onChange={val => onChange("response_mode", val)}
          moderators={{ grant_type }}
        />
      </div>

      <Scopes
        value={scope}
        options={store.config.scopes_supported}
        onChange={val => onChange("scope", val)}
        moderators={{ auth_protocol }}
      />

      <TokenEndpointAuthMethod
        value={token_endpoint_auth_method}
        options={store.config.token_endpoint_auth_methods_supported}
        onChange={val => onChange("token_endpoint_auth_method", val)}
        moderators={{ grant_type }}
      />

      <Claims
        value={claims}
        options={store.config.claims_supported}
        onChange={val => onChange("claims", val)}
        moderators={{ auth_protocol }}
      />

      <div className="field-block">
        <fieldset>
          <InfoLabel label="State" toolTip={stateT()} />
          <input value={state} onChange={e => onChange("state", e.target.value)} />
        </fieldset>

        <fieldset>
          <InfoLabel label="Nonce" toolTip={nonceT()} />
          <input value={nonce} onChange={e => onChange("nonce", e.target.value)} />
        </fieldset>
      </div>

      <AcrValues
        value={acr_values}
        options={store.config.acr_values_supported}
        onChange={val => onChange("acr_values", val)}
        moderators={{ auth_protocol }}
      />

      <CodeChallenge
        codeChallenge={code_challenge}
        codeVerifier={code_verifier}
        pkce={pkce}
        togglePkce={() => onChange("pkce", !pkce)}
        codeChallengeMethod={{
          value: code_challenge_method,
          options: store.config.code_challenge_methods_supported,
          onChange: val => onChange("code_challenge_method", val, this.componentDidMount)
        }}
        moderators={{ grant_type }}
      />

      <fieldset>
        <button type="submit" className="button blue">
          Submit
        </button>
      </fieldset>
    </form>
  );
});
