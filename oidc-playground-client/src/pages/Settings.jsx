import React, { useState, useEffect } from "react";
import "./App.scss";
import { ReactSelect } from "components";
import {
  GrantType,
  ResponseType,
  ResponseMode,
  Scopes,
  CodeChallenge
} from "components/settings";
import { discovery } from "api";

export function Settings() {
  const [loading, setLoading] = useState(true);

  const [config, setConfig] = useState({
    authorization_endpoint: "",
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
  const [claims, setClaims] = useState([]);
  const [code_challenge_method, setCodeChallengeMethod] = useState("");
  const [code_challenge, setCodeChallenge] = useState("");
  const [grant_type, setGrantType] = useState("");
  const [response_mode, setResponseMode] = useState("");
  const [response_type, setResponseType] = useState("");
  const [scopes, setScopes] = useState([]);
  const [token_endpoint, setTokenEndpoint] = useState("client_secret_basic");

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

  function handleSubmit(e) {
    e.preventDefault();
    console.log("SUBMIT");
  }

  if (loading) return null;

  return (
    <div className="settings">
      <h2>Settings</h2>
      <form onSubmit={e => handleSubmit(e)}>
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
          />
        </fieldset>

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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
