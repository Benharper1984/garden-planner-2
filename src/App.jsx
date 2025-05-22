import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import gardenImage from "./assets/gardenlayout.png";

function App() {
  const [icons, setIcons] = useState(() => {
    const saved = localStorage.getItem("garden-icons");
    return saved ? JSON.parse(saved) : [];
  });
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("garden-icons", JSON.stringify(icons));
  }, [icons]);

  const handleImageClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const label = prompt("Enter a label for this plant:");
    if (label) {
      setIcons([...icons, { x, y, label }]);
    }
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

  const handleIconClick = (index, label, e) => {
    e.stopPropagation();
    const input = prompt(`Label: ${label}\nType 'delete' to remove this plant.`);
    if (input === "delete") {
      const updatedIcons = [...icons];
      updatedIcons.splice(index, 1);
      setIcons(updatedIcons);
    }
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
            title={icon.label}
            style={{ top: `${icon.y}%`, left: `${icon.x}%` }}
            draggable
            onDragEnd={(e) => handleDragEnd(index, e)}
            onClick={(e) => handleIconClick(index, icon.label, e)}
          >
            🌱
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
