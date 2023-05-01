import { useState, useRef, useEffect } from "react";
import { callAPI, isFeatureCollection } from "../utils/overlays";
import "../styles/App.css";
import StyleGuideBox from "./StyleGuideBox";

// Function to render a form that contains an input box and a submit button
export default function SearchForm() {
  const [outputText, setOutputText] = useState(
    "Select preferences to create a personalized style guide!"
  );
  const [dataText, setDataText] = useState("none");
  const coordInputRef = useRef<HTMLInputElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusCoord = (event: KeyboardEvent) => {
      if (event.key === "PageUp") {
        if (coordInputRef.current !== null) {
          coordInputRef.current.focus();
        }
      }
    };
    const focusKeyword = (event: KeyboardEvent) => {
      if (event.key === "PageDown") {
        if (keywordInputRef.current !== null) {
          keywordInputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", focusCoord);
    window.addEventListener("keydown", focusKeyword);
  });

  const [formState, setFormState] = useState({
    color: "Red",
    font: "Comfortable",
    theme: "Education",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormState({
      ...formState,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let url = ``;
    let { color, font, theme } = { ...formState };
    //url = `http://localhost:3232/cosearch?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}`;
    const responseJson = await callAPI(url);
    if (isFeatureCollection(responseJson)) {
      //setStyleGuide(responseJson);
      setOutputText("Displaying guide...");
      // setDataText(
      //   `Latitude range: [${minLat}, ${maxLat}] . . . Longitude range: [${minLon}, ${maxLon}]`
      // );
    } else {
      setOutputText(responseJson);
    }
  };

  let newColors: Array<string> = new Array();
  const newColor1 = "#FF0000";
  const newColor2 = "#AA4A44";
  const newColor3 = "#EE4B2B";
  const newColor4 = "#880808";

  function setColor(newColor: string[]) {
    newColors.push(newColor1, newColor2, newColor3, newColor4);
    document.documentElement.style.setProperty(
      "--color-swatch-1",
      formState.color
    );
    document.documentElement.style.setProperty("--color-swatch-2", newColor[1]);
    document.documentElement.style.setProperty("--color-swatch-3", newColor[2]);
    document.documentElement.style.setProperty("--color-swatch-4", newColor[3]);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} role="form" className="form-container">
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

        <button onClick={() => setColor(newColors)}>Change colors!</button>

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
    </div>
  );
}
