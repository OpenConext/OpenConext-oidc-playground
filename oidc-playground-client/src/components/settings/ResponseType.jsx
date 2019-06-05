import React from "react";
import { ReactSelect } from "components";
import { responseTypesT } from "./Tooltips";
import { InfoLabel } from "../InfoLabel";

export class ResponseType extends React.Component {
  sanitizeOptions() {
    const {
      options,
      moderators: { auth_protocol, grant_type }
    } = this.props;

    if (auth_protocol === "OpenID") {
      switch (grant_type) {
        case "authorization_code":
          return ["code"];
        case "implicit":
          return options.filter(opt => !["code", "token"].includes(opt));
        case "client_credentials":
          return ["token", "id_token"];
        default:
          return options;
      }
    }

    switch (grant_type) {
      case "authorization_code":
        return ["code"];
      case "implicit":
      case "client_credentials":
        return ["token"];
      default:
        return options;
    }
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
        <InfoLabel label="Response type" toolTip={responseTypesT()} />
        <ReactSelect {...this.props} options={this.sanitizeOptions()} className="select-response-type" />
      </fieldset>
    );
  }
}
