import React from "react";
import { mount } from "enzyme";
import App from "pages/App";

it("renders without crashing", () => {
  mount(<App />);
});
