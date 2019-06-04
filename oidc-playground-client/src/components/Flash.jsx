import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Flash.scss";

export function Flash({ message, onClose }) {
  const className = message ? "flash active" : "flash";

  return (
    <div className={className}>
      <p>{message}</p>
      <button className="close" onClick={onClose}>
        <FontAwesomeIcon icon="times-circle" />
      </button>
    </div>
  );
}
