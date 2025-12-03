import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const HelpPage: React.FC = () => {
  return <div className="min-h-screen bg-gray-50">Help page</div>;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<HelpPage />);
