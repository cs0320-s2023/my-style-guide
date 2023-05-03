import { useState, useRef, useEffect } from "react";
import { callAPI, isFeatureCollection } from "../utils/overlays";
import "../styles/App.css";
import StyleGuideBox from "./StyleGuideBox";
import { searchColor } from "../utils/color";
import SearchBox from "./SearchBox";

// Function to render a form that contains an input box and a submit button
export default function SearchForm() {
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
    color: "Aliceblue",
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
   * Sets the overlay data based on the search data using the keyword
   */
  const handleSearch = (keyword: string) => {
    console.log(keyword);

    var hexColor: string = stringToHex(keyword)!;
    if (hexColor != undefined) {
      hexColor = hexColor.substring(1);
    }

    searchColor(hexColor).then((data) => {
      console.log(data);
      console.log(hexColor);
      setFormState({ color: "#" + hexColor }); // we need to use data here somehow?
      setDataText(keyword);
    });
    document.documentElement.style.setProperty(
      "--color-swatch-1",
      formState.color
    );
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        role="search-form"
        className="form-container"
      >
        <h3>My Style Guide</h3>
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
          value={formState.font}
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
          value={formState.theme}
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

        <br />

        <div>
          <b>Output Message:</b>
        </div>
        <div>{outputText}</div>

        <br />
        <div>
          <b>Current Input:</b>
        </div>
        <div>{dataText}</div>
      </form>
      <SearchBox onSearch={handleSearch} />
    </div>
  );
}
