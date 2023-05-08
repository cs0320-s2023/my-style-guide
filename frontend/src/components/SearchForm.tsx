import { useState, useRef, useEffect } from "react";
import "../styles/App.css";
import { searchFont } from "../utils/elements";
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

  // const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = e.target.value;
  //   setFormState({
  //     ...formState,
  //     [e.target.name]: value,
  //   });
  // };

  // credit to https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187

  function stringToHex(color: string) {
    var ctx = document.createElement("canvas").getContext("2d");
    if (ctx != null) {
      ctx.fillStyle = color;
      return ctx.fillStyle;
    }
  }

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

    if (colorKeyword == undefined || fontKeyword == undefined) {
      setOutputText(
        "Invalid input. Please enter a color and font keyword to continue!"
      );
      setDataText("");
    } else {
      setOutputText("Success!");
      setDataText(
        "Currently generating a style guide for:" +
          " " +
          colorKeyword +
          " " +
          fontKeyword
      );
    }

    const serverBaseUrl: string = "http://localhost:3232";

    //api call for color
    const colorResponse = await fetch(
      serverBaseUrl + "/color?keyword=" + colorKeyword
    );
    const colorResponseJSON = await colorResponse.json();
    // check whether success or failure !!
    const hslVal = colorResponseJSON.val;

    const colorApiCall = await fetch(
      "https://www.thecolorapi.com/scheme?hsl=" + hslVal + "&count=4"
    );
    const colorApiJSON = await colorApiCall.json();
    const colorScheme = colorApiJSON.colors;
    var hexVals = [];
    for (let i = 0; i < 4; i++) {
      let val = colorScheme[i].hex.value;
      hexVals.push(val);
    }
    props.setHex(hexVals);

    //api call for font
    const fontResponse = await fetch(
      serverBaseUrl + "/font?adj=" + fontKeyword
    );
    const fontResponseJSON = await fontResponse.json();
    // check whether success or failure !!
    const font = fontResponseJSON.font;
    console.log(fontResponseJSON.font); // getting undefined
    props.setFont("Times New Roman");

    setFormState({
      color1: hexVals[0],
      color2: hexVals[1],
      color3: hexVals[2],
      color4: hexVals[3],
      font: font,
    });
  }

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
  });

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
