import React from "react";
import { InfoLabel, ReactSelect } from "components";
import { acrValuesT } from "components/settings/Tooltips";

export const AcrValues = ({ moderators, ...rest }) => {
  if (moderators.auth_protocol === "Oauth2") {
    return null;
  }

  return (
    <fieldset>
      <InfoLabel label="ACR values" toolTip={acrValuesT()} />
      <ReactSelect {...rest} isMulti />
    </fieldset>
  );
};
