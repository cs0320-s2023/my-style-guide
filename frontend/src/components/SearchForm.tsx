import { useState, useRef, useEffect } from "react";
import "../styles/App.css";
import {
  callAPI,
  isLoadSuccessRes,
  colorSearchAPICall,
  fontSearchAPICall,
  isLoadFailRes,
} from "../utils/elements";
import SearchBox from "./SearchBox";

interface SearchFormProps {
  hex: string[];
  setHex: React.Dispatch<React.SetStateAction<string[]>>;
  font: string;
  setFont: React.Dispatch<React.SetStateAction<string>>;
}

// Function to render a form that contains an input box and a submit button
export default function SearchForm(props: SearchFormProps) {
  const [outputText, setOutputText] = useState("Waiting for input...");
  const [dataText, setDataText] = useState("");
  const keywordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusKeyword = (event: KeyboardEvent) => {
      if (event.key === "PageDown") {
        if (keywordInputRef.current !== null) {
          keywordInputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", focusKeyword);
  });

  const [formState, setFormState] = useState({
    color1: "Black",
    color2: "Black",
    color3: "Black",
    color4: "Black",
    font: "Inter",
  });

  /**
   * Sets the style guide based on the search data using the keyword
   */
  async function handleSearch(content: string) {
    props.setHex([]);
    let tokens = content.split(" ");
    let colorKeyword = tokens[0];
    let fontKeyword = tokens[1];

    console.log(content);
    console.log(colorKeyword);
    console.log(fontKeyword);

    const serverBaseUrl: string = "http://localhost:3232";

    // //api call for color
    // const colorResponse = await fetch(
    //   serverBaseUrl + "/color?keyword=" + colorKeyword
    // );
    // const colorResponseJSON = await colorResponse.json();
    // // check whether success or failure !!
    // const hslVal = colorResponseJSON.val;

    // const colorApiCall = await fetch(
    //   "https://www.thecolorapi.com/scheme?hsl=" + hslVal + "&count=4"
    // );
    // const colorApiJSON = await colorApiCall.json();
    // const colorScheme = colorApiJSON.colors;
    // var hexVals = [];
    // for (let i = 0; i < 4; i++) {
    //   let val = colorScheme[i].hex.value;
    //   hexVals.push(val);
    // }
    // props.setHex(hexVals);

    const colorUrl = serverBaseUrl + "/color?keyword=" + colorKeyword;
    const colorResponseJson = await callAPI(colorUrl);
    console.log(colorResponseJson);
    //this is where I think i'm not checking for success and failure correctly?
    if (colorResponseJson != undefined) {
      const colorScheme = await colorSearchAPICall(colorResponseJson);
      props.setHex(colorScheme);
      setFormState({
        color1: colorScheme[0],
        color2: colorScheme[1],
        color3: colorScheme[2],
        color4: colorScheme[3],
        font: props.font,
      });
      setOutputText("Displaying guide...");
    } else {
      setOutputText("Please input a valid keyword!");
    }

    //api call for font
    const fontURL = serverBaseUrl + "/font?adj=" + fontKeyword;
    const fontResponseJson = await callAPI(fontURL);
    console.log(fontResponseJson);
    //this is where I think i'm not checking for success and failure correctly?
    //this is also not working rn
    if (fontResponseJson != undefined) {
      const fontResponse = await fontSearchAPICall(fontResponseJson);
      props.setFont(fontResponse);
      setFormState({
        color1: props.hex[0],
        color2: props.hex[1],
        color3: props.hex[2],
        color4: props.hex[3],
        font: fontResponse,
      });
      setOutputText("Displaying guide...");
    } else {
      setOutputText("Please input a valid keyword!");
    }
  }

  /**
   * Updates the UI to reflect the generated style guide
   */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-swatch-1",
      formState.color1
    );
    document.documentElement.style.setProperty(
      "--color-swatch-2",
      formState.color2
    );
    document.documentElement.style.setProperty(
      "--color-swatch-3",
      formState.color3
    );
    document.documentElement.style.setProperty(
      "--color-swatch-4",
      formState.color4
    );
    document.documentElement.style.setProperty(
      "--button-primary",
      formState.color1
    );
    document.documentElement.style.setProperty(
      "--button-secondary",
      formState.color1
    );
    document.documentElement.style.setProperty(
      "--button-active",
      formState.color2
    );
    document.documentElement.style.setProperty("--header-1", formState.font);
    document.documentElement.style.setProperty("--header-2", formState.font);
    document.documentElement.style.setProperty("--body", formState.font);
  }, [formState]);

  return (
    <div>
      <div className="left-container">
        <h3>My Style Guide</h3>
        <h4>
          Create a unique UI style guide with My Style Guide! Just input a
          desired <b>color</b> and <b>theme</b> to get a custom style guide with
          colors and fonts.
        </h4>
        <h4>
          For example: <b>crimson professional</b>
        </h4>
      </div>

      <SearchBox onSearch={handleSearch} />

      <hr></hr>

      <div className="left-container">
        <div>
          <h4>
            <b>{outputText}</b>
          </h4>
        </div>

        <div>
          <h4>
            <b>{dataText}</b>
          </h4>
        </div>
      </div>
    </div>
  );
}
