import React from "react";
import { observer } from "mobx-react";
import store from "store";
import { SettingsForm, Authorization } from "components";
import { getRedirectParams } from "utils/Url";
import { generateCodeChallenge, formPost } from "api";
import { isEmpty } from "utils/Utils";

export const Config = observer(
  class Config extends React.Component {
    state = {
      tabs: ["Settings", "Authorization"],
      activeTab: "Settings",
      form: {
        client_id: "",
        client_secret: "",
        auth_protocol: "OpenID",
        acr_values: [],
        claims: [],
        code_challenge_method: "",
        code_verifier: "",
        code_challenge: "",
        pkce: false,
        grant_type: "authorization_code",
        response_mode: "fragment",
        response_type: "code",
        scope: [],
        token_endpoint_auth_method: "client_secret_basic",
        state: "example",
        nonce: "example"
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
        generateCodeChallenge(this.state.form.code_challenge_method).then(json =>
          this.setState({
            code_challenge_method: json.codeChallengeMethod,
            code_verifier: json.codeVerifier,
            code_challenge: json.codeChallenge
          })
        );
      }
    }

    saveState() {
      localStorage.setItem("state", JSON.stringify(this.state));
    }

    sanitizeBody() {
      const { acr_values, client_id } = this.state.form;

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

      formPost(this.sanitizeBody()).then(json => {
        if (json.url) {
          localStorage.setItem("authorization_url", json.url);
          window.location.replace(json.url);
        }

        if (json.result) {
          store.request = json;
        }
      });
    };

    setValue(attr, value, callback = () => this) {
      this.setState(
        {
          form: { ...this.state.form, [attr]: value }
        },
        callback
      );
    }

    render() {
      return (
        <div>
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
          {this.state.activeTab === "Settings" ? (
            <SettingsForm
              onChange={(attr, value, callback) => this.setValue(attr, value, callback)}
              form={this.state.form}
              onSubmit={e => this.handleSubmit(e)}
            />
          ) : (
            <Authorization
              onChange={(attr, value, callback) => this.setValue(attr, value, callback)}
              form={this.state.form}
              onSubmit={e => this.handleSubmit(e)}
            />
          )}
        </div>
      );
    }
  }
);
