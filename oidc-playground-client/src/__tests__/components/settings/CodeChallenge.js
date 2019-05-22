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
