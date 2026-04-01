import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/index.css'
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>   {/* 🔥 YE SABSE IMPORTANT HAI */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);