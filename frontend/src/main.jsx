import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import { QuestionProvider } from "./context/QuestionContext";
import "./index.css"; // Ensures styles are loaded properly
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <AuthProvider>
      <QuestionProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QuestionProvider>
    </AuthProvider>
  // </React.StrictMode>
);
