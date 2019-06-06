import React from "react";
import { InfoLabel, ReactSelect } from "components";
import { acrValuesT } from "components/settings/Tooltips";

export const AcrValues = props => (
  <fieldset>
    <InfoLabel label="ACR values" toolTip={acrValuesT()} />
    <ReactSelect {...props} isMulti />
  </fieldset>
);
