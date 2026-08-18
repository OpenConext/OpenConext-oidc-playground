import React from "react";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import "./InfoLabel.scss";

export function InfoLabel({label, toolTip, htmlFor, className = "", onClick = () => true, copyToClipBoardText = undefined}) {
  const toolTipHtml = (
    <div className="inner-tooltip">
      <h3>{label.replace(/>/g, "")}</h3>
      <span>{toolTip}</span>
    </div>
  );

  return (
    <div className={`info-label ${className}`}>
      <label className={className} onClick={onClick} htmlFor={htmlFor}>
        {label}
      </label>
      <span className="tool-tip-section">
        <span className="tool-tip-data-container" data-tooltip-id={label}>
          <FontAwesomeIcon icon="question"/>
        </span>
        <Tooltip id={label} variant="light" place="right" className="info-tooltip" classNameArrow="info-tooltip-arrow">
          {toolTipHtml}
        </Tooltip>
      </span>
      {copyToClipBoardText && <CopyToClipboard text={copyToClipBoardText}>
        <section className="copy-to-clipboard">
          <FontAwesomeIcon icon="copy" onClick={e => {
            const me = e.target.parentElement;
            me.classList.add("copied");
            setTimeout(() => me.classList.remove("copied"), 1250);
          }}/>

        </section>
      </CopyToClipboard>}
    </div>
  );
}
