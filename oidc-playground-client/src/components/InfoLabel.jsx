import React from "react";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./InfoLabel.scss";

export function InfoLabel({label, toolTip, className = "", onClick= () => true}) {
  const toolTipHtml = <div className="inner-tooltip"><h3>{label.replace(/>/g, "")}</h3><span>{toolTip}</span></div>;
  return (
    <div className={`info-label ${className}`}>
      <label className={className} onClick={onClick}>{label}</label>
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
