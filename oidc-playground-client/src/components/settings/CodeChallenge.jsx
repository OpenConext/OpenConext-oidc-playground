import React from "react";
import { ReactSelect, CheckBox, InfoLabel } from "components";
import { codeChallengeMethodT, codeChallengeT, codeVerifierT, pkceT } from "./Tooltips";
import "./CodeChallenge.scss";

export function CodeChallenge(props) {
  const { moderators, codeVerifier, codeChallenge, pkce, togglePkce } = props;

  if (moderators.grant_type !== "authorization_code") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox
        value={pkce}
        name="code-challenge"
        label="Proof key for Code Exchange (PKCE)"
        toolTip={pkceT()}
        onChange={togglePkce}
      />

      {pkce && (
        <div className="code-challenge">
          <fieldset>
            <InfoLabel label="Code verifier" toolTip={codeVerifierT()} />
            <input disabled value={codeVerifier} />
          </fieldset>

          <fieldset>
            <InfoLabel label="Code challenge method" toolTip={codeChallengeMethodT()} />
            <ReactSelect {...props.codeChallengeMethod} />
          </fieldset>

          <fieldset>
            <InfoLabel label="Code challenge" toolTip={codeChallengeT()} />
            <input disabled value={codeChallenge} />
          </fieldset>
        </div>
      )}
    </fieldset>
  );
}
