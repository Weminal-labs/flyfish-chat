import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Import assets
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <ToastContainer />
  </BrowserRouter>
);
