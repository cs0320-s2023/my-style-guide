import React, {useEffect, useRef, useState} from "react";
import "mapbox-gl/dist/mapbox-gl.css"
import "../styles/App.css"
import { geoLayer, keywordLayer, overlayData } from "../utils/overlays";
import SearchForm from "./SearchForm";

export default function StyleGuideBox() {
  const [mapOverlay, setMapOverlay] = useState<GeoJSON.FeatureCollection | undefined>(undefined);

  useEffect(() => {
    overlayData().then((r) => {
      setMapOverlay(r);
    });
  }, []);

  return (
    <div className="StyleGuideBox" role="guide-container">
      Empty Space...
    </div>
  );
}