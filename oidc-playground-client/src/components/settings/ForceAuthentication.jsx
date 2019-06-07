import React from "react";
import { CheckBox } from "components";

export const ForceAuthentication = props => {
  if (props.moderators.grant_type === "client_credentials") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox name="forceAuthentication" label="Force authentication" {...props} />
    </fieldset>
  );
};
