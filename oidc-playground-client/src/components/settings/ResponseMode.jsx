import React from "react";
import { ReactSelect } from "components";

export function ResponseMode(props) {
  if (props.moderators.grant_type !== "implicit") {
    return null;
  }

  return (
    <fieldset>
      <label>Response mode</label>
      <ReactSelect {...props} />
    </fieldset>
  );
}
