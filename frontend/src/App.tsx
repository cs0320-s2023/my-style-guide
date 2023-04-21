import React, { useEffect, useState } from "react";
import "./styles/App.css";
import StyleGuideBox from "./components/StyleGuideBox";
import SearchForm from "./components/SearchForm";

function App() {
  return (
    <div className="App">
      <SearchForm />
      <StyleGuideBox/>
    </div>
  );
}

export default App;
