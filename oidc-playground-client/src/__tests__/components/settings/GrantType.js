import React from "react";
import { shallow } from "enzyme";
import { GrantType } from "components/settings";

const props = {
  moderators: {},
  options: []
};

it("renders without crashing", () => {
  shallow(<GrantType {...props} />);
});

it("removes refresh_token from options before passing options to select", () => {
  const comp = shallow(<GrantType {...props} options={["abc", "123", "refresh_token"]} />);
  const selectProps = comp.find(".select-grant-type").props();

  expect(selectProps.options).toEqual(["abc", "123"]);
});
