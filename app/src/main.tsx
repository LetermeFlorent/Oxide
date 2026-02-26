
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import "xterm/css/xterm.css";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { useStore } from "./store/useStore";

(window as any).oxideReset = () => {
  localStorage.clear();
  useStore.getState().resetWorkspace();
  window.location.reload();
};

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
