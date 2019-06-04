import React from "react";
import { Config, Display } from "pages";
import { Flash } from "components";
import { addIcons } from "utils/IconLibrary";

addIcons();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flashMessage: undefined
    };

    this.resetFlash = this.resetFlash.bind(this);
    this.setFlash = this.setFlash.bind(this);
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

  render() {
    return (
      <div className="app-container">
        <Flash message={this.state.flashMessage} onClose={this.resetFlash} />
        <Config />
        <Display setFlash={this.setFlash} />
      </div>
    );
  }
}
