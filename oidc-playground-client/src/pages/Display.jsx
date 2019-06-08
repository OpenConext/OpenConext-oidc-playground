import React from "react";
import {JWT, Request} from "components";
import store from "store";
import {observer} from "mobx-react";

export const Display = observer(
  class Display extends React.Component {
    state = {
      tabs: ["JWT", "Request"]
    };

    renderTabs() {
      return (
        <div className="tabs">
          {this.state.tabs.map(tab => {
            const className = tab === store.activeTab ? "tab active" : "tab";

            return (
              <div className={className} key={tab} onClick={() => store.activeTab = tab}>
                <h2>{tab}</h2>
              </div>
            );
          })}
        </div>
      );
    }

    render() {
      return (
        <div className="right-screen">
          {this.renderTabs()}
          {store.activeTab === "Request" ? <Request/> : <JWT/>}
        </div>
      );
    }
  }
);
