import React from "react";
import JSONPretty from "react-json-pretty";

import { decodeJWT } from "../api";

export class DecodeJWT extends React.Component {
  state = {
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

  componentDidMount() {
    decodeJWT(this.props.access_token)
      .then(accessTokenJWT =>
        this.setState({ accessTokenJWT, decodedAccessToken: true })
      )
      .catch(err => console.log("err", err));

    decodeJWT(this.props.id_token)
      .then(idTokenJWT => this.setState({ idTokenJWT, decodedIdToken: true }))
      .catch(err => console.log("err", err));
  }

  render() {
    const { decodedAccessToken, decodedIdToken } = this.state;

    if (!decodedAccessToken && !decodedIdToken) {
      return null;
    }

    return (
      <>
        {decodedAccessToken && (
          <JSONPretty id="json-pretty" data={this.state.accessTokenJWT} />
        )}
        {decodedIdToken && (
          <JSONPretty id="json-pretty" data={this.state.idTokenJWT} />
        )}
      </>
    );
  }
}
