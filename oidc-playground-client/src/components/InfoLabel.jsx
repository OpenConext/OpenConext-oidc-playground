import React from "react";
import ReactTooltip from "react-tooltip";
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
        <span data-tip data-for={label}>
          <FontAwesomeIcon icon="question"/>
        </span>
        <ReactTooltip id={label} type="light" effect="solid" data-html={true} place="right">
          {toolTipHtml}
        </ReactTooltip>
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
