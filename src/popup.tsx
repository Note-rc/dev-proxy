// src/popup.tsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { loadSavedLocale } from "./i18n";
import Popup from "./components/proxyPopup/Popup";

const App: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSavedLocale().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <Popup />;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
console.log("🚀 ~ root: popup", root);
root.render(<App />);
