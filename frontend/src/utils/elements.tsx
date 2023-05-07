//import { REPLFunction } from "../REPLFunction.js";

/**
 * For making the API call to gather the overlay data upon a search
 * @param keyword
 * @returns
 */
// export async function searchColor(
//   keyword: string
// ): Promise<string | undefined> {
//   return new Promise((resolve, reject) => {
//     colorSearchAPICall(keyword).then((data) => {
//       const json = JSON.parse(data);
//       resolve(json);
//     });
//   });
// }

/**
 * For making the API call to gather the overlay data upon a search
 * @param keyword
 * @returns
 */
export async function searchFont(keyword: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    fontAPICall(keyword).then((rl_data) => {
      //const rl_json = JSON.parse(rl_data);
      resolve("success");
    });
  });
}

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
  })
  // return hexVals;
  // return new Promise((resolve, reject) => {
  //   fetch("https://www.thecolorapi.com/scheme?hex=" + keyword)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log(json);
  //       resolve(json);
  //       // if (isLoadSuccessRes(json)) {
  //       //   resolve(json.filepath);
  //       // } else if (isLoadFailRes(json)) {
  //       //   resolve(json.error_message);
  //       // } else {
  //       //   resolve("Return type was not a valid response type.");
  //       // }
  //     })
  //     .catch((e) => {
  //       resolve(e.message);
  //     });
  // });
}

function fontAPICall(keyword: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:3232/font?adj=" + keyword)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (isLoadSuccessRes(json)) {
          resolve(json.filepath);
        } else if (isLoadFailRes(json)) {
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
 * Interface for a successful response
 */
interface LoadSuccessResponse {
  result: string;
  filepath: string;
}

/**
 * Interface for a failed load response
 */
interface LoadFailureResponse {
  result: string;
  error_message: string;
}

/**
 * Function for a successful load response
 * @param rjson - JSON response from the backend
 * @returns - boolean, true if the response is a LoadSuccessResponse
 */
function isLoadSuccessRes(rjson: any): rjson is LoadSuccessResponse {
  if (!("result" in rjson)) return false;
  if (!("filepath" in rjson)) return false;
  return true;
}

/**
 * Function for a failed load response
 * @param rjson - JSON response from the backend
 * @returns - boolean, true if the response is a LoadFailureResponse
 */
function isLoadFailRes(rjson: any): rjson is LoadFailureResponse {
  if (!("result" in rjson)) return false;
  if (!("error_message" in rjson)) return false;
  return true;
}
