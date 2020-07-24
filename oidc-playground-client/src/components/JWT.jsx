import React from "react";
import JSONPretty from "react-json-pretty";
import {observer} from "mobx-react";
import store from "store";
import {decodeJWT} from "api";
import {InfoLabel} from "./InfoLabel";
import {accessTokenT, idTokenT, refreshTokenT} from "./settings/Tooltips";
import "./JWT.scss";

export class DecodeToken extends React.Component {
  state = {
    jwt: {}
  };

  componentDidMount() {
    decodeJWT(this.props.token).then(jwt => this.setState({jwt}));
  }

  render() {
    return (
      <div className="token">
        <InfoLabel label={this.props.name} toolTip={this.props.toolTip} copyToClipBoardText={this.props.token}/>
        <input disabled value={this.props.token}/>
        <JSONPretty id="json-pretty" data={this.state.jwt}/>
      </div>
    );
  }
}

export const JWT = observer(() => {

  const normalFlowData = store.normalFlowAccessToken || store.normalFlowIdToken;
  const hybridFlowData = store.hybridFlowIdToken || store.hybridFlowAccessToken;
  const clientCredentialsFlow = store.clientCredentialsAccessToken;

  if (!normalFlowData && !hybridFlowData && !clientCredentialsFlow) {
    return (
      <div className="block no-data">
        <label>No results yet.</label>
      </div>
    );
  }
  return (
    <div className="block jwt">
      {store.normalFlowAccessToken &&
      <DecodeToken token={store.normalFlowAccessToken}
                   name="Access token" toolTip={accessTokenT()}/>}

      {store.normalFlowIdToken &&
      <DecodeToken token={store.normalFlowIdToken}
                   name="ID token" toolTip={idTokenT()}/>}

      {store.hybridFlowAccessToken &&
      <DecodeToken token={store.hybridFlowAccessToken}
                   name="Access token" toolTip={accessTokenT()}/>}

      {store.hybridFlowIdToken &&
      <DecodeToken token={store.hybridFlowIdToken}
                   name="ID token" toolTip={idTokenT()}/>}

      {store.refreshToken &&
      <DecodeToken token={store.refreshToken}
                   name="Refresh token" toolTip={refreshTokenT()}/>}

      {store.clientCredentialsAccessToken &&
      <DecodeToken token={store.clientCredentialsAccessToken}
                   name="Client Credentials Access token"
                   toolTip={accessTokenT()}/>}

    </div>
  );
});
