import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";

import App from "./app"

import "./index.css";
import "mafs/font.css";

const rootElement=document.getElementById("root")
if (!rootElement?.innerHTML){
  const root=ReactDOM.createRoot(rootElement!)
  root.render(
    <StrictMode>
      <App/>
    </StrictMode>
  )
}
