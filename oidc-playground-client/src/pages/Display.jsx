import React from "react";
import { DecodeJWT } from "components";
import { getTokens } from "api";
import { getParams } from "utils/Url";

export class Display extends React.Component {
  state = {
    access_token: null,
    id_token: null
  };

  componentDidMount() {
    const params = getParams();

    if (params) {
      this.setState({
        access_token: params.get("access_token"),
        id_token: params.get("id_token")
      });

      if (params.has("code")) {
        const decodedStateString = window.atob(params.get("state"));
        const { config, state } = JSON.parse(decodedStateString);

        const body = {
          ...config,
          ...state,
          code: params.get("code")
        };

        getTokens(body)
          .then(res => console.log("res", res))
          .catch(err => console.log("err", err));
      }
    }
  }

  render() {
    return (
      <div className="display">
        <DecodeJWT access_token={this.state.access_token} id_token={this.state.id_token} />
      </div>
    );
  }
}
