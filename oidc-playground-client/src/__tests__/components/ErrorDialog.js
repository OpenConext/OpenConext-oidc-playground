import React from "react";
import { shallow } from "enzyme";
import { ErrorDialog } from "components";

it("renders without crashing", () => {
  shallow(<ErrorDialog />);
});
