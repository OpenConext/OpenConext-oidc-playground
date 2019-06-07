import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CheckBox.scss";

export const CheckBox = ({ name, value, onChange, label }) => (
  <div className="checkbox">
    <input type="checkbox" id={name} name={name} checked={value} onChange={e => onChange(e.target.checked)} />
    <label htmlFor={name}>
      <span tabIndex="0">
        <FontAwesomeIcon icon="check" />
      </span>
    </label>

    <label htmlFor={name} className="info">
      {label}
    </label>
  </div>
);
