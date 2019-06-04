import React from "react";
import JSONPretty from "react-json-pretty";
import { decodeJWT } from "../api";
import { isEmpty } from "utils/Utils";

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
        <input disabled value={value} />
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
  render() {
    const { normalFlow, hybridFlow } = this.props;

    if (isEmpty(normalFlow) && isEmpty(hybridFlow)) {
      return <label>No results yet.</label>;
    }

    return (
      <div>
        {normalFlow && <DecodedFlow {...normalFlow} />}
        {hybridFlow && <DecodedFlow {...hybridFlow} />}
      </div>
    );
  }
}
