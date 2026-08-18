import React from "react";
import { render } from "@testing-library/react";
import { GrantType, sanitizeGrantTypeOptions } from "components/settings";

const props = {
  moderators: {},
  options: []
};

it("renders without crashing", () => {
  render(<GrantType {...props} />);
});

it("removes refresh_token from options before passing options to select", () => {
  const options = sanitizeGrantTypeOptions(["abc", "123", "refresh_token"], {});

  expect(options).toEqual(["abc", "123"]);
});
