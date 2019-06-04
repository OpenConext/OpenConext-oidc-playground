import React from "react";
import { DecodeJWT, Request } from "components";

export class Display extends React.Component {
  state = {
    tabs: ["JWT", "Request"],
    activeTab: "JWT"
  };

  renderTabs() {
    return (
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
    );
  }

  renderView() {
    const { activeTab } = this.state;
    const { normalFlow, hybridFlow, request } = this.props;

    if (activeTab === "Request") {
      return <Request {...{ request }} />;
    }

    return <DecodeJWT {...{ normalFlow, hybridFlow }} />;
  }

  render() {
    return (
      <div className="display container">
        {this.renderTabs()}
        {this.renderView()}
      </div>
    );
  }
}
