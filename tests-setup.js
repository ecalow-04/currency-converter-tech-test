import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { setAutoFreeze } from "immer";

setAutoFreeze(false);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
