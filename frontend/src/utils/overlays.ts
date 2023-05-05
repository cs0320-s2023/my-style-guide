import { FeatureCollection } from "geojson";
import { FillLayer } from "react-map-gl";
import { NoFoundFeats, ProvidenceMockFeats } from "../../tests/mockData";

const propertyName = "holc_grade";
export const geoLayer: FillLayer = {
  id: "geo_data",
  type: "fill",
  paint: {
    "fill-color": [
      "match",
      ["get", propertyName],
      "A",
      "#5bcc04",
      "B",
      "#04b8cc",
      "C",
      "#e9ed0e",
      "D",
      "#d11d1d",
      "#ccc",
    ],
    "fill-opacity": 0.2,
  },
};

export const keywordLayer: FillLayer = {
  id: "keyword_data",
  type: "fill",
  paint: {
    "fill-color": "#ffff00",
    "fill-opacity": 0.5,
  },
};

export function isFeatureCollection(json: any): json is FeatureCollection {
  return json.type === "FeatureCollection";
}

/**
 * Makes the initial call to overlay the entire redlining data map
 * @returns Promise<GeoJSON.FeatureCollection | undefined>
 */
export async function overlayData(): Promise<
  GeoJSON.FeatureCollection | undefined
> {
  const url =
    "http://localhost:3232/cosearch?minLat=-90&maxLat=90&minLon=-180&maxLon=180";
  return new Promise((resolve, reject) => {
    callAPI(url).then((rl_data) => {
      console.log(isFeatureCollection(rl_data));
      resolve(isFeatureCollection(rl_data) ? rl_data : undefined);
    });
  });
}

/**
 * Makes call to back-end server based on user input (coordinates or keyword)
 * @param url
 * @returns Promise<string> containing either a GeoJSON or error message
 */
export function callAPI(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (isMapSuccessResponse(json)) {
          console.log("success response");
          resolve(json.data);
        } else if (isMapFailureResponse(json)) {
          console.log("failure response");
          resolve(json.error_message);
        } else {
          resolve("Return type was not a valid response type.");
        }
      })
      .catch((e) => {
        resolve(e.message);
      });
  });
}

/**
 * Interface for a successful map response
 */
export interface MapSuccessResponse {
  result: string;
  data: string;
}

/**
 * Interface for a failed map response
 */
export interface MapFailureResponse {
  result: string;
  error_message: string;
}

/**
 * Type predicate for a successful map response
 * @param rjson JSON response from the backend
 * @returns true if the response is a MapSuccessResponse, false otherwise
 */
function isMapSuccessResponse(rjson: any): rjson is MapSuccessResponse {
  if (!("result" in rjson)) return false;
  if (!("data" in rjson)) return false;
  return true;
}

/**
 * Type predicate for a failed map response
 * @param rjson JSON response from the backend
 * @returns true if the response is a MapFailureResponse, false otherwise
 */
function isMapFailureResponse(rjson: any): rjson is MapFailureResponse {
  if (!("result" in rjson)) return false;
  if (!("error_message" in rjson)) return false;
  return true;
}

/**
 * This is a map to store mock data for testing purposes.
 */
export const MockData = new Map<string, FeatureCollection | MapFailureResponse>(
  [
    ["Providence", ProvidenceMockFeats],
    ["undefinedKey", NoFoundFeats],
  ]
);

/**
 * Adds a mock response to the map of mock data.
 *
 * @param key - the key to associate with the mock response
 * @param response - the mock response to add to the map
 */
export function addMock(
  key: string,
  response: FeatureCollection | MapFailureResponse
) {
  MockData.set(key, response);
}

export function getSearchOverlayMock(
  keyword: string
): Promise<FeatureCollection | MapFailureResponse | undefined> {
  return Promise.resolve(MockData.get(keyword));
}
