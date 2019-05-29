import React from "react";
import { Config, Display } from "pages";
import { addIcons } from "utils/IconLibrary";

addIcons();

export default class App extends React.Component {
  render() {
    return (
      <div className="app-container">
        <Config />
        <Display />
      </div>
    );
  }
}
