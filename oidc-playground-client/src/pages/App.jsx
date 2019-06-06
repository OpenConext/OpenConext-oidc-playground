import React from "react";
import { when } from "mobx";
import { observer } from "mobx-react";
import { Config, Display } from "pages";
import { Flash } from "components";
import { discovery, getTokens } from "api";
import store from "store";
import { getRedirectParams } from "utils/Url";
import { addIcons } from "utils/IconLibrary";

addIcons();

const App = observer(
  class App extends React.Component {
    componentDidMount() {
      discovery().then(config => {
        store.config = config;
        store.configLoaded = true;
      });

      const params = getRedirectParams();

      when(
        () => store.configLoaded && params,
        () => {
          store.normalFlowAccessToken = params.access_token;
          store.normalFlowIdToken = params.id_token;

          this.swapCode(params.code, params.state);
        }
      );
    }

    swapCode(code, state) {
      if (!code) {
        return;
      }

      const body = {
        ...store.config,
        ...JSON.parse(localStorage.getItem("state")),
        code
      };

      getTokens(body)
        .then(data => {
          store.hybridFlowAccessToken = data.result.access_token;
          store.hybridFlowIdToken = data.result.id_token;

          store.request = {
            request_url: data.request_url,
            request_headers: data.request_headers,
            request_body: data.request_body
          };
        })
        .catch(
          err =>
            (store.message = `Tokens could not be retrieved with this code. Error: ${err.statusText} (${err.status})`)
        );
    }

    render() {
      return (
        <div className="app-container">
          <Flash />
          {store.configLoaded && <Config />}
          <Display />
        </div>
      );
    }
  }
);
export default App;
