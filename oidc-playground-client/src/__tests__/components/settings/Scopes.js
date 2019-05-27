import React from "react";
import { shallow } from "enzyme";
import { Scopes } from "components/settings";

const props = {
  moderators: {},
  options: [],
  value: []
};

it("renders without crashing", () => {
  shallow(<Scopes {...props} />);
});

describe("auth_protocol", () => {
  var selectProps;

  const setSelectProps = auth_protocol => {
    selectProps = shallow(<Scopes {...props} moderators={{ auth_protocol }} />)
      .update()
      .find(".select-scopes")
      .props();
  };

  describe("Oauth2", () => {
    beforeAll(() => {
      setSelectProps("Oauth2");
    });

    it("does not add openid scope to value", () => {
      expect(selectProps.value.includes("openid")).toEqual(false);
    });

    it("does not add openid scope to fixedValues", () => {
      expect(selectProps.fixedValues.includes("openid")).toEqual(false);
    });
  });

  describe("OpenID", () => {
    beforeAll(() => {
      setSelectProps("OpenID");
    });

    it("adds openid scope to value", () => {
      expect(selectProps.value.includes("openid")).toEqual(true);
    });

    it("adds openid scope to fixedValues", () => {
      expect(selectProps.fixedValues.includes("openid")).toEqual(true);
    });
  });
});
