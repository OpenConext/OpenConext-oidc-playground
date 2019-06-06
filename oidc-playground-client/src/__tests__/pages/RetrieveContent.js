import React from "react";
import { shallow } from "enzyme";
import { RetrieveContent } from "pages";

it("renders without crashing", () => {
  shallow(<RetrieveContent />);
});
