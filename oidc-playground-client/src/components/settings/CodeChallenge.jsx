import React, { useEffect } from "react";
import { ReactSelect } from "components";

export function CodeChallenge(props) {
  const { moderators, codeChallenge, codeChallengeMethod } = props;

  useEffect(
    () => {
      if (moderators.grant_type !== "authorization_code") {
        codeChallenge.onChange("");
        codeChallengeMethod.onChange("");
      }
    },
    [moderators.grant_type, codeChallenge, codeChallengeMethod]
  );

  if (moderators.grant_type !== "authorization_code") {
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
