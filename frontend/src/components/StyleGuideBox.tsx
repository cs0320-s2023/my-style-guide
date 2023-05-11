import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/App.css";
import SearchForm from "./SearchForm";

interface StyleGuideBoxProps {
  hex: string[];
  font: string;
  serif: string;
}

export default function StyleGuideBox(props: StyleGuideBoxProps) {

  return (
    <div
      className="style-guide-box-wrapper"
      aria-live="assertive"
      role="style-guide-box"
    >
      <h5>COLORS</h5>
      <div className="style-guide-box-colors" aria-live="assertive">
        <div className="card">
          <div className="color-swatch-1" role="color-swatch-1"></div>
          <div className="hex-1">{props.hex[0]}</div>
        </div>
        <div className="card">
          <div className="color-swatch-2" role="color-swatch-2"></div>
          <div className="hex-1">{props.hex[1]}</div>
        </div>
        <div className="card">
          <div className="color-swatch-3" role="color-swatch-3"></div>
          <div className="hex-1">{props.hex[2]}</div>
        </div>
        <div className="card">
          <div className="color-swatch-4" role="color-swatch-4"></div>
          <div className="hex-1">{props.hex[3]}</div>
        </div>
      </div>

      <div className="style-guide-box-wrapper-bottom">
        <h5>TYPEFACE</h5>
        <h5>BUTTONS</h5>
        <div className="style-guide-box-type" aria-live="assertive">
          <p>Aa</p>
          <h6>{props.font}</h6>
          <div className="typography-1">H1: 32px</div>
          <div className="typography-2">H2: 24px</div>
          <div className="typography-3">H3: 20px</div>
          <div className="typography-4">P: 16px</div>
        </div>
        <div className="style-guide-box-button" aria-live="assertive">
          <button className="button-primary">Primary</button>
          <button className="button-primary-hover">Hover</button>

          <button className="button-secondary">Secondary</button>
          <button className="button-primary">Hover</button>

          <button className="button-active">Active</button>
          <button className="button-disabled">Disabled</button>
        </div>
      </div>
    </div>
  );
}
