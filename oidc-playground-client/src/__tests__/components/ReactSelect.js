import React from "react";
import { shallow } from "enzyme";
import { ReactSelect } from "components";

const props = {
  options: []
};

it("renders without crashing", () => {
  shallow(<ReactSelect {...props} />);
});
