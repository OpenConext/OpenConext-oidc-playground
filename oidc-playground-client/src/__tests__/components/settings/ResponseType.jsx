import { render } from "@testing-library/react";
import { ResponseType, sanitizeResponseTypeOptions } from "components/settings";

const props = {
  options: [],
  moderators: {
    auth_protocol: "",
    grant_type: ""
  }
};

it("renders without crashing", () => {
  render(<ResponseType {...props} />);
});

describe("sanitizing the options passed to select", () => {
  const options = ["code", "token", "id_token", "thing"];

  describe("with auth_protocol OpenID", () => {
    const auth_protocol = "OpenID";

    it("with grant_type authorization_code", () => {
      expect(sanitizeResponseTypeOptions(options, { auth_protocol, grant_type: "authorization_code" }))
        .toEqual(["code"]);
    });

    it("with grant_type implicit", () => {
      expect(sanitizeResponseTypeOptions(options, { auth_protocol, grant_type: "implicit" }))
        .toEqual(["id_token", "thing"]);
    });

  });

  describe("with auth_protocol Oauth2", () => {
    const auth_protocol = "Oauth2";

    it("with grant_type authorization_code", () => {
      expect(sanitizeResponseTypeOptions(options, { auth_protocol, grant_type: "authorization_code" }))
        .toEqual(["code"]);
    });

    it("with grant_type implicit", () => {
      expect(sanitizeResponseTypeOptions(options, { auth_protocol, grant_type: "implicit" }))
        .toEqual(["code", "token", "id_token", "thing"]);
    });

  });
});
