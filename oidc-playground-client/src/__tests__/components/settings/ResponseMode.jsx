import { render } from "@testing-library/react";
import { ResponseMode } from "components/settings";

const props = {
  moderators: {},
  onChange: () => {},
  options: []
};

it("renders without crashing", () => {
  render(<ResponseMode {...props} />);
});
