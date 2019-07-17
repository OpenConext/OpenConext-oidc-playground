import React from "react";
import { ReactSelect } from "components";
import {responseModeT} from "./Tooltips";
import {InfoLabel} from "../InfoLabel";

export function ResponseMode(props) {

  return (
    <fieldset>
      <InfoLabel label="Response mode" toolTip={responseModeT()} />
      <ReactSelect {...props} />
    </fieldset>
  );
}
