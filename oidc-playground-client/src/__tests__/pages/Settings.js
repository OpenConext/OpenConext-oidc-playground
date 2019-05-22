import React from "react";
import { mount } from "enzyme";
import { Settings } from "pages";

it("renders without crashing", () => {
  mount(<Settings />);
});
