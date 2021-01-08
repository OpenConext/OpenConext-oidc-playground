import React, {useEffect} from "react";
import {ReactSelect} from "components";
import {scopesT} from "./Tooltips";
import {InfoLabel} from "../InfoLabel";

export function Scopes(props) {
  const {value, options, moderators, onChange} = props;

  const authIsOpenId = moderators.auth_protocol === "OpenID";
  const hasOpenIdScope = value.includes("openid");

  const fixedValues = authIsOpenId ? ["openid"] : [];
  const sanitizeOptions = () => (authIsOpenId ? options : options.filter(opt => opt !== "openid"));

  useEffect(() => {
    if (authIsOpenId && !hasOpenIdScope) {
      onChange(["openid"].concat(value));
    }

    if (!authIsOpenId && hasOpenIdScope) {
      onChange(value.filter(val => val !== "openid"));
    }
  });

  return (
    <fieldset>
      <InfoLabel label="Scopes" toolTip={scopesT()}/>
      <ReactSelect
        {...props}
        options={sanitizeOptions()}
        className="select-scopes"
        fixedValues={fixedValues}
        isMulti
        freeFormat
      />
    </fieldset>
  );
}
