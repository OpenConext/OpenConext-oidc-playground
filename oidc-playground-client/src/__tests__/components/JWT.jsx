import { render } from "@testing-library/react";
import { JWT } from "components";

it("renders without crashing", () => {
  render(<JWT />);
});
