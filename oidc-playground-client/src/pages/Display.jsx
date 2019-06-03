import React from "react";
import { DecodeJWT } from "components";
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
