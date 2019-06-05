import React from "react";
import { shallow } from "enzyme";
import { RetrieveContent } from "components";

it("renders without crashing", () => {
  shallow(<RetrieveContent />);
});
