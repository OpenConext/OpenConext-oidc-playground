import React from "react";
import { shallow } from "enzyme";
import { ForceAuthentication } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {}
};

it("renders without crashing", () => {
  shallow(<ForceAuthentication {...props} />);
});

it("renders if grant_type is not client_credentials", () => {
  const comp = shallow(<ForceAuthentication {...props} moderators={{ grant_type: "authorization_code" }} />);
  expect(comp.isEmptyRender()).toEqual(false);
});
