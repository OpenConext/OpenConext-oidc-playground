import React from "react";
import JSONPretty from "react-json-pretty";

import {decodeJWT} from "../api";

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
    Promise.all([decodeJWT(this.props.access_token), decodeJWT(this.props.id_token)])
      .then(tokensJWT =>
        this.setState({
          accessTokenJWT: tokensJWT[0],
          decodedAccessToken: true,
          idTokenJWT: tokensJWT[1],
          decodedIdToken: true
        })
      ).catch(err => console.log("err", err));

  }

  render() {
    const {decodedAccessToken, decodedIdToken} = this.state;

    if (!decodedAccessToken && !decodedIdToken) {
      return null;
    }

    return (
      <>
        {decodedAccessToken && (
          <JSONPretty id="json-pretty" data={this.state.accessTokenJWT}/>
        )}
        {decodedIdToken && (
          <JSONPretty id="json-pretty" data={this.state.idTokenJWT}/>
        )}
      </>
    );
  }
}
