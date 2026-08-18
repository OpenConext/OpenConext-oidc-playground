import React from "react";
import { render } from "@testing-library/react";
import { ForceAuthentication } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {}
};

it("renders without crashing", () => {
  render(<ForceAuthentication {...props} />);
});

it("renders if grant_type is not client_credentials", () => {
  const { container } = render(<ForceAuthentication {...props} moderators={{ grant_type: "authorization_code" }} />);
  expect(container).not.toBeEmptyDOMElement();
});
