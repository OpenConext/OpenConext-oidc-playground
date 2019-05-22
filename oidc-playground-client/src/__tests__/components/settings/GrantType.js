import React from "react";
import { shallow } from 'enzyme';
import { GrantType } from "components/settings";

const props = {
  options: []
};

it("renders without crashing", () => {

  shallow(<GrantType {...props} />);
});
