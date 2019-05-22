import React from "react";
import { shallow } from 'enzyme';
import { ResponseType } from "components/settings";

const props = {
  options: [],
  moderators: {
    authProtocol: "",
    grantType: ""
  }
};

it("renders without crashing", () => {

  shallow(<ResponseType {...props} />);
});
