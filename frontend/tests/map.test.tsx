import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import MapBox from "../src/components/MapBox"
import { getSearchOverlayMock } from "../src/utils/overlays";

describe("Render MapBox and input components", () => {
  test("MapBox and input component display without crashing", () => {
    render(<MapBox />);
    const map = screen.getByRole("map-container");
    expect(map).toBeInTheDocument();

    const minLatInput = screen.getByRole("min-lat-input");
    const maxLatInput = screen.getByRole("max-lat-input");
    const minLonInput = screen.getByRole("min-lon-input");
    const maxLonInput = screen.getByRole("max-lon-input");
    const keywordInput = screen.getByRole("search-input");

    expect(minLatInput).toBeInTheDocument();
    expect(maxLatInput).toBeInTheDocument();
    expect(minLonInput).toBeInTheDocument();
    expect(maxLonInput).toBeInTheDocument();
    expect(keywordInput).toBeInTheDocument();

    const coordButton = screen.getByRole("coord-button");
    const keywordButton = screen.getByRole("search-button");

    expect(coordButton).toBeInTheDocument();
    expect(keywordButton).toBeInTheDocument();
  });
});

describe("test mock for MapSuccessResponse", () => {
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
