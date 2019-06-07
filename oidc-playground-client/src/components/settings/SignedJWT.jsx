import React from "react";
import { CheckBox } from "components";

export const SignedJWT = props => {
  if (props.moderators.auth_protocol === "Oauth2") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox name="signedJWT" label="Encode parameters in signed JWT" {...props} />
    </fieldset>
  );
};
