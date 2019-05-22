import React from "react";
import "./App.scss";
import { Settings } from "pages";
import { reportError } from "api";
import { ErrorDialog } from "components";
import { addIcons } from "utils/IconLibrary";

addIcons();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorDialogOpen: false
    };

    this.handleErrors();
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
    return (
      <div className="app-container">
        <ErrorDialog
          isOpen={this.state.errorDialogOpen}
          close={() => this.setState({ errorDialogOpen: false })}
        />
        <Settings />
      </div>
    );
  }
}
