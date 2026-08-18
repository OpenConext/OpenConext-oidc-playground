import React from "react";
import { ReactSelect } from "components";
import { responseTypesT } from "./Tooltips";
import { InfoLabel } from "../InfoLabel";

export function sanitizeResponseTypeOptions(options, { auth_protocol, grant_type }) {
  if (auth_protocol === "OpenID") {
    switch (grant_type) {
      case "authorization_code":
        return ["code"];
      case "implicit":
        return options.filter(opt => !["code", "token"].includes(opt));
      default:
        return options;
    }
  }

  switch (grant_type) {
    case "authorization_code":
      return ["code"];
    case "implicit":
    default:
      return options;
  }
}

export class ResponseType extends React.Component {
  sanitizeOptions() {
    return sanitizeResponseTypeOptions(this.props.options, this.props.moderators);
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
