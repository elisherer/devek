import { useCallback, useState } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Settings from "./settings";
import themes from "./theme";
import App from "./components/App";

const appElement = document.getElementById("root");

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // refresh when a new version exists
    let refreshing;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    // register service worker
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => console.log("SW registered: ", registration))
      .catch(registrationError => console.error("SW registration failed: ", registrationError));
  });
}

const ThemedApp = () => {
  const [theme, setTheme] = useState(Settings.get("theme"));
  const toggleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
      Settings.set("theme", "light");
    }
    if (theme === "light") {
      setTheme("dark");
      Settings.set("theme", "dark");
    }
  }, [theme]);
  return (
    <ThemeProvider theme={themes[theme]}>
      <BrowserRouter>
        <App toggleTheme={toggleTheme} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

render(<ThemedApp />, appElement);
