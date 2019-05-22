import React, { useState, useEffect } from "react";
import "./App.scss";
import { ReactSelect } from "components";
import { GrantType, ResponseType, ResponseMode } from "components/settings";
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

  const [authProtocol, setAuthProtocol] = useState("OpenID");
  const [grantType, setGrantType] = useState("");
  const [responseType, setResponseType] = useState("");
  const [responseMode, setResponseMode] = useState("");
  const [scopes, setScopes] = useState([]);
  const [tokenEndpoint, setTokenEndpoint] = useState("client_secret_basic");
  const [claims, setClaims] = useState([]);
  const [codeChallenge, setCodeChallenge] = useState("");
  const [codeChallengeMethod, setCodeChallengeMethod] = useState("");

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
            value={authProtocol}
            options={["OpenID", "Oauth2"]}
            onChange={setAuthProtocol}
          />
        </fieldset>

        <GrantType
          value={grantType}
          options={config.grant_types_supported}
          onChange={setGrantType}
        />

        <ResponseType
          value={responseType}
          options={config.response_types_supported}
          onChange={setResponseType}
          moderators={{ authProtocol, grantType }}
        />

        <ResponseMode
          value={responseMode}
          options={config.response_modes_supported}
          onChange={setResponseMode}
          moderators={{ grantType }}
        />

        <fieldset>
          <label>Scopes</label>
          <ReactSelect
            value={scopes}
            options={config.scopes_supported}
            onChange={setScopes}
            isMulti
            freeFormat
          />
        </fieldset>

        <fieldset>
          <label>Token endpoint</label>
          <ReactSelect
            value={tokenEndpoint}
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

        <fieldset>
          <label>Code challenge</label>
          <input
            value={codeChallenge}
            onChange={e => setCodeChallenge(e.target.value)}
          />
        </fieldset>

        <fieldset>
          <label>Code challenge method</label>
          <ReactSelect
            value={codeChallengeMethod}
            options={config.code_challenge_methods_supported}
            onChange={setCodeChallengeMethod}
          />
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
