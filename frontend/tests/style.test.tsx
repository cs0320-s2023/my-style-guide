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

test("no input search", async () => {
  let user = userEvent.setup();
  await user.click(button);
  expect(
    await screen.getByText("Invalid input: Please enter exactly two (2) keywords."))
    .toBeInTheDocument();
});

test("one word input search", async () => {
  let user = userEvent.setup();
  await user.type(input, "blue");
  await user.click(button);
  expect(
    await screen.getByText("Invalid input: Please enter exactly two (2) keywords."))
    .toBeInTheDocument();
});

test("invalid color input", async () => {
  let user = userEvent.setup();
  await user.type(input, "key silly");
  await user.click(button);
  expect(
    await screen.findByText("Error - Invalid input: Try a different keyword for your color!")
  ).toBeInTheDocument();

});

test("invalid color input", async () => {
  let user = userEvent.setup();
  await user.type(input, "Blue silly");
  await user.click(button);
  expect(
    await screen.findByText("Error - Invalid input: Try a different keyword for your color!")
  ).toBeInTheDocument();

});

test("space as color input", async () => {
  let user = userEvent.setup();
  await user.type(input, " blue");
  await user.click(button);
  expect(
    await screen.findByText("Error - Please enter keyword for color scheme.")
  ).toBeInTheDocument();

});

test("color input not in color library", async () => {
  let user = userEvent.setup();
  await user.type(input, "mauve silky");
  await user.click(button);
  expect(
    await screen.findByText("Error - Invalid input: Try a different keyword for your color!")
  ).toBeInTheDocument();

});

test("text while searching", async () => {
  let user = userEvent.setup();
  await user.type(input, "green smooth");
  await user.click(button);
  expect(
    await screen.findByText("Waiting for response...")
  ).toBeInTheDocument();
});


test("user input valid", async () => {
  let user = userEvent.setup();
  await user.type(input, "red hi");
  await user.click(button);
  expect(await setTimeout(async () => {
    expect(screen.findByText("Search complete!")).toBeInTheDocument();
  }, 5000));
expect(await setTimeout(async () => {
  expect(screen.findByText("Displaying style guide for: red hi")).toBeInTheDocument();
}, 5000));
});

test("multiple searches", async () => {
  let user = userEvent.setup();
  await user.type(input, "red hi");
  await user.click(button);
  expect(await setTimeout(async () => {
    expect(screen.findByText("Search complete!")).toBeInTheDocument();
  }, 5000));
expect(await setTimeout(async () => {
  expect(screen.findByText("Displaying style guide for: red hi")).toBeInTheDocument();
}, 5000));
await user.type(input, "blue silky");
  await user.click(button);
  expect(await setTimeout(async () => {
    expect(screen.findByText("Search complete!")).toBeInTheDocument();
  }, 5000));
expect(await setTimeout(async () => {
  expect(screen.findByText("Displaying style guide for: blue silky")).toBeInTheDocument();
}, 5000));
});




