// src/popup.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const App: React.FC = () => {
  return <div>Popup</div>;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
