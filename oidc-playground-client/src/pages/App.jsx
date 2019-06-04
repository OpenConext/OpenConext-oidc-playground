import React from "react";
import { Config, Display } from "pages";
import { Flash } from "components";
import { addIcons } from "utils/IconLibrary";
import { getTokens } from "api";
import { getParams } from "utils/Url";

addIcons();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flashMessage: undefined,
      normalFlow: {},
      hybridFlow: {},
      request: null
    };

    this.resetFlash = this.resetFlash.bind(this);
    this.setFlash = this.setFlash.bind(this);
    this.handleClientCredentialsResult = this.handleClientCredentialsResult.bind(this);
  }

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

        getTokens(body)
          .then(data => {
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
          })
          .catch(err =>
            this.setFlash(`Tokens could not be retrieved with this code. Error: ${err.statusText} (${err.status})`)
          );
      }
    }
  }

  resetFlash() {
    this.setState({
      flashMessage: undefined
    });
  }

  setFlash(message) {
    this.setState(
      {
        flashMessage: message
      },
      () => setTimeout(this.resetFlash, 8000)
    );
  }

  handleClientCredentialsResult(result) {
    this.setState({
      request: {
        request_url: result.request_url,
        request_headers: result.request_headers,
        request_body: result.request_body
      },
      normalFlow: {
        access_token: result.result.access_token
      }
    });
  }

  render() {
    const { normalFlow, hybridFlow, request } = this.state;

    const accessToken = [normalFlow.access_token, hybridFlow.access_token].filter(Boolean)[0];

    return (
      <div className="app-container">
        <Flash message={this.state.flashMessage} onClose={this.resetFlash} />
        <Config accessToken={accessToken} handleClientCredentialsResult={this.handleClientCredentialsResult} />
        <Display {...{ normalFlow, hybridFlow, request }} />
      </div>
    );
  }
}
