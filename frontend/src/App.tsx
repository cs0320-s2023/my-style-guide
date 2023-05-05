import React, { useEffect, useState } from "react";
import "./styles/App.css";
import StyleGuideBox from "./components/StyleGuideBox";
import SearchForm from "./components/SearchForm";
import SearchBox from "./components/SearchBox";

function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="App">
      <SearchForm />
      <StyleGuideBox />
    </div>
  );
}

export default App;
