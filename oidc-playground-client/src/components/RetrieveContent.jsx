import React from "react";
import { postIntrospect, postUserinfo } from "../api";

export function RetrieveContent(props) {
  const handleIntrospect = () => {
    postIntrospect();
  };

  const handleUserInfo = () => {
    postUserinfo();
  };

  return (
    <form>
      <fieldset className="form-header">
        <h2>Retrieve content</h2>
      </fieldset>
      <fieldset className="button-group">
        <button
          type="button"
          className="button introspect"
          disabled={!props.introspect_endpoint}
          onClick={handleIntrospect}
        >
          Introspect
        </button>

        <button type="button" className="button userinfo" disabled={!props.userinfo_endpoint} onClick={handleUserInfo}>
          Userinfo
        </button>
      </fieldset>
    </form>
  );
}
