import { createRoot } from "react-dom/client";

import App from "./App";
import { ErrorBoundary } from "@/components/error-boundary";

import "./index.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  let isRefreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (isRefreshing) return;
    isRefreshing = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      })
      .then((registration) => registration.update())
      .catch((error) => {
        console.warn("Impossibile attivare la modalità offline", error);
      });
  });
}

createRoot(document.getElementById("root")!, {
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
