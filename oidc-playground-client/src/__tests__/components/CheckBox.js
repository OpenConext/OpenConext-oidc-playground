import React from "react";
import { shallow } from "enzyme";
import { CheckBox } from "components";

it("renders without crashing", () => {
  shallow(<CheckBox />);
});
