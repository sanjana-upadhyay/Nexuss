import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1c1917",
            color: "#ede9e3",
            border: "1px solid #33302c",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: { primary: "#4c7a73", secondary: "#12100f" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#12100f" },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);