import React from "react";
import { shallow } from "enzyme";
import { AcrValues } from "components/settings";

const props = {
  moderators: {},
  options: [],
  onChange: () => {}
};

it("renders without crashing", () => {
  shallow(<AcrValues {...props} />);
});

it("renders null if auth_protocol is Oauth2", () => {
  const comp = shallow(<AcrValues {...props} moderators={{ auth_protocol: "Oauth2" }} />);
  expect(comp.isEmptyRender()).toEqual(true);
});

it("renders if auth_protocol is not Oauth2", () => {
  const comp = shallow(<AcrValues {...props} moderators={{ auth_protocol: "OpenID" }} />);
  expect(comp.isEmptyRender()).toEqual(false);
});
