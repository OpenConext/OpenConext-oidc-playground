import React from "react";
import "./App.scss";
import Header from "../components/Header";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import NotFound from "./NotFound";
import ServerError from "./ServerError";
import Navigation from "../components/Navigation";
import {config} from "../api";
import ErrorDialog from "../components/ErrorDialog";
import Footer from "../components/Footer";
import Flash from "../components/Flash";
import Home from "./Home";
import {addIcons} from "../utils/IconLibrary";
import {pseudoGuid} from "../utils/Utils";

addIcons();

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      config: {},
      error: false,
      errorDialogOpen: false,
      errorDialogAction: () => this.setState({errorDialogOpen: false})
    };
    window.onerror = (msg, url, line, col, err) => {
      if (err && err.response && err.response.status === 404) {
        this.props.history.push("/404");
        return;
      }
      this.setState({errorDialogOpen: true});
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
      window.location.href = `${location.protocol}//${location.hostname}${location.port ? ":" + location.port : ""}/error`;
    } else {
      //302 redirects from Shib are cached by the browser. We force a one-time reload
      const guid = pseudoGuid();
      window.location.href = `${location.href}?guid=${guid}`;
    }
  };

  componentDidMount() {
    const location = window.location;
    if (location.href.indexOf("error") > -1) {
      this.setState({loading: false});
    } else {
      config()
        .then(res => this.setState({config: res}))
        .catch(() => this.handleBackendDown());
    }
  }

  render() {
    const {
      loading, errorDialogAction, errorDialogOpen, config
    } = this.state;
    if (loading) {
      return null; // render null when app is not ready yet
    }
    return (
      <Router>
        <div className="app-container">
          <div>
            <Flash/>
            <Header currentUser={currentUser} impersonator={impersonator} config={config}/>
            <Navigation currentUser={currentUser} impersonator={impersonator}/>
            <ErrorDialog isOpen={errorDialogOpen}
                         close={errorDialogAction}/>
          </div>
          }
          <Switch>
            <Route exact path="/" render={() => {
              return currentUser.guest ? <Redirect to="/login"/> : <Redirect to="/home"/>
            }}/>

            <Route path="/home"
                   render={props => <Home {...props}/>}/>

            <Route path="/error" render={props => <ServerError {...props}/>}/>

            <Route render={props => <NotFound currentUser={currentUser} {...props}/>}/>
          </Switch>
          <Footer/>
        </div>
      </Router>

    );
  }
}

export default App;
