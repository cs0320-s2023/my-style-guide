import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/App.css";
import { geoLayer, keywordLayer, overlayData } from "../utils/overlays";
import SearchForm from "./SearchForm";

export default function StyleGuideBox() {
  const [mapOverlay, setMapOverlay] = useState<
    GeoJSON.FeatureCollection | undefined
  >(undefined);

  useEffect(() => {
    overlayData().then((r) => {
      setMapOverlay(r);
    });
  }, []);

  return (
    <div className="style-guide-box" aria-live="assertive">
      <div className="color-swatches">lightblue!</div>
      <div className="color-swatches"></div>
      <div className="color-swatches"></div>
      <div className="color-swatches"></div>
    </div>
  );
}
