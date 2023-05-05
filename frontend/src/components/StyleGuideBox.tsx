import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/App.css";
import SearchForm from "./SearchForm";

export default function StyleGuideBox() {
  return (
    <div
      className="style-guide-box-wrapper"
      aria-live="assertive"
      role="style-guide-box"
    >
      <h5>COLORS</h5>
      <div className="style-guide-box-colors" aria-live="assertive">
        <div className="card">
          <div className="color-swatch-1"></div>
          <div className="hex-1">hex1</div>
        </div>
        <div className="card">
          <div className="color-swatch-2"></div>
          <div className="hex-1">hex2</div>
        </div>
        <div className="card">
          <div className="color-swatch-3"></div>
          <div className="hex-1">hex3</div>
        </div>
        <div className="card">
          <div className="color-swatch-4"></div>
          <div className="hex-1">hex4</div>
        </div>
      </div>

      <div className="style-guide-box-wrapper-bottom">
        <h5>FONTS</h5>
        <h5>BUTTONS</h5>
        <div className="style-guide-box-type" aria-live="assertive">
          <div className="typography-1">Heading 1</div>
          <div className="typography-2">Heading 2</div>
          <div className="typography-3">Body</div>
        </div>
        <div className="style-guide-box-button" aria-live="assertive">
          <button>Primary</button>
          <button>Secondary</button>
          <button>Hover</button>
        </div>
      </div>
    </div>
  );
}
