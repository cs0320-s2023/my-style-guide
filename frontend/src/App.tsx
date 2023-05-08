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

  return (
    <div className="App">
      <SearchForm hex={hex} setHex={setHex} font={font} setFont={setFont} />
      <StyleGuideBox hex={hex} font={font} />
    </div>
  );
}

export default App;
