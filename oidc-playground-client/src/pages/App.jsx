import React from "react";
import "./App.scss";
import { discovery, reportError } from "../api";
import { ErrorDialog } from "../components";
import { addIcons } from "../utils/IconLibrary";

addIcons();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      errorDialogOpen: false,
      config: {
        authorization_endpoint: "",
        claims_parameter_supported: false,
        claims_supported: [],
        code_challenge_methods_supported: [],
        grant_types_supported: [],
        id_token_signing_alg_values_supported: [],
        introspect_endpoint: "",
        issuer: "",
        jwks_uri: "",
        response_modes_supported: [],
        response_types_supported: [],
        scopes_supported: [],
        subject_types_supported: [],
        token_endpoint_auth_methods_supported: [],
        token_endpoint: "",
        userinfo_endpoint: ""
      }
    };

    this.handleErrors();
  }

  componentDidMount() {
    if (window.location.href.indexOf("error") > -1) {
      this.setState({ loading: false });
    } else {
      discovery().then(res => this.setState({ config: res, loading: false }));
    }
  }

  handleErrors() {
    window.onerror = (msg, url, line, col, err) => {
      if (err && err.response && err.response.status === 404) {
        return this.props.history.push("/404");
      }

      this.setState({ errorDialogOpen: true });

      const info = err || {};
      const response = info.response || {};

      reportError({
        userAgent: navigator.userAgent,
        message: msg,
        url: url,
        line: line,
        col: col,
        error: info.message,
        stack: info.stack,
        targetUrl: response.url,
        status: response.status
      });
    };
  }

  render() {
    const { loading, errorDialogOpen } = this.state;

    if (loading) {
      return null;
    }

    return (
      <div className="app-container">
        <ErrorDialog
          isOpen={errorDialogOpen}
          close={() => this.setState({ errorDialogOpen: false })}
        />
        App
      </div>
    );
  }
}
