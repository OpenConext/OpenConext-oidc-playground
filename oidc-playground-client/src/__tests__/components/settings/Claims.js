import React from "react";
import { shallow } from "enzyme";
import { Claims } from "components/settings";

const props = {
  moderators: {},
  options: [],
  onChange: () => {}
};

it("renders without crashing", () => {
  shallow(<Claims {...props} />);
});

it("renders null if auth_protocol is Oauth2", () => {
  const comp = shallow(<Claims {...props} moderators={{ auth_protocol: "Oauth2" }} />);
  expect(comp.isEmptyRender()).toEqual(true);
});

it("renders if auth_protocol is not Oauth2", () => {
  const comp = shallow(<Claims {...props} moderators={{ auth_protocol: "OpenID" }} />);
  expect(comp.isEmptyRender()).toEqual(false);
});
