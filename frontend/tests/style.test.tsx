import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SearchForm from "../src/components/SearchForm";
import StyleGuideBox from "../src/components/StyleGuideBox";
import { getSearchOverlayMock } from "../src/utils/overlays";

describe("Render SearchForm and StyleGuideBox", () => {
  test("MapBox and input component display without crashing", () => {
    //render(<SearchForm />);
    //render(<StyleGuideBox />);
    const searchForm = screen.getByRole("search-form");
    const styleGuideBox = screen.getByRole("style-guide-box");
    expect(searchForm).toBeInTheDocument();
    expect(styleGuideBox).toBeInTheDocument();
  });
});

describe("test mock for LoadSuccessResponse", () => {
  test("returns a valid OverlayResponse for a known location", async () => {
    const mockResponse = await getSearchOverlayMock("Providence");
    expect(mockResponse).toBeDefined();
  });
});

describe("test mock for MapFailureResponse", () => {
  test("returns a valid OverlayResponse for a known location", async () => {
    const mockResponse = await getSearchOverlayMock("undefinedKey");
    expect(mockResponse).toBeDefined();
  });
});
