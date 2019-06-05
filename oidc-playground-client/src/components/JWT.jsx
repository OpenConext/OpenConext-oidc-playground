import React from "react";
import JSONPretty from "react-json-pretty";
import { observer } from "mobx-react";
import store from "store";
import { decodeJWT } from "api";

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
        <label>{this.props.name}</label>
        <input disabled value={this.props.token} />
        <JSONPretty id="json-pretty" data={this.state.jwt} />
      </>
    );
  }
}

const Flow = ({ access_token, id_token }) => {
  return (
    <>
      {access_token && <DecodeToken token={access_token} name="Access token" />}
      {id_token && <DecodeToken token={id_token} name="ID token" />}
    </>
  );
};

export const JWT = observer(() => {
  const normalFlowData = store.normalFlowAccessToken || store.normalFlowIdToken;

  const hybridFlowData = store.hybridFlowIdToken || store.hybridFlowAccessToken;

  if (!normalFlowData && !hybridFlowData) {
    return <label>No results yet.</label>;
  }

  return (
    <div>
      <Flow access_token={store.normalFlowAccessToken} id_token={store.normalFlowIdToken} />
      <Flow access_token={store.hybridFlowAccessToken} id_token={store.hybridFlowIdToken} />
    </div>
  );
});
