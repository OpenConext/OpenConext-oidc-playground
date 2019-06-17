import React from "react";
import JSONPretty from "react-json-pretty";
import { observer } from "mobx-react";
import store from "store";
import { decodeJWT } from "api";
import {InfoLabel} from "./InfoLabel";
import {accessTokenT, idTokenT} from "./settings/Tooltips";

class DecodeToken extends React.Component {
  state = {
    jwt: {}
  };

  componentDidMount() {
    decodeJWT(this.props.token).then(jwt => this.setState({ jwt }));
  }

  render() {
    return (
      <>
        <InfoLabel label={this.props.name} toolTip={this.props.toolTip}/>
        <input disabled value={this.props.token} />
        <JSONPretty id="json-pretty" data={this.state.jwt} />
      </>
    );
  }
}

const Flow = ({ access_token, id_token }) => {
  return (
    <>
      {access_token && <DecodeToken token={access_token}
                                    name="Access token" toolTip={accessTokenT()}/>}
      {id_token && <DecodeToken token={id_token}
                                name="ID token" toolTip={idTokenT()}/>}
    </>
  );
};

export const JWT = observer(() => {
  const normalFlowData = store.normalFlowAccessToken || store.normalFlowIdToken;

  const hybridFlowData = store.hybridFlowIdToken || store.hybridFlowAccessToken;

  if (!normalFlowData && !hybridFlowData) {
    return (
      <div className="block no-data">
        <label>No results yet.</label>
      </div>
    );
  }

  return (
    <div className="block">
      <Flow access_token={store.normalFlowAccessToken} id_token={store.normalFlowIdToken} />
      <Flow access_token={store.hybridFlowAccessToken} id_token={store.hybridFlowIdToken} />
    </div>
  );
});
