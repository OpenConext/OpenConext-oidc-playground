import React from "react";
import { postIntrospect, postUserinfo } from "../api";

export function RetrieveContent(props) {
  const handleIntrospect = () => {
    const body = {
      token: props.accessToken,
      introspect_endpoint: props.introspect_endpoint
    };

    console.log(body);

    postIntrospect(body)
      .then(res => console.log("res", res))
      .catch(err => console.log("catch", err));
  };

  const handleUserInfo = () => {
    const body = {
      token: props.accessToken,
      userinfo_endpoint: props.userinfo_endpoint
    };

    console.log(body);

    postUserinfo(body)
      .then(res => console.log("res", res))
      .catch(err => console.log("catch", err));
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
