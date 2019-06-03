import React from "react";
import { DecodeJWT, Request } from "components";
import { getTokens } from "api";
import { getParams } from "utils/Url";

export class Display extends React.Component {
  state = {
    normalFlow: null,
    hybridFlow: null,
    request: null,
    tabs: ["JWT", "Request"],
    activeTab: "JWT"
  };

  componentDidMount() {
    const params = getParams();

    if (params) {
      if (params.has("access_token") || params.has("id_token")) {
        this.setState({
          normalFlow: {
            access_token: params.get("access_token"),
            id_token: params.get("id_token")
          }
        });
      }

      if (params.has("code")) {
        const decodedStateString = window.atob(params.get("state"));
        const { config, state } = JSON.parse(decodedStateString);

        const body = {
          ...config,
          ...state,
          code: params.get("code")
        };

        getTokens(body).then(data => {
          const { access_token, id_token } = data.result;
          const { request_url, request_headers, request_body } = data;

          this.setState({
            hybridFlow: {
              access_token,
              id_token
            },
            request: {
              request_url,
              request_headers,
              request_body
            }
          });
        });
      }
    }
  }

  renderTabs() {
    return (
      <div className="tabs">
        {this.state.tabs.map(tab => {
          const className = tab === this.state.activeTab ? "tab active" : "tab";

          return (
            <div className={className} key={tab} onClick={() => this.setState({ activeTab: tab })}>
              <h2>{tab}</h2>
            </div>
          );
        })}
      </div>
    );
  }

  renderView() {
    const { normalFlow, hybridFlow, request, activeTab } = this.state;

    if (activeTab === "Request") {
      return <Request {...{ request }} />;
    }

    return <DecodeJWT {...{ normalFlow, hybridFlow }} />;
  }

  render() {
    return (
      <div className="display container">
        {this.renderTabs()}
        {this.renderView()}
      </div>
    );
  }
}
