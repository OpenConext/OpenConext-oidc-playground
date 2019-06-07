import React from "react";
import { CheckBox } from "components";
import { signedJWTT } from "components/settings/Tooltips";

export const SignedJWT = props => {
  if (props.moderators.auth_protocol === "Oauth2") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox {...props} name="signedJWT" label="Encode parameters in signed JWT" toolTip={signedJWTT()} />
    </fieldset>
  );
};
