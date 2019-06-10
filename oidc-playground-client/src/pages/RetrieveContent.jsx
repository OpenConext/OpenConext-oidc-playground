import React from "react";
import {observer} from "mobx-react";
import store from "store";
import {postIntrospect, postUserinfo} from "api";

export const RetrieveContent = observer(props => {
  const accessToken = store.normalFlowAccessToken || store.hybridFlowAccessToken || ((store.request || {}).result || {}).access_token;

  const body = {
    token: accessToken,
    introspect_endpoint: store.config.introspect_endpoint,
    userinfo_endpoint: store.config.userinfo_endpoint
  };

  const handleResult = res => {
    store.request = res;
    store.activeTab = "Request";
  };

  const handleIntrospect = () => {
    postIntrospect(body).then(handleResult);
  };

  const handleUserInfo = () => {
    postUserinfo(body).then(handleResult);
  };

  return (
    <>
      <div className="tabs">
        <div className="tab active single-tab">
          <h2>Retrieve content</h2>
        </div>
      </div>
      <div className="block retrieve-content">
        <div className="button-group">
          <button
            type="button"
            className="button introspect"
            disabled={!(store.config.introspect_endpoint && accessToken)}
            onClick={handleIntrospect}
          >
            Introspect
          </button>

          <button
            type="button"
            className="button userinfo"
            disabled={!(store.config.userinfo_endpoint && accessToken)}
            onClick={handleUserInfo}
          >
            Userinfo
          </button>
        </div>
      </div>
    </>
  );
});
