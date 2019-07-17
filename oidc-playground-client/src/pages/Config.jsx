import React from "react";
import {observer} from "mobx-react";
import store from "store";
import {Authorization, SettingsForm} from "components";
import {getRedirectParams} from "utils/Url";
import {formPost, generateCodeChallenge} from "api";
import {isEmpty} from "utils/Utils";

export const Config = observer(
  class Config extends React.Component {
    state = {
      tabs: ["Settings", "Authorization"],
      activeTab: "Settings",
      form: {
        acr_values: [],
        auth_protocol: "OpenID",
        claims: [],
        client_id: "",
        client_secret: "",
        code_challenge_method: "",
        code_challenge: "",
        code_verifier: "",
        forceAuthentication: false,
        grant_type: "authorization_code",
        nonce: "example",
        pkce: false,
        omitAuthentication: false,
        response_mode: "query",
        response_type: "code",
        scope: [],
        signedJWT: false,
        state: "example",
        token_endpoint_auth_method: "client_secret_basic"
      }
    };

    componentDidMount() {
      const params = getRedirectParams();

      if (params) {
        this.setState({
          ...this.state,
          ...JSON.parse(localStorage.getItem("state"))
        });
      }

      if (window.location.pathname === "/") {
        this.refreshCodeChallenge();
      }
    }

    refreshCodeChallenge = () =>
      generateCodeChallenge(this.state.form.code_challenge_method).then(json =>
        this.setState({
          form: {
            ...this.state.form,
            code_challenge_method: json.codeChallengeMethod,
            code_verifier: json.codeVerifier,
            code_challenge: json.codeChallenge
          }
        }));

    saveState() {
      localStorage.setItem("state", JSON.stringify(this.state));
    }

    sanitizeBody() {
      const {acr_values, client_id} = this.state.form;

      return {
        ...store.config,
        ...this.state.form,
        acr_values: acr_values.join(" "),
        client_id: isEmpty(client_id) ? undefined : client_id
      };
    }

    handleSubmit = e => {
      e.preventDefault();

      localStorage.clear();
      this.saveState();

      formPost(this.sanitizeBody())
        .then(json => {
          if (json.url) {
            localStorage.setItem("authorization_url", json.url);
            window.location.replace(json.url);
          }

          if (json.result) {
            store.request = json;
            store.activeTab = "Request";
          }

          if (json.request_body && json.request_body.grant_type === "client_credentials"
            && json.result && json.result.access_token) {
            store.clientCredentialsAccessToken = json.result.access_token;
          }
        })
        .catch(err =>
          err.json().then(
            res =>
              (store.message = `Exception returned from endpoint ${this.state.form.grant_type}.
                              Error: ${res.error} (${res.status}). Cause ${res.message}`)
          ));
    };

    stateInvariant = attr => () => {
      switch (attr) {
        case "code_challenge_method":
          this.refreshCodeChallenge();
          break;
        case "pkce":
          const {pkce} = this.state.form;
          this.setState({form: {...this.state.form, omitAuthentication: pkce}});
          break;
        case "grant_type":
          const {grant_type} = this.state.form;
          if (grant_type === "implicit") {
            this.setState({form: {...this.state.form,
                pkce: false, omitAuthentication: false, response_mode: "fragment"}});
          } else if (grant_type === "client_credentials") {
            this.setState({
              form: {
                ...this.state.form,
                pkce: false,
                omitAuthentication: false,
                forceAuthentication: false
              }
            });
          } else if (grant_type === "authorization_code") {
            this.setState({
              form: {...this.state.form, response_mode: "query"}
            });
          }
          break;
        case "auth_protocol":
          this.setState({form: {...this.state.form, signedJWT: false, claims: [], acr_values: []}});
          break;
        default:
          break;
      }
    };

    setValue(attr, value) {
      this.setState(
        {
          form: {...this.state.form, [attr]: value}
        }, this.stateInvariant(attr));
    }

    render() {
      return (
        <div>
          <div className="tabs">
            {this.state.tabs.map(tab => {
              const className = tab === this.state.activeTab ? "tab active" : "tab";

              return (
                <div className={className} key={tab} onClick={() => this.setState({activeTab: tab})}>
                  <h2>{tab}</h2>
                </div>
              );
            })}
          </div>
          {this.state.activeTab === "Settings" ? (
            <SettingsForm
              onChange={(attr, value) => this.setValue(attr, value)}
              form={this.state.form}
              onSubmit={this.handleSubmit}
            />
          ) : (
            <Authorization
              onChange={(attr, value) => this.setValue(attr, value)}
              form={this.state.form}
              onSubmit={this.handleSubmit}
            />
          )}
        </div>
      );
    }
  }
);
