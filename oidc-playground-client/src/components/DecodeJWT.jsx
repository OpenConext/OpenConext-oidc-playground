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

  componentDidUpdate() {
    const { access_token, id_token } = this.props;
    const { decodedAccessToken, decodedIdToken } = this.state;

    if (!decodedAccessToken && access_token) {
      decodeJWT(access_token)
        .then(token =>
          this.setState({
            accessTokenJWT: token,
            decodedAccessToken: true
          })
        )
        .catch(err => console.log("err", err));
    }

    if (!decodedIdToken && id_token) {
      decodeJWT(id_token)
        .then(token =>
          this.setState({
            idTokenJWT: token,
            decodedIdToken: true
          })
        )
        .catch(err => console.log("err", err));
    }
  }

  render() {
    const { decodedAccessToken, accessTokenJWT, decodedIdToken, idTokenJWT } = this.state;

    return (
      <>
        {decodedAccessToken && <JSONPretty id="json-pretty" data={accessTokenJWT} />}
        {decodedIdToken && <JSONPretty id="json-pretty" data={idTokenJWT} />}
      </>
    );
  }
}
