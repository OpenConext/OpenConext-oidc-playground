import React from "react";
import {observer} from "mobx-react";
import store from "store";
import {Authorization, SettingsForm} from "components";
import {getRedirectParams} from "utils/Url";
import {formPost, generateCodeChallenge} from "api";
import {isEmpty} from "utils/Utils";
import {API} from "../components/API";
import {apiCall} from "../api";

const initialForm = {
    acr_values: [],
    auth_protocol: "OpenID",
    claims: [],
    client_id: "",
    client_secret: "",
    jwt_client_secret: "",
    code_challenge_method: "",
    code_challenge: "",
    code_verifier: "",
    forceAuthentication: false,
    forceConsent: false,
    frontChannelTokenRequest: false,
    grant_type: "authorization_code",
    login_hint: "",
    nonce: "example",
    pkce: false,
    omitAuthentication: false,
    response_mode: "query",
    response_type: "code",
    scope: ["openid"],
    signedJWT: false,
    state: "example",
    token_endpoint_auth_method: "client_secret_basic"
};
export const Config = observer(
    class Config extends React.Component {
        state = {
            tabs: ["Settings", "Authorization", "API"],
            activeTab: "Settings",
            form: initialForm
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
                        store.activeTab = "JWT";
                    }
                })
                .catch(err =>
                    err.json().then(
                        res =>
                            (store.message = `Exception returned from endpoint ${this.state.form.grant_type}.
                              Error: ${res.error} (${res.status}). Cause ${res.message}`)
                    ));
        };

        handleApiSubmit = e => {
            e.preventDefault();
            const body = this.sanitizeBody();
            const apiUrl = body.apiUrl;
            const accessToken = store.normalFlowAccessToken || store.hybridFlowAccessToken || store.clientCredentialsAccessToken ||
                ((store.request || {}).result || {}).access_token;
            apiCall({apiUrl, accessToken,})
                .then(res => {
                    localStorage.removeItem("authorization_url");
                    store.request = {
                        result: res.result,
                        request_url: null,
                        request_headers: res.request_headers,
                        request_body: null
                    };
                    store.activeTab = "Request";
                    store.apiCall = true;
                    window.scrollTo(0, 0);
                }).catch(err => err.json().then(
                res => (store.message = `Exception returned from endpoint ${this.state.form.apiUrl}.
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
                        this.setState({
                            form: {
                                ...this.state.form,
                                pkce: false,
                                omitAuthentication: false,
                                response_mode: "fragment"
                            }
                        });
                    } else if (grant_type === "client_credentials") {
                        this.setState({
                            form: {
                                ...this.state.form,
                                pkce: false,
                                omitAuthentication: false,
                                forceAuthentication: false,
                                forceConsent: false,
                                frontChannelTokenRequest: false
                            }
                        });
                    } else if (grant_type === "authorization_code") {
                        this.setState({
                            form: {...this.state.form, response_mode: "query"}
                        });
                    }
                    break;
                case "auth_protocol":
                    const {auth_protocol, scope} = this.state.form;
                    const authIsOpenId = auth_protocol === "OpenID";
                    const hasOpenIdScope = scope.includes("openid");
                    let newScope = [...scope];

                    if (authIsOpenId && !hasOpenIdScope) {
                        newScope = ["openid"].concat(scope);
                    }

                    if (!authIsOpenId && hasOpenIdScope) {
                        newScope = scope.filter(val => val !== "openid");
                    }

                    this.setState({
                        form: {
                            ...initialForm,
                            auth_protocol,
                            scope: newScope
                        }
                    });
                    break;
                case "frontChannelTokenRequest":
                    const {frontChannelTokenRequest} = this.state.form;
                    if (frontChannelTokenRequest) {
                        this.setState({
                            form: {
                                ...this.state.form,
                                pkce: true,
                                omitAuthentication: true,
                                response_mode: "query",
                                response_type: "code",
                                signedJWT: false
                            }
                        });
                    }
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
                    ) : this.state.activeTab === "Authorization" ? (
                        <Authorization
                            onChange={(attr, value) => this.setValue(attr, value)}
                            form={this.state.form}
                            onSubmit={this.handleSubmit}
                        />) : (<API
                            onChange={(attr, value) => this.setValue(attr, value)}
                            form={this.state.form}
                            onApiSubmit={this.handleApiSubmit}
                        />
                    )}
                </div>
            );
        }
    }
);
