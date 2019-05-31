import React from "react";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./InfoLabel.scss";

//info-circle
export function InfoLabel({label, toolTip}) {
  const toolTipHtml = <div className="inner-tooltip"><h3>{label}</h3><span>{toolTip}</span></div>;
  return (
    <div className="info-label">
      <label>{label}</label>
      <span className="tool-tip-section">
        <span data-tip data-for={label}>
          <FontAwesomeIcon icon="question"/>
        </span>
        <ReactTooltip id={label} type="light" effect="solid" data-html={true} place="right">
          {toolTipHtml}
        </ReactTooltip>
      </span>

    </div>
  );
}
