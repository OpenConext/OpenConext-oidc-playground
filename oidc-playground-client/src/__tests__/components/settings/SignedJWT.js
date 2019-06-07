import React from "react";
import { shallow } from "enzyme";
import { SignedJWT } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {}
};

it("renders without crashing", () => {
  shallow(<SignedJWT {...props} />);
});

it("renders null if auth_protocol is Oauth2", () => {
  const comp = shallow(<SignedJWT {...props} moderators={{ auth_protocol: "Oauth2" }} />);
  expect(comp.isEmptyRender()).toEqual(true);
});

it("renders if auth_protocol is not Oauth2", () => {
  const comp = shallow(<SignedJWT {...props} moderators={{ auth_protocol: "authorization_code" }} />);
  expect(comp.isEmptyRender()).toEqual(false);
});
