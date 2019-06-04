import React from "react";
import { postIntrospect, postUserinfo } from "../api";

export function RetrieveContent(props) {
  const handleIntrospect = () => {
    const body = {
      token: props.accessToken,
      introspect_endpoint: props.introspect_endpoint
    };

    postIntrospect(body).then(res => props.resultForDisplay(res));
  };

  const handleUserInfo = () => {
    const body = {
      token: props.accessToken,
      userinfo_endpoint: props.userinfo_endpoint
    };

    postUserinfo(body).then(res => props.resultForDisplay(res));
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
          disabled={!(props.introspect_endpoint && props.accessToken)}
          onClick={handleIntrospect}
        >
          Introspect
        </button>

        <button
          type="button"
          className="button userinfo"
          disabled={!(props.userinfo_endpoint && props.accessToken)}
          onClick={handleUserInfo}
        >
          Userinfo
        </button>
      </fieldset>
    </form>
  );
}
