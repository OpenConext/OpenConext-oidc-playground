import React from "react";
import {observer} from "mobx-react";
import store from "store";
import {postIntrospect, postRefreshToken, postUserinfo} from "../api";

export const RetrieveContent = observer(props => {
  const accessToken = store.normalFlowAccessToken || store.hybridFlowAccessToken || store.clientCredentialsAccessToken ||
    ((store.request || {}).result || {}).access_token;

  const refreshToken = store.refreshToken || ((store.request || {}).result || {}).refresh_token;
  const body = {
    token: accessToken,
    refresh_token: refreshToken,
  };

  const handleResult = res => {
    store.request = res;
    store.activeTab = "Request";

    if (res.result && res.result.refresh_token) {
      store.normalFlowAccessToken = res.result.access_token;
      store.normalFlowIdToken = res.result.id_token;
      store.refreshToken = res.result.refresh_token;
    }
  };

  const handleError = (err, endpoint) => err.json && err.json().then(
    res =>
      (store.message = `Exception returned from endpoint ${endpoint}.
                              Error: ${res.error} (${res.status}). Cause ${res.message}`)
  );

  const handleIntrospect = () => postIntrospect(body)
    .then(handleResult)
    .catch(err => handleError(err, "introspect"));

  const handleUserInfo = () => postUserinfo(body)
    .then(handleResult)
    .catch(err => handleError(err, "userinfo"));

  const handleRefreshToken = () => postRefreshToken({...store.config, ...body})
    .then(handleResult)
    .catch(err => handleError(err, "refresh_token"));

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
            className="button userinfo"
            disabled={!(accessToken && !store.clientCredentialsAccessToken)}
            onClick={handleUserInfo}>Userinfo
          </button>
          <button
            type="button"
            className="button introspect"
            disabled={!(accessToken)}
            onClick={handleIntrospect}>Introspect
          </button>
          <button
            type="button"
            className="button refresh-token"
            disabled={!refreshToken}
            onClick={handleRefreshToken}>Refresh token
          </button>
        </div>
      </div>
    </>
  );
});
