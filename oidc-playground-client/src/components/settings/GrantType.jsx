import React from "react";
import { ReactSelect } from "components";

function sanitizeOptions(options) {
  return options.filter(opt => opt !== "refresh_token");
}

export function GrantType(props) {
  return (
    <fieldset>
      <label>Grant type</label>
      <ReactSelect
        {...props}
        className="select-grant-type"
        options={sanitizeOptions(props.options)}
      />
    </fieldset>
  );
}
