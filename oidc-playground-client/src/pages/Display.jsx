import React from "react";
import { JWT, Request } from "components";

export class Display extends React.Component {
  state = {
    tabs: ["JWT", "Request"],
    activeTab: "Request"
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

  render() {
    return (
      <div className="display container">
        {this.renderTabs()}
        {this.state.activeTab === "Request" ? <Request /> : <JWT />}
      </div>
    );
  }
}
