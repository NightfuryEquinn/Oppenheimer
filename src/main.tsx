import { Analytics } from "@vercel/analytics/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
