import React, { useEffect } from "react";
import { ReactSelect } from "components";
import { isEmpty } from "utils/Utils";

export function ResponseMode(props) {
  const { moderators, value, onChange } = props;

  useEffect(
    () => {
      if (moderators.grant_type === "implicit") {
        if (isEmpty(value)) {
          onChange("fragment");
        }
        return;
      }

      onChange("");
    },
    [moderators.grant_type, value, onChange]
  );

  if (moderators.grant_type !== "implicit") {
    return null;
  }

  return (
    <fieldset>
      <label>Response mode</label>
      <ReactSelect {...props} />
    </fieldset>
  );
}
