import React from "react";
import { shallow } from "enzyme";
import { JWT } from "components";

it("renders without crashing", () => {
  shallow(<JWT />);
});
