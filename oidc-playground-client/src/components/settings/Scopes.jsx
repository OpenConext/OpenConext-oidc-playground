import React from "react";
import {ReactSelect} from "components";
import {scopesT} from "./Tooltips";
import {InfoLabel} from "../InfoLabel";

export function Scopes(props) {
  const {options, moderators} = props;

  const authIsOpenId = moderators.auth_protocol === "OpenID";

  const fixedValues = authIsOpenId ? ["openid"] : [];

  return (
    <fieldset>
      <InfoLabel label="Scopes" toolTip={scopesT()}/>
      <ReactSelect
        {...props}
        options={options}
        className="select-scopes"
        fixedValues={fixedValues}
        isMulti
        freeFormat
      />
    </fieldset>
  );
}
