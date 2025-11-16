// src/popup.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Popup from "./components/proxyPopup/Popup";
const App: React.FC = () => {
  return <Popup />;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
