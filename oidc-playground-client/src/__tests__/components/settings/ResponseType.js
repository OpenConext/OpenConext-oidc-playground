import React from "react";
import { shallow } from "enzyme";
import { ResponseType } from "components/settings";

const props = {
  options: [],
  moderators: {
    auth_protocol: "",
    grant_type: ""
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

  describe("with auth_protocol OpenID", () => {
    const auth_protocol = "OpenID";

    it("with grant_type authorization_code", () => {
      setSelectProps({ auth_protocol, grant_type: "authorization_code" });
      expect(selectProps.options).toEqual(["code"]);
    });

    it("with grant_type implicit", () => {
      setSelectProps({ auth_protocol, grant_type: "implicit" });
      expect(selectProps.options).toEqual(["id_token", "thing"]);
    });

    it("with grant_type client_credentials", () => {
      setSelectProps({ auth_protocol, grant_type: "client_credentials" });
      expect(selectProps.options).toEqual(["token", "id_token"]);
    });
  });

  describe("with auth_protocol Oauth2", () => {
    const auth_protocol = "Oauth2";

    it("with grant_type authorization_code", () => {
      setSelectProps({ auth_protocol, grant_type: "authorization_code" });
      expect(selectProps.options).toEqual(["code"]);
    });

    it("with grant_type implicit", () => {
      setSelectProps({ auth_protocol, grant_type: "implicit" });
      expect(selectProps.options).toEqual(["token"]);
    });

    it("with grant_type client_credentials", () => {
      setSelectProps({ auth_protocol, grant_type: "client_credentials" });
      expect(selectProps.options).toEqual(["token"]);
    });
  });
});
