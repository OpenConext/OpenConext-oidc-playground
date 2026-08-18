import {ReactSelect} from "components";
import {scopesT} from "./Tooltips";
import {InfoLabel} from "../InfoLabel";

export function computeFixedValues(moderators) {
  const authIsOpenId = moderators.auth_protocol === "OpenID";

  return authIsOpenId ? ["openid"] : [];
}

export function Scopes(props) {
  const {options, moderators} = props;

  const fixedValues = computeFixedValues(moderators);

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
