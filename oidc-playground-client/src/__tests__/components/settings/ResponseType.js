import React from "react";
import { shallow } from "enzyme";
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

describe("sanitizing the options passed to select", () => {
  var selectProps;

  const setSelectProps = moderators => {
    const comp = shallow(
      <ResponseType
        moderators={moderators}
        options={["code", "token", "id_token", "thing"]}
      />
    );

    selectProps = comp.find(".select-response-type").props();
  };

  describe("with authProtocol OpenID", () => {
    const authProtocol = "OpenID";

    it("with grantType authorization_code", () => {
      setSelectProps({ authProtocol, grantType: "authorization_code" });
      expect(selectProps.options).toEqual(["token"]);
    });

    it("with grantType implicit", () => {
      setSelectProps({ authProtocol, grantType: "implicit" });
      expect(selectProps.options).toEqual(["id_token", "thing"]);
    });

    it("with grantType client_credentials", () => {
      setSelectProps({ authProtocol, grantType: "client_credentials" });
      expect(selectProps.options).toEqual(["token", "id_token"]);
    });
  });

  describe("with authProtocol Oauth2", () => {
    const authProtocol = "Oauth2";

    it("with grantType authorization_code", () => {
      setSelectProps({ authProtocol, grantType: "authorization_code" });
      expect(selectProps.options).toEqual(["code"]);
    });

    it("with grantType implicit", () => {
      setSelectProps({ authProtocol, grantType: "implicit" });
      expect(selectProps.options).toEqual(["token"]);
    });

    it("with grantType client_credentials", () => {
      setSelectProps({ authProtocol, grantType: "client_credentials" });
      expect(selectProps.options).toEqual(["token"]);
    });
  });
});
