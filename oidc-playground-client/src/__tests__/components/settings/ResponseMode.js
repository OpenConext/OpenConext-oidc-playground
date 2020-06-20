import React from "react";
import { shallow } from "enzyme";
import { ResponseMode } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {},
  options: []
};

it("renders without crashing", () => {
  shallow(<ResponseMode {...props} />);
});
