import React from "react";
import { ReactSelect } from "components";

export function CodeChallenge(props) {
  if (props.moderators.grantType !== "authorization_code") {
    props.codeChallenge.onChange("");
    props.codeChallengeMethod.onChange("");

    return null;
  }

  return (
    <>
      <fieldset>
        <label>Code challenge</label>
        <input
          {...props.codeChallenge}
          onChange={e => props.codeChallenge.onChange(e.target.value)}
        />
      </fieldset>

      <fieldset>
        <label>Code challenge method</label>
        <ReactSelect {...props.codeChallengeMethod} />
      </fieldset>
    </>
  );
}
