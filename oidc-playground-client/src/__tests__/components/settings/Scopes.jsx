import React from "react";
import { render } from "@testing-library/react";
import { Scopes, computeFixedValues } from "components/settings";

const props = {
  moderators: {},
  options: [],
  value: [],
  onChange: () => {}
};

it("renders without crashing", () => {
  render(<Scopes {...props} />);
});

describe("auth_protocol", () => {
  describe("Oauth2", () => {
    it("does not add openid scope to fixedValues", () => {
      expect(computeFixedValues({ auth_protocol: "Oauth2" }).includes("openid")).toEqual(false);
    });
  });

  describe("OpenID", () => {
    it("adds openid scope to fixedValues", () => {
      expect(computeFixedValues({ auth_protocol: "OpenID" }).includes("openid")).toEqual(true);
    });
  });
});
