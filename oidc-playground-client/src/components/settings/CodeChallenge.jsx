import React from "react";
import { ReactSelect } from "components";
import { codeChallengeMethodT, codeChallengeT, codeVerifierT, pkceT } from "./Tooltips";
import { InfoLabel } from "../InfoLabel";
import "./CodeChallenge.scss";

export function CodeChallenge(props) {
  const { moderators, codeVerifier, codeChallenge, pkce, togglePkce } = props;

  if (moderators.grant_type !== "authorization_code") {
    return null;
  }

  const direction = pkce ? "<<" : ">>";
  return (
    <div className="code-challenge">
      <InfoLabel label={`Proof Key for Code Exchange (PKCE) ${direction}`}
                 toolTip={pkceT()}
                 className="toggle-title"
                 onClick={togglePkce}/>
      {pkce && <>
        <fieldset>
          <InfoLabel label="Code verifier" toolTip={codeVerifierT()}/>
          <input readOnly={true} value={codeVerifier}/>
        </fieldset>

        <fieldset>
          <InfoLabel label="Code challenge method" toolTip={codeChallengeMethodT()}/>
          <ReactSelect {...props.codeChallengeMethod} />
        </fieldset>

        <fieldset>
          <InfoLabel label="Code challenge" toolTip={codeChallengeT()}/>
          <input readOnly={true} value={codeChallenge}/>
        </fieldset>
      </>}

    </div>
  );
}
