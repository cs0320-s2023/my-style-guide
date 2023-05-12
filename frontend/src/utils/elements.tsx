/**
 * Makes API call to the backend in order to gather the data relevant to the user's
 * search which will be overlayed on the orginal data
 * @param keyword - String, the term the user is searching for
 * @returns
 */
export async function colorSearchAPICall(hslVal: string): Promise<string[]> {
  const colorApiCall = await fetch(
    "https://www.thecolorapi.com/scheme?hsl=" + hslVal + "&count=4"
  );
  const colorApiJSON = await colorApiCall.json();
  return new Promise((resolve, reject) => {
    const colorScheme = colorApiJSON.colors;
    var hexVals = [];
    for (let i = 0; i < 4; i++) {
      let val = colorScheme[i].hex.value;
      hexVals.push(val);
    }
    resolve(hexVals);
  });
}

export async function fontSearchAPICall(keyword: string): Promise<string> {
  const fontApiCall = await fetch(
    "https://fonts.googleapis.com/css2?family=" +
      keyword +
      "&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  );

  const fontApiJson = await fontApiCall.json();
  return new Promise((resolve, reject) => {
    const font = fontApiJson.font;
    resolve(font);
  });
}

export function callAPI(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        // console.log(json);
        if (isColorSuccessRes(json)) {
          resolve(json.val);
        } else if (isLoadFailRes(json)) {
          resolve(json.error_message);
        } else {
          resolve("Return type was not a valid response type.");
        }
      })
      .catch((e) => {
        resolve("Server not available at this time");
      });
  });
}

/**
 * Interface for a successful response
 */
interface ColorSuccessResponse {
  result: string;
  val: string;
}

/**
 * Interface for a successful response
 */
interface FontSuccessResponse {
  font: string;
  style: string;
}

/**
 * Interface for a failed load response
 */
interface LoadFailureResponse {
  result: string;
  error_message: string;
}

/**
 * Function for a successful load response on color query
 * @param rjson - JSON response from the backend
 * @returns - boolean, true if the response is a LoadSuccessResponse
 */
export function isColorSuccessRes(rjson: any): rjson is ColorSuccessResponse {
  if (!("result" in rjson)) return false;
  if (!("val" in rjson)) return false;
  return true;
}

/**
 * Function for a successful load response on font query
 * @param rjson - JSON response from the backend
 * @returns - boolean, true if the response is a LoadSuccessResponse
 */
export function isFontSuccessRes(rjson: any): rjson is FontSuccessResponse {
  if (!("font" in rjson)) return false;
  if (!("style" in rjson)) return false;
  return true;
}

/**
 * Function for a failed load response
 * @param rjson - JSON response from the backend
 * @returns - boolean, true if the response is a LoadFailureResponse
 */
export function isLoadFailRes(rjson: any): rjson is LoadFailureResponse {
  if (!("result" in rjson)) return false;
  if (!("error_message" in rjson)) return false;
  return true;
}

/**
 * Function to check if a string contains numbers
 * @param str - string input 
 * @returns boolean (true if str contains numbers)
 */
export function isNumeric(str: string) {
  return /\d/.test(str);
}