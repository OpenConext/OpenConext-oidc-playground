import { render } from "@testing-library/react";
import { AcrValues } from "components/settings";

const props = {
  moderators: {},
  options: [],
  onChange: () => {}
};

it("renders without crashing", () => {
  render(<AcrValues {...props} />);
});

it("renders null if auth_protocol is Oauth2", () => {
  const { container } = render(<AcrValues {...props} moderators={{ auth_protocol: "Oauth2" }} />);
  expect(container).toBeEmptyDOMElement();
});

it("renders if auth_protocol is not Oauth2", () => {
  const { container } = render(<AcrValues {...props} moderators={{ auth_protocol: "OpenID" }} />);
  expect(container).not.toBeEmptyDOMElement();
});
