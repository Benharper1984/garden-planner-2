import React, { useState } from "react";
import "./App.css";

const ICON_OPTIONS = [
  { label: "Seedling", icon: "🌱" },
  { label: "Flower", icon: "🌸" },
  { label: "Carrot", icon: "🥕" },
  { label: "Tomato", icon: "🍅" },
  { label: "Tree", icon: "🌳" },
];

function App() {
  const [selectedType, setSelectedType] = useState(ICON_OPTIONS[1].icon);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputPos, setInputPos] = useState({ x: 0, y: 0 });

  const handleLabelSubmit = () => {
    // Handle label submission
    setShowInput(false);
  };

  return (
    <div className="container">
      <div className="toolbar">
        <span className="icon-picker-label">Select Plant Type:</span>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {ICON_OPTIONS.map((option) => (
            <option key={option.label} value={option.icon}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="delete-btn"
          onClick={() => console.log("Delete action")}
          aria-label="Delete plant"
        >
          &times;
        </button>
      </div>
      <img
        src="garden-background.jpg"
        alt="Garden"
        className="garden-image"
        onClick={(e) => {
          const rect = e.target.getBoundingClientRect();
          setInputPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setShowInput(true);
        }}
      />
      {showInput && (
        <div
          className="tooltip"
          style={{ position: "absolute", top: inputPos.y, left: inputPos.x }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <input
            autoFocus
            type="text"
            placeholder="Enter label"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLabelSubmit();
              if (e.key === "Escape") setShowInput(false);
            }}
            aria-label="Enter plant label"
          />
          <button onClick={handleLabelSubmit} aria-label="Add plant">
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default App;