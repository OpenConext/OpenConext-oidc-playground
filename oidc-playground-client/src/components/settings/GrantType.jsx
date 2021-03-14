import React from "react";
import { InfoLabel, ReactSelect } from "components";
import { grantTypesT } from "./Tooltips";

export class GrantType extends React.Component {

  sanitizeOptions() {
    const isOpenId = this.props.moderators.auth_protocol === "OpenID";
    const frontChannelTokenRequest = this.props.moderators.frontChannelTokenRequest;

    return this.props.options
      .filter(opt => opt !== "refresh_token")
      .filter(opt => !isOpenId || opt !== "client_credentials")
      .filter(opt => !frontChannelTokenRequest || opt !== "implicit");
  }

  sanitizeValue() {
    const options = this.sanitizeOptions();
    const { value } = this.props;

    if (!value || !options.includes(value)) {
      return options[0];
    }

    return value;
  }

  componentDidUpdate() {
    const value = this.sanitizeValue();

    if (this.props.value !== value) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <fieldset>
        <InfoLabel label="Grant type" toolTip={grantTypesT()} />
        <ReactSelect {...this.props} className="select-grant-type" options={this.sanitizeOptions()} />
      </fieldset>
    );
  }
}
