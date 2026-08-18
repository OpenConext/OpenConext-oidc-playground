import { render } from "@testing-library/react";
import { Authorization } from "components";

const props = {
  form: {
    client_id: "",
    client_secret: "",
    jwt_client_secret: ""
  }
};

it("renders without crashing", () => {
  render(<Authorization {...props} />);
});
