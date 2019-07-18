import React from "react";
import {when} from "mobx";
import {observer} from "mobx-react";
import {Config, Display, RetrieveContent} from "pages";
import {Flash} from "components";
import {discovery, getTokens} from "api";
import store from "store";
import {getRedirectParams} from "utils/Url";
import {addIcons} from "utils/IconLibrary";
import {ReactComponent as Balancer} from "images/Balancer.svg";

addIcons();

const App = observer(
  class App extends React.Component {

    constructor(props, ctx) {
      super(props, ctx);
      this.state = {balancing: false};
      if (window.location.pathname === "/") {
        localStorage.clear();
      }
    }

    componentDidMount() {
      discovery().then(config => {
        store.config = config;
        store.configLoaded = true;
      });

      const params = getRedirectParams();

      when(
        () => store.configLoaded && params,
        () => {
          if (params.error) {
            return (store.message = `Invalid request. ${params.error_description}`);
          }

          store.normalFlowAccessToken = params.access_token;
          store.normalFlowIdToken = params.id_token;
          store.refreshToken = params.refresh_token;

          this.swapCode(params.code);
        }
      );
    }

    swapCode(code) {
      if (!code) {
        return;
      }

      const body = {
        ...store.config,
        ...JSON.parse(localStorage.getItem("state")).form,
        code
      };

      getTokens(body)
        .then(data => {
          store.hybridFlowAccessToken = data.result.access_token;
          store.hybridFlowIdToken = data.result.id_token;
          store.refreshToken = data.result.refresh_token;

          store.request = {
            request_url: data.request_url,
            request_headers: data.request_headers,
            request_body: data.request_body,
            result: data.result
          };
        })
        .catch(err =>
          err.json().then(
            res =>
              (store.message = `Tokens could not be retrieved with this code.
                              Error: ${res.error} (${res.status}). Cause ${res.message}`)
          )
        );
    }

    render() {
      return (
        <div className="app-container">
          <Flash/>

          <div className="header-container">
            <header>
              <h2 onClick={() => document.location.replace("/")}>Open ID Connect Playground</h2>
              <Balancer id="balancer" className={this.state.balancing ? "balancer balancing" : "balancer"}
                        onClick={() => this.setState({balancing: !this.state.balancing})}/>
            </header>
          </div>
          {store.configLoaded &&
          <div className="pages-container">

            <div className="screen-left">
              <Config/>
              <RetrieveContent/>
            </div>
            <Display/>
          </div>}
        </div>
      );
    }
  }
);
export default App;
