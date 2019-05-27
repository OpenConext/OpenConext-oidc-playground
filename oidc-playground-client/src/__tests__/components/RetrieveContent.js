import React from "react";
import { shallow } from "enzyme";
import { RetrieveContent } from "components";

it("renders without crashing", () => {
  shallow(<RetrieveContent />);
});

it("disabled button when info is not present", () => {
  const comp = shallow(
    <RetrieveContent
      introspect_endpoint="present"
      userinfo_endpoint=""
      jwks_uri={null}
    />
  );

  expect(comp.find(".introspect").props().disabled).toEqual(false);
  expect(comp.find(".userinfo").props().disabled).toEqual(true);
  expect(comp.find(".jwks").props().disabled).toEqual(true);
});
