import React from "react";
import { shallow } from "enzyme";
import { Scopes } from "components/settings";

const props = {
  moderators: {},
  options: []
};

it("renders without crashing", () => {
  shallow(<Scopes {...props} />);
});
