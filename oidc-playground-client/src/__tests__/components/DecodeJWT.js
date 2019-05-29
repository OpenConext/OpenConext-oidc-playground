import React from "react";
import { shallow } from "enzyme";
import { DecodeJWT } from "components";

it("renders without crashing", () => {
  shallow(<DecodeJWT />);
});
