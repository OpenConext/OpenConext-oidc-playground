import React from "react";
import { shallow } from "enzyme";
import { ResponseMode } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {}
};

it("renders without crashing", () => {
  shallow(<ResponseMode {...props} />);
});

it("renders null if grant_type is not implicit", () => {
  const comp = shallow(<ResponseMode {...props} />);
  expect(comp.isEmptyRender()).toEqual(true);
});

it("renders if grant_type is implicit", () => {
  const comp = shallow(
    <ResponseMode {...props} moderators={{ grant_type: "implicit" }} />
  );
  expect(comp.isEmptyRender()).toEqual(false);
});
