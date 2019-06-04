import React from "react";
import { shallow } from "enzyme";
import { RetrieveContent } from "components";

it("renders without crashing", () => {
  shallow(<RetrieveContent />);
});

it("disabled button when info is not present", () => {
  const comp = shallow(<RetrieveContent introspect_endpoint="present" userinfo_endpoint="" accessToken="abc" />);

  expect(comp.find(".introspect").props().disabled).toEqual(false);
  expect(comp.find(".userinfo").props().disabled).toEqual(true);
});

it("disabled buttons when accessToken is not present", () => {
  const comp = shallow(<RetrieveContent introspect_endpoint="present" />);

  expect(comp.find(".introspect").props().disabled).toEqual(true);
});
