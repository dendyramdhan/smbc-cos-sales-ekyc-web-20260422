// test/Home.test.tsx
import { render } from "@testing-library/react";
import Home from "@/app/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

import { redirect } from "next/navigation";

describe("Home page redirect", () => {
  it("should call redirect to /ekyc", () => {
    render(<Home />);
    expect(redirect).toHaveBeenCalledWith("/ekyc");
  });
});
