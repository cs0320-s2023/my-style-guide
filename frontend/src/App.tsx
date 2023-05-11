import React, { useEffect, useState } from "react";
import "./styles/App.css";
import StyleGuideBox from "./components/StyleGuideBox";
import SearchForm from "./components/SearchForm";

function App() {
  const [hex, setHex] = useState<string[]>([
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ]);
  const [font, setFont] = useState("Inter");
  const [serif, setSerif] = useState("sans-serif");

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href={"https://fonts.googleapis.com/css?family=" + font}
      ></link>
      <SearchForm
        hex={hex}
        setHex={setHex}
        font={font}
        serif={serif}
        setSerif={setSerif}
        setFont={setFont}
      />
      <StyleGuideBox hex={hex} font={font} serif={serif} />
    </div>
  );
}

export default App;
