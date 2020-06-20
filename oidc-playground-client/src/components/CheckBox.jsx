import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {InfoLabel} from "components";
import "./CheckBox.scss";

export const CheckBox = ({name, value, onChange, disabled = false, label, toolTip}) => (
  <div className="checkbox">
    <input type="checkbox" id={name} name={name} checked={value}
    disabled={disabled} onChange={e => onChange(e.target.checked)}/>

    <label htmlFor={name} className={`label-as-checkbox ${disabled ? 'disabled' : ''}`}>
      <span tabIndex="0">
        <FontAwesomeIcon icon="check"/>
      </span>
    </label>

    <InfoLabel label={label} toolTip={toolTip} htmlFor={name} className={`${disabled ? 'disabled' : 'checkbox'}`}/>
  </div>
);
