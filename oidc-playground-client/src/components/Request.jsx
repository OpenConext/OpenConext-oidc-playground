import React from "react";
import JSONPretty from "react-json-pretty";
import { isEmpty } from "utils/Utils";

export class Request extends React.Component {
  render() {
    if (isEmpty(this.props.request)) {
      return <label>No request data yet.</label>;
    }

    const { request_url, request_headers, request_body } = this.props.request;

    return (
      <div>
        <input readOnly={true} value={request_url} />
        <label>Headers</label>
        <JSONPretty id="json-pretty" data={request_headers} />
        <label>Form parameters</label>
        <JSONPretty id="json-pretty" data={request_body} />
      </div>
    );
  }
}
