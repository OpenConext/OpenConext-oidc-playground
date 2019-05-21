import React from "react";
import "./App.scss";
import { reportError } from "../api";
import { ErrorDialog } from "../components";
import { addIcons } from "../utils/IconLibrary";
import { pseudoGuid } from "../utils/Utils";

addIcons();

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      error: false,
      errorDialogOpen: false,
      errorDialogAction: () => this.setState({ errorDialogOpen: false })
    };

    window.onerror = (msg, url, line, col, err) => {
      if (err && err.response && err.response.status === 404) {
        this.props.history.push("/404");
        return;
      }
      this.setState({ errorDialogOpen: true });
      const info = err || {};
      const response = info.response || {};
      const error = {
        userAgent: navigator.userAgent,
        message: msg,
        url: url,
        line: line,
        col: col,
        error: info.message,
        stack: info.stack,
        targetUrl: response.url,
        status: response.status
      };
      reportError(error);
    };
  }

  handleBackendDown = () => {
    const location = window.location;
    const alreadyRetried = location.href.indexOf("guid") > -1;
    if (alreadyRetried) {
      window.location.href = `${location.protocol}//${location.hostname}${
        location.port ? ":" + location.port : ""
      }/error`;
    } else {
      //302 redirects from Shib are cached by the browser. We force a one-time reload
      const guid = pseudoGuid();
      window.location.href = `${location.href}?guid=${guid}`;
    }
  };

  componentDidMount() {
    const location = window.location;

    if (location.href.indexOf("error") > -1) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, errorDialogAction, errorDialogOpen } = this.state;

    if (loading) {
      return null;
    }
    return (
      <div className="app-container">
        <div>
          <ErrorDialog isOpen={errorDialogOpen} close={errorDialogAction} />
        </div>
        App
      </div>
    );
  }
}

export default App;
