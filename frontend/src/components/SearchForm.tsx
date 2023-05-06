import { useState, useRef, useEffect } from "react";
import "../styles/App.css";
import StyleGuideBox from "./StyleGuideBox";
import { searchColor, searchFont } from "../utils/elements";
import SearchBox from "./SearchBox";

interface SearchFormProps {
  hex: string[];
  setHex: React.Dispatch<React.SetStateAction<string[]>>;
}

// Function to render a form that contains an input box and a submit button
export default function SearchForm(props: SearchFormProps) {
  const [outputText, setOutputText] = useState(
    "Select preferences to create a personalized style guide!"
  );

  const [dataText, setDataText] = useState("none");
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
    color: "Black",
    font: "Inter",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormState({
      ...formState,
      [e.target.name]: value,
    });
  };

  // credit to https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187

  function stringToHex(color: string) {
    var ctx = document.createElement("canvas").getContext("2d");
    if (ctx != null) {
      ctx.fillStyle = color;
      return ctx.fillStyle;
    }
  }

  // old method from ezra's stencil--not currently using
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    var hexColor = stringToHex(formState.color);
    if (hexColor != null) {
      hexColor = hexColor.substring(1);
    }

    let { color } = { ...formState };
    let url = `http://localhost:3232/color?` + hexColor;
    const responseJson = await searchColor(url);
    if (responseJson != null) {
      //setFormState(responseJson);
      setOutputText("Displaying guide...");
      console.log(hexColor);
      // setDataText(
      //   `Latitude range: [${minLat}, ${maxLat}] . . . Longitude range: [${minLon}, ${maxLon}]`
      // );
      document.documentElement.style.setProperty("--color-swatch-1", color);
    } else {
      setOutputText("responseJson");
    }
  };

  /**
   * Sets the style guide based on the search data using the keyword
   */
  const handleSearch = (content: string) => {
    props.setHex([]);
    let tokens = content.split(" ");
    let colorKeyword = tokens[0];
    let fontKeyword = tokens[1];

    let hexColor: string = stringToHex(colorKeyword)!;
    if (hexColor != undefined) {
      hexColor = hexColor.substring(1);
    }

    searchColor(hexColor).then((data) => {
      //console.log(data);
      //console.log(colorKeyword);
      setOutputText("Success!");
    });

    searchFont(fontKeyword).then((data) => {
      //console.log(fontKeyword);
    });

    const hexList = [hexColor, "hex2", "hex3", "hex4"];
    props.setHex(hexList);

    setFormState({ color: "#" + hexColor, font: "Times New Roman" });
    setDataText(colorKeyword + " " + fontKeyword);
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-swatch-1",
      formState.color
    );
    document.documentElement.style.setProperty(
      "--color-swatch-2",
      formState.color
    );
    document.documentElement.style.setProperty(
      "--color-swatch-3",
      formState.color
    );
    document.documentElement.style.setProperty(
      "--color-swatch-4",
      formState.color
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

      <div className="left-container">
        <div>
          <h4>Result: {outputText}</h4>
        </div>

        <div>
          <h4>
            Currently generating a style guide for: <b>{dataText}</b>
          </h4>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        role="search-form"
        className="form-container"
      >
        <div>
          <b>Categories</b>
        </div>
        <label>Color scheme:</label>
        <select
          name="dog-names"
          id="dog-names"
          value={formState.color}
          onChange={handleInputChange}
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="black">Black</option>
        </select>
        <label>Font:</label>
        <select
          name="fonts"
          id="fonts"
          //value={formState.font}
          onChange={handleInputChange}
        >
          <option value="comfortable">Comfortable</option>
          <option value="bold">Bold</option>
          <option value="light">Light</option>
          <option value="smooth">Smooth</option>
          <option value="classic">Classic</option>
        </select>
        <label> Theme: </label>
        <select
          name="themes"
          id="themes"
          //value={formState.theme}
          onChange={handleInputChange}
        >
          <option value="education">Education</option>
          <option value="health">Medical</option>
          <option value="business">Business</option>
          <option value="food">Food</option>
          <option value="personal">Personal</option>
        </select>

        <button
          role="generate-button"
          aria-label="Generate Button"
          aria-roledescription="Click here to generate style guide using your selected options."
          className="button"
          type="submit"
          onClick={() => handleInputChange}
        >
          Generate Style Guide!
        </button>
      </form>
    </div>
  );
}
