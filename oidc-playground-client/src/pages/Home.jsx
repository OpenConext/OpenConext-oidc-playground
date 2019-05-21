import React from "react";
import "./Home.scss";
import I18n from "i18n-js";
import {config} from "../api";

class Home extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      config: {}
    };
  }

  componentDidMount = () => {
    config()
      .then(res => {
        this.setState({config});
      });
  };


  render() {
    const {config} = this.state;
    return (
      <div className="mod-home">
        <div className="title">
          <p>{I18n.t("home.title")}</p>
        </div>
        <section>
          {config}
        </section>
      </div>);
  };
}

export default Home;