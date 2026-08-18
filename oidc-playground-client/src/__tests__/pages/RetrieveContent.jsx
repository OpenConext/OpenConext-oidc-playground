import React from "react";
import { render } from "@testing-library/react";
import { RetrieveContent } from "pages";

it("renders without crashing", () => {
  render(<RetrieveContent />);
});
