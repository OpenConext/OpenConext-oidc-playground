import React from "react";
import { ReactSelect } from "components";
import { isEmpty } from "utils/Utils";

export function ResponseMode(props) {
  if (props.moderators.grant_type !== "implicit") {
    props.onChange("");
    return null;
  }

  if (isEmpty(props.value)) {
    props.onChange("fragment");
  }

  return (
    <fieldset>
      <label>Response mode</label>
      <ReactSelect {...props} />
    </fieldset>
  );
}
