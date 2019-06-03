import React from "react";
import JSONPretty from "react-json-pretty";
import { decodeJWT } from "../api";

class DecodedFlow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decodedAccessToken: false,
      decodedIdToken: false,
      accessTokenJWT: {
        headers: {},
        payload: {}
      },
      idTokenJWT: {
        headers: {},
        payload: {}
      }
    };
  }

  componentDidMount() {
    if (this.props.access_token) {
      decodeJWT(this.props.access_token).then(token =>
        this.setState({
          accessTokenJWT: token,
          decodedAccessToken: true
        })
      );
    }

    if (this.props.id_token) {
      decodeJWT(this.props.id_token).then(token =>
        this.setState({
          idTokenJWT: token,
          decodedIdToken: true
        })
      );
    }
  }

  renderJWT(name, value, decoded) {
    return (
      <>
        <label>{name}</label>
        <input readOnly={true} value={value} />
        <JSONPretty id="json-pretty" data={decoded} />
      </>
    );
  }

  render() {
    const { decodedAccessToken, accessTokenJWT, decodedIdToken, idTokenJWT } = this.state;
    const { access_token, id_token } = this.props;

    return (
      <>
        {decodedAccessToken && this.renderJWT("Access token", access_token, accessTokenJWT)}
        {decodedIdToken && this.renderJWT("ID token", id_token, idTokenJWT)}
      </>
    );
  }
}

export class DecodeJWT extends React.Component {
  renderDecodedFlows() {
    const { normalFlow, hybridFlow } = this.props;

    if (!normalFlow && !hybridFlow) {
      return "No results yet.";
    }

    return (
      <>
        {normalFlow && <DecodedFlow {...normalFlow} />}
        {hybridFlow && <DecodedFlow {...hybridFlow} />}
      </>
    );
  }

  render() {
    return (
      <form>
        <fieldset className="form-header">
          <h2>JWT</h2>
        </fieldset>
        <div className="result-block">{this.renderDecodedFlows()}</div>
      </form>
    );
  }
}
