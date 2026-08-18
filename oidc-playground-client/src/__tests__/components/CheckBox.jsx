import { render } from "@testing-library/react";
import { CheckBox } from "components";

const props = {
  name: "example",
  label: "Example checkbox",
  onChange: () => {}
};

it("renders without crashing", () => {
  render(<CheckBox {...props} />);
});
