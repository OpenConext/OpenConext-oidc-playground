import { render } from "@testing-library/react";
import { SignedJWT } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {}
};

it("renders without crashing", () => {
  render(<SignedJWT {...props} />);
});

it("renders null if auth_protocol is Oauth2", () => {
  const { container } = render(<SignedJWT {...props} moderators={{ auth_protocol: "Oauth2" }} />);
  expect(container).toBeEmptyDOMElement();
});

it("renders if auth_protocol is not Oauth2", () => {
  const { container } = render(<SignedJWT {...props} moderators={{ auth_protocol: "authorization_code" }} />);
  expect(container).not.toBeEmptyDOMElement();
});
