import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ProviderComponent from "./context";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProviderComponent>
      <App />
      <Toaster />
    </ProviderComponent>
  </BrowserRouter>
);
