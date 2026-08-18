import { render } from "@testing-library/react";
import { ReactSelect } from "components";

const props = {
  options: []
};

it("renders without crashing", () => {
  render(<ReactSelect {...props} />);
});
