import React from "react";
import { shallow } from "enzyme";
import { CodeChallenge } from "components/settings";

const props = {
  moderators: {},
  codeChallenge: { onChange: () => {} },
  codeChallengeMethod: { onChange: () => {} }
};

it("renders without crashing", () => {
  shallow(<CodeChallenge {...props} />);
});

it("renders null when grantType is not authorization_code", () => {
  const comp = shallow(<CodeChallenge {...props} />);
  expect(comp.isEmptyRender()).toEqual(true);
});

it("renders when grantType is authorization_code", () => {
  const comp = shallow(
    <CodeChallenge
      {...props}
      moderators={{ grantType: "authorization_code" }}
    />
  );
  expect(comp.isEmptyRender()).toEqual(false);
});
