import React from "react";
import { CheckBox } from "components";
import { forceAuthenticationT } from "components/settings/Tooltips";

export const ForceAuthentication = props => {

  return (
    <fieldset>
      <CheckBox {...props} name="forceAuthentication" label="Force authentication" toolTip={forceAuthenticationT()} />
    </fieldset>
  );
};
