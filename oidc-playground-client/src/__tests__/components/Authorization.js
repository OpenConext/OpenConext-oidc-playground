import React from "react";
import { shallow } from "enzyme";
import { Authorization } from "components";

const props = {
  form: {
    client_id: "",
    client_secret: ""
  }
};

it("renders without crashing", () => {
  shallow(<Authorization {...props} />);
});
