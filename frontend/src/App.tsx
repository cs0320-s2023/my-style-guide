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
  const [subFont, setSubFont] = useState("Inter");
  const [serif, setSerif] = useState("sans-serif");
  const [url, setUrl] = useState("https://fonts.googleapis.com/css?family=inter")


  useEffect(() => {
    setUrl("https://fonts.googleapis.com/css?family=" + subFont+"|"+font+"|inter");
  },[font]);

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href={url}
      ></link>
      <SearchForm
        hex={hex}
        setHex={setHex}
        subFont={subFont}
        font={font}
        serif={serif}
        setSerif={setSerif}
        setFont={setFont}
        setSubFont={setSubFont}
      />
      <StyleGuideBox hex={hex} font={font} serif={serif} />
    </div>
  );
}

export default App;
