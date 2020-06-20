import React from "react";
import {CheckBox, InfoLabel, ReactSelect} from "components";
import {codeChallengeMethodT, codeChallengeT, codeVerifierT, omitAuthenticationT, pkceT} from "./Tooltips";
import "./CodeChallenge.scss";

export function CodeChallenge(props) {
  const {moderators, codeVerifier, codeChallenge, pkce, togglePkce, omitAuthentication, toggleOmitAuthentication} = props;

  if (moderators.grant_type !== "authorization_code") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox
        value={pkce}
        name="code-challenge"
        disabled={moderators.frontChannelTokenRequest}
        label="Proof key for Code Exchange (PKCE)"
        toolTip={pkceT()}
        onChange={togglePkce}
      />

      {pkce && (
        <div className="code-challenge">
          <fieldset>
            <InfoLabel label="Code verifier" toolTip={codeVerifierT()}/>
            <input disabled value={codeVerifier}/>
          </fieldset>

          <fieldset>
            <InfoLabel label="Code challenge method" toolTip={codeChallengeMethodT()}/>
            <ReactSelect {...props.codeChallengeMethod} />
          </fieldset>

          <fieldset>
            <InfoLabel label="Code challenge" toolTip={codeChallengeT()}/>
            <input disabled value={codeChallenge}/>
          </fieldset>

          <fieldset>
            <CheckBox
              value={omitAuthentication}
              name="omit-authentication"
              label="Omit client credentials"
              toolTip={omitAuthenticationT()}
              disabled={moderators.frontChannelTokenRequest}
              onChange={toggleOmitAuthentication}
            />
          </fieldset>
        </div>
      )}
    </fieldset>
  );
}
