import React from "react";
import { CheckBox } from "components";
import { forceConsentT } from "components/settings/Tooltips";

export const ForceConsent = props => {

  return (
    <fieldset>
      <CheckBox {...props} name="forceConsent" label="Force consent" toolTip={forceConsentT()} />
    </fieldset>
  );
};
