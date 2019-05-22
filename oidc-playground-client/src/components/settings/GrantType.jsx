import React from "react";
import { ReactSelect } from "components";

export function GrantType(props) {
  function sanitizeOptions(options) {
    return options.filter(opt => opt !== "refresh_token");
  }

  return (
    <fieldset>
      <label>Grant type</label>
      <ReactSelect {...props} options={sanitizeOptions(props.options)} />
    </fieldset>
  );
}
