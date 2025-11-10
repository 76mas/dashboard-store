import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EventProvider from "./context/maping.jsx";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ProductsTable from "./components/ProductsTable.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventProvider>
      <BrowserRouter basename="/dashboard">
        <App />
      </BrowserRouter>
    </EventProvider>
  </StrictMode>
);
