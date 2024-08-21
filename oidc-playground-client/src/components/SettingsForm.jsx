import React from "react";
import {observer} from "mobx-react";
import store from "store";
import {InfoLabel, ReactSelect} from "components";
import {
    AcrValues,
    Claims,
    CodeChallenge,
    ForceAuthentication,
    ForceConsent,
    FrontChannelTokenRequest,
    GrantType,
    ResponseMode,
    ResponseType,
    Scopes,
    SignedJWT,
    TokenEndpointAuthMethod
} from "components/settings";
import {authorizationProtocolT, loginHintT, nonceT, stateT} from "./settings/Tooltips";

export const SettingsForm = observer(props => {
  const {onSubmit, onChange} = props;

  const {
    acr_values,
    auth_protocol,
    claims,
    code_challenge_method,
    code_challenge,
    code_verifier,
    forceAuthentication,
    forceConsent,
    frontChannelTokenRequest,
    grant_type,
    login_hint,
    nonce,
    pkce,
    response_mode,
    response_type,
    scope,
    signedJWT,
    state,
    token_endpoint_auth_method,
    omitAuthentication
  } = props.form;

    const deviceCodeFlow = grant_type === "urn:ietf:params:oauth:grant-type:device_code";

  return (
    <form className="block" onSubmit={onSubmit}>
      <fieldset>
        <InfoLabel label="Authorization protocol" toolTip={authorizationProtocolT()}/>
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
        moderators={{auth_protocol, frontChannelTokenRequest}}
      />
        {!deviceCodeFlow &&
      <div className="field-block">

          <ResponseType
              value={response_type}
              options={store.config.response_types_supported}
              onChange={val => onChange("response_type", val)}
              moderators={{auth_protocol, grant_type}}
          />
          <ResponseMode
              value={response_mode}
              options={store.config.response_modes_supported}
              onChange={val => onChange("response_mode", val)}
              moderators={{frontChannelTokenRequest}}
          />
      </div>}

      <Scopes
        value={scope}
        options={store.config.scopes_supported}
        onChange={val => onChange("scope", val)}
        moderators={{auth_protocol}}
      />
        {!deviceCodeFlow &&
            <TokenEndpointAuthMethod
                value={token_endpoint_auth_method}
                options={store.config.token_endpoint_auth_methods_supported}
                onChange={val => onChange("token_endpoint_auth_method", val)}
                moderators={{grant_type, frontChannelTokenRequest}}
            />}
        {!deviceCodeFlow &&
      <Claims
        value={claims}
        options={store.config.claims_supported}
        onChange={val => onChange("claims", val)}
        moderators={{auth_protocol, grant_type}}
      />}
        {!deviceCodeFlow &&
            <div className="field-block">

                <fieldset>
                    <InfoLabel label="State" toolTip={stateT()}/>
                    <input value={state} onChange={e => onChange("state", e.target.value)}/>
                </fieldset>

                <fieldset>
                    <InfoLabel label="Nonce" toolTip={nonceT()}/>
                    <input value={nonce} onChange={e => onChange("nonce", e.target.value)}/>
                </fieldset>
            </div>}

            <div className="field-block">
                <fieldset>
                    <InfoLabel label="Login Hint" toolTip={loginHintT()}/>
                    <input value={login_hint} onChange={e => onChange("login_hint", e.target.value)}/>
                </fieldset>
            </div>

      <AcrValues
        value={acr_values}
        options={store.config.acr_values_supported}
        onChange={val => onChange("acr_values", val)}
        moderators={{auth_protocol}}
      />

      <CodeChallenge
        codeChallenge={code_challenge}
        codeVerifier={code_verifier}
        pkce={pkce}
        togglePkce={() => onChange("pkce", !pkce)}
        omitAuthentication={omitAuthentication}
        toggleOmitAuthentication={() => onChange("omitAuthentication", !omitAuthentication)}
        codeChallengeMethod={{
          value: code_challenge_method,
          options: store.config.code_challenge_methods_supported,
          onChange: val => onChange("code_challenge_method", val)
        }}
        moderators={{grant_type, frontChannelTokenRequest}}
      />

      <ForceAuthentication
        value={forceAuthentication}
        onChange={val => onChange("forceAuthentication", val)}
        moderators={{grant_type}}
      />

        {!deviceCodeFlow &&
            <ForceConsent
                value={forceConsent}
                onChange={val => onChange("forceConsent", val)}
                moderators={{grant_type}}
            />}

        {!deviceCodeFlow &&
            <FrontChannelTokenRequest value={frontChannelTokenRequest}
                                      onChange={val => onChange("frontChannelTokenRequest", val)}
                                      moderators={{grant_type}}
            />}

        {!deviceCodeFlow &&
            <SignedJWT value={signedJWT}
                       onChange={val => onChange("signedJWT", val)}
                       moderators={{auth_protocol, frontChannelTokenRequest}}/>}

        <fieldset>
            <button type="reset" className="button"
                onClick={() => document.location.replace("/")}>
                Reset
        </button>
        <button type="submit" className="button blue">
            Submit
            </button>
        </fieldset>
    </form>
  );
});
