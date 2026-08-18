import React from "react";
import { render } from "@testing-library/react";
import { CodeChallenge } from "components/settings";

const props = {
  moderators: {},
  codeChallenge: { onChange: () => {} },
  codeChallengeMethod: { onChange: () => {} }
};

it("renders without crashing", () => {
  render(<CodeChallenge {...props} />);
});

it("renders null when grant_type is not authorization_code", () => {
  const { container } = render(<CodeChallenge {...props} />);
  expect(container).toBeEmptyDOMElement();
});

it("renders when grant_type is authorization_code", () => {
  const { container } = render(
    <CodeChallenge
      {...props}
      moderators={{ grant_type: "authorization_code" }}
    />
  );
  expect(container).not.toBeEmptyDOMElement();
});
