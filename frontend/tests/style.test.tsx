import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import userEvent from "@testing-library/user-event";
import SearchForm from "../src/components/SearchForm";
import StyleGuideBox from "../src/components/StyleGuideBox";

let input: HTMLInputElement;
let button: HTMLElement;

// set up test environment
beforeEach(() => {
  render(<App />);
  input = screen.getByRole("search-box", { name: "Search box" });
  button = screen.getByRole("button", { name: "Search button" });
});

describe("render SearchForm and StyleGuideBox", () => {
  test("SearchForm and StyleGuideBox display without crashing", () => {
    const searchForm = screen.getByRole("search-box");
    const styleGuideBox = screen.getByRole("style-guide-box");
    expect(searchForm).toBeInTheDocument();
    expect(styleGuideBox).toBeInTheDocument();
  });
});

describe("render colors", () => {
  test("SearchForm and StyleGuideBox display without crashing", () => {
    const color1 = screen.getByRole("color-swatch-1");
    const color2 = screen.getByRole("color-swatch-2");
    const color3 = screen.getByRole("color-swatch-3");
    const color4 = screen.getByRole("color-swatch-4");
    expect(color1).toBeInTheDocument();
    expect(color2).toBeInTheDocument();
    expect(color3).toBeInTheDocument();
    expect(color4).toBeInTheDocument();
  });
});

test("user input valid", async () => {
  let user = userEvent.setup();
  await user.type(input, "red hi");
  await user.click(button);
  expect(
    await screen.findByText("Displaying style guide for: red hi")
  ).toBeInTheDocument();
});
