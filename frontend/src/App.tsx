import React, { useEffect, useState } from "react";
import "./styles/App.css";
import StyleGuideBox from "./components/StyleGuideBox";
import SearchForm from "./components/SearchForm";

function App() {
  const [style, setStyle] = useState("default");

  const changeStyle = () => {
    setStyle("generated-style-guide");
  };

  return (
    <div className="App">
      <SearchForm />
      <StyleGuideBox />
    </div>
  );
}

export default App;
