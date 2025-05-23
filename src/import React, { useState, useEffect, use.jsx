import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import gardenImage from "./assets/gardenlayout.png";

const ICON_OPTIONS = [
  { label: "Seedling", icon: "🌱" },
  { label: "Flower", icon: "🌸" },
  { label: "Carrot", icon: "🥕" },
  { label: "Tomato", icon: "🍅" },
  { label: "Tree", icon: "🌳" },
];

function App() {
  const [icons, setIcons] = useState(() => {
    const saved = localStorage.getItem("garden-icons");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [inputPos, setInputPos] = useState({ x: 0, y: 0 });
  const [tempCoords, setTempCoords] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState(ICON_OPTIONS[0].icon);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("garden-icons", JSON.stringify(icons));
  }, [icons]);

  // Mouse click to add icon
  const handleImageClick = (e) => {
    if (e.target !== containerRef.current && e.target.tagName !== "IMG") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempCoords({ x, y });
    setInputPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setInputValue("");
    setShowInput(true);
  };

  // Touch support for mobile
  const handleImageTouch = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setTempCoords({ x, y });
    setInputPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    setInputValue("");
    setShowInput(true);
  };

  const handleLabelSubmit = () => {
    if (inputValue.trim() !== "") {
      setIcons([...icons, { ...tempCoords, label: inputValue, type: selectedType }]);
    }
    setShowInput(false);
  };

  // Mouse drag end
  const handleDragEnd = (index, e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const updatedIcons = [...icons];
    updatedIcons[index].x = x;
    updatedIcons[index].y = y;
    setIcons(updatedIcons);
  };

  // Touch drag for mobile
  const handleTouchMove = (index, e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    const updatedIcons = [...icons];
    updatedIcons[index].x = x;
    updatedIcons[index].y = y;
    setIcons(updatedIcons);
  };

  const handleIconClick = (index, e) => {
    e.stopPropagation();
    setSelectedIcon(index === selectedIcon ? null : index);
  };

  const clearAllIcons = () => {
    if (window.confirm("Clear all plants?")) {
      setIcons([]);
    }
  };

  const exportLayout = () => {
    const blob = new Blob([JSON.stringify(icons, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "garden-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importLayout = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) setIcons(imported);
        else alert("Invalid layout file.");
      } catch {
        alert("Invalid layout file.");
      }
    };
    reader.readAsText(file);
  };

  const handleLabelChange = (index, newLabel) => {
    const updatedIcons = [...icons];
    updatedIcons[index].label = newLabel;
    setIcons(updatedIcons);
  };

  const handleDeleteIcon = (index) => {
    setIcons(icons.filter((_, i) => i !== index));
    setSelectedIcon(null);
  };

  // Keyboard accessibility for icon selection
  const handleIconKeyDown = (index, e) => {
    if (e.key === "Enter" || e.key === " ") {
      setSelectedIcon(index === selectedIcon ? null : index);
    }
    if (e.key === "Delete" && selectedIcon === index) {
      handleDeleteIcon(index);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={clearAllIcons} aria-label="Clear all plants">Clear All</button>
        <button onClick={exportLayout} aria-label="Export garden layout">Export Layout</button>
        <button onClick={() => fileInputRef.current.click()} aria-label="Import garden layout">Import Layout</button>
        <input
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={importLayout}
        />
        <span className="icon-picker-label">Plant Icon:</span>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          aria-label="Select plant icon"
        >
          {ICON_OPTIONS.map(opt => (
            <option key={opt.icon} value={opt.icon}>{opt.icon} {opt.label}</option>
          ))}
        </select>
      </div>
      <div
        className="container"
        ref={containerRef}
        onClick={handleImageClick}
        onTouchStart={handleImageTouch}
        tabIndex={0}
        aria-label="Garden layout area"
      >
        <img src={gardenImage} className="garden-image" alt="Garden Layout" draggable={false} />
        {icons.map((icon, index) => (
          <div
            key={index}
            className="icon"
            style={{ top: `${icon.y}%`, left: `${icon.x}%` }}
            draggable
            tabIndex={0}
            aria-label={`Plant: ${icon.label}`}
            onDragEnd={(e) => handleDragEnd(index, e)}
            onTouchMove={(e) => handleTouchMove(index, e)}
            onClick={(e) => handleIconClick(index, e)}
            onKeyDown={(e) => handleIconKeyDown(index, e)}
          >
            {icon.type || "🌱"}
            {selectedIcon === index && (
              <div className="tooltip" role="dialog" aria-modal="true">
                <input
                  type="text"
                  value={icon.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Edit plant label"
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteIcon(index)}
                  aria-label="Delete plant"
                  tabIndex={0}
                >🗑️</button>
              </div>
            )}
          </div>
        ))}
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
              onKeyDown={(e) => e.key === "Enter" && handleLabelSubmit()}
              aria-label="Enter plant label"
            />
            <button onClick={handleLabelSubmit} aria-label="Add plant">Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
