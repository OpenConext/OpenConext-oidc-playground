import React, { useEffect, useState } from "react";
import "./App.scss";
import { ReactSelect, RetrieveContent } from "components";
import {
  CodeChallenge,
  GrantType,
  ResponseMode,
  ResponseType,
  Scopes
} from "components/settings";
import { discovery, formPost } from "api";

export function Settings() {
  const [loading, setLoading] = useState(true);

  const [config, setConfig] = useState({
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
  });

  const [auth_protocol, setAuthProtocol] = useState("OpenID");
  const [acr_values, setAcrValues] = useState([]);
  const [claims, setClaims] = useState([]);
  const [code_challenge_method, setCodeChallengeMethod] = useState("");
  const [code_challenge, setCodeChallenge] = useState("");
  const [grant_type, setGrantType] = useState("");
  const [response_mode, setResponseMode] = useState("");
  const [response_type, setResponseType] = useState("");
  const [scopes, setScopes] = useState([]);
  const [token_endpoint, setTokenEndpoint] = useState("client_secret_basic");
  const [state, setState] = useState("example");
  const [nonce, setNonce] = useState("example");

  useEffect(() => {
    if (window.location.href.indexOf("error") > -1) {
      setLoading(false);
    } else {
      discovery().then(res => {
        setLoading(false);
        setConfig(res);
      });
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    const body = {
      ...config,
      auth_protocol,
      acr_values: acr_values.join(" "),
      claims,
      code_challenge_method,
      code_challenge,
      grant_type,
      response_mode,
      response_type,
      scopes,
      state,
      nonce
    };

    formPost(body).then(json => {
      // window.location.replace(json.url);
      //TODO use the url for a redirect
      console.log(json.url);
    });
  };

  if (loading) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset className="form-header">
          <h2>Settings</h2>
        </fieldset>

        <fieldset>
          <label>Authorization protocol</label>
          <ReactSelect
            value={auth_protocol}
            options={["OpenID", "Oauth2"]}
            onChange={setAuthProtocol}
          />
        </fieldset>

        <GrantType
          value={grant_type}
          options={config.grant_types_supported}
          onChange={setGrantType}
        />

        <div className="field-block">
          <ResponseType
            value={response_type}
            options={config.response_types_supported}
            onChange={setResponseType}
            moderators={{ auth_protocol, grant_type }}
          />

          <ResponseMode
            value={response_mode}
            options={config.response_modes_supported}
            onChange={setResponseMode}
            moderators={{ grant_type }}
          />
        </div>

        <Scopes
          value={scopes}
          options={config.scopes_supported}
          onChange={setScopes}
          moderators={{ auth_protocol }}
        />

        <fieldset>
          <label>Token endpoint</label>
          <ReactSelect
            value={token_endpoint}
            options={config.token_endpoint_auth_methods_supported}
            onChange={setTokenEndpoint}
          />
        </fieldset>

        <fieldset>
          <label>Claims</label>
          <ReactSelect
            value={claims}
            options={config.claims_supported}
            onChange={setClaims}
            isMulti
          />
        </fieldset>

        <div className="field-block">
          <CodeChallenge
            codeChallenge={{
              value: code_challenge,
              onChange: setCodeChallenge
            }}
            codeChallengeMethod={{
              value: code_challenge_method,
              options: config.code_challenge_methods_supported,
              onChange: setCodeChallengeMethod
            }}
            moderators={{ grant_type }}
          />
        </div>

        <div className="field-block">
          <fieldset>
            <label>State</label>
            <input value={state} onChange={e => setState(e.target.value)} />
          </fieldset>

          <fieldset>
            <label>Nonce</label>
            <input value={nonce} onChange={e => setNonce(e.target.value)} />
          </fieldset>
        </div>

        <fieldset>
          <label>ACR values</label>
          <ReactSelect
            value={acr_values}
            options={config.acr_values_supported}
            onChange={setAcrValues}
            isMulti
          />
        </fieldset>

        <fieldset>
          <button type="submit" className="button blue">
            Submit
          </button>
        </fieldset>
      </form>

      <form>
        <fieldset className="form-header">
          <h2>Retrieve content</h2>
        </fieldset>

        <RetrieveContent
          token="access_token_value"
          introspect_endpoint={config.introspect_endpoint}
          userinfo_endpoint={config.userinfo_endpoint}
        />
      </form>
    </div>
  );
}
