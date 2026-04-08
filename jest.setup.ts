// jest.setup.ts
import "@testing-library/jest-dom";

import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

