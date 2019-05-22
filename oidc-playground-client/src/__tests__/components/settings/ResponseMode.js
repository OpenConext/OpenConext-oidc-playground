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

it("renders null if grantType is not implicit", () => {
  const comp = shallow(<ResponseMode {...props} />);
  expect(comp.isEmptyRender()).toEqual(true);
});

it("renders if grantType is implicit", () => {
  const comp = shallow(
    <ResponseMode {...props} moderators={{ grantType: "implicit" }} />
  );
  expect(comp.isEmptyRender()).toEqual(false);
});
