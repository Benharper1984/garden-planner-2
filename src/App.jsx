import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import gardenImage from "./assets/gardenlayout.png";

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
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("garden-icons", JSON.stringify(icons));
  }, [icons]);

  const handleImageClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempCoords({ x, y });
    setInputPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setInputValue("");
    setShowInput(true);
  };

  const handleLabelSubmit = () => {
    if (inputValue.trim() !== "") {
      setIcons([...icons, { ...tempCoords, label: inputValue }]);
    }
    setShowInput(false);
  };

  const handleDragEnd = (index, e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
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

  const handleLabelChange = (index, newLabel) => {
    const updatedIcons = [...icons];
    updatedIcons[index].label = newLabel;
    setIcons(updatedIcons);
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={clearAllIcons}>Clear All</button>
        <button onClick={exportLayout}>Export Layout</button>
      </div>
      <div className="container" ref={containerRef} onClick={handleImageClick}>
        <img src={gardenImage} className="garden-image" alt="Garden Layout" />

        {icons.map((icon, index) => (
          <div
            key={index}
            className="icon"
            style={{ top: `${icon.y}%`, left: `${icon.x}%` }}
            draggable
            onDragEnd={(e) => handleDragEnd(index, e)}
            onClick={(e) => handleIconClick(index, e)}
          >
            🌱
            {selectedIcon === index && (
              <div className="tooltip">
                <input
                  type="text"
                  value={icon.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        ))}

        {showInput && (
          <div
            className="tooltip"
            style={{ position: "absolute", top: inputPos.y, left: inputPos.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              type="text"
              placeholder="Enter label"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLabelSubmit()}
            />
            <button onClick={handleLabelSubmit}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
