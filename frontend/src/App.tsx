import React, { useEffect, useState } from "react";
import "./styles/App.css";
import StyleGuideBox from "./components/StyleGuideBox";
import SearchForm from "./components/SearchForm";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [hex, setHex] = useState<string[]>([
    "000000",
    "000000",
    "000000",
    "000000",
  ]);

  return (
    <div className="App">
      <SearchForm hex={hex} setHex={setHex} />
      <StyleGuideBox hex={hex} />
    </div>
  );
}

export default App;
