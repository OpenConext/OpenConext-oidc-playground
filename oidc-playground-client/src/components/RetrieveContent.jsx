import React from "react";
import { observer } from "mobx-react";
import store from "store";
import { postIntrospect, postUserinfo } from "api";

export const RetrieveContent = observer(props => {
  const accessToken = store.normalFlowAccessToken || store.hybridFlowAccessToken;

  const body = {
    token: accessToken,
    introspect_endpoint: store.config.introspect_endpoint,
    userinfo_endpoint: store.config.userinfo_endpoint
  };

  const handleIntrospect = () => {
    postIntrospect(body).then(res => (store.request = { ...res }));
  };

  const handleUserInfo = () => {
    postUserinfo(body).then(res => (store.request = { ...res }));
  };

  return (
    <form>
      <fieldset className="form-header">
        <h2>Retrieve content</h2>
      </fieldset>

      <fieldset className="button-group">
        <button
          type="button"
          className="button"
          disabled={!(store.config.introspect_endpoint && accessToken)}
          onClick={handleIntrospect}
        >
          Introspect
        </button>

        <button
          type="button"
          className="button"
          disabled={!(store.config.userinfo_endpoint && accessToken)}
          onClick={handleUserInfo}
        >
          Userinfo
        </button>
      </fieldset>
    </form>
  );
});
