import React from "react";
import {ReactSelect} from "components";
import {responseModeT} from "./Tooltips";
import {InfoLabel} from "../InfoLabel";

export class ResponseMode extends React.Component {

  sanitizeOptions() {
    const frontChannelTokenRequest = this.props.moderators.frontChannelTokenRequest;

    return this.props.options
      .filter(opt => opt !== "refresh_token")
      .filter(opt => !frontChannelTokenRequest || opt !== "form_post");
  }

  render() {
    return (
      <fieldset>
        <InfoLabel label="Response mode" toolTip={responseModeT()}/>
        <ReactSelect {...this.props} options={this.sanitizeOptions()}/>
      </fieldset>
    );
  }
}
