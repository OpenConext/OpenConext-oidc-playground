import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => React.createElement("i", { className: "fa" })
}));

// jsdom has no window.fetch of its own; Node's global fetch can't resolve
// the app's relative "/oidc/api/..." paths without a real server behind them.
global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
