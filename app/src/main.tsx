/**
 * @file main.tsx
 * @description Application entry point for Oxide AI IDE
 * Initializes React with error boundary and storage diagnostics
 * 
 * Features:
 * - Error boundary for graceful error handling
 * - Local storage size monitoring
 * - Global error catching
 * - Smooth loading transition
 * 
 * @module main
 */

import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import React from "react";
import { invoke } from "@tauri-apps/api/core";

// --- LOG REDIRECTION FOR AUTOMATED DEBUGGING ---
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

const remoteLog = (level: string, ...args: any[]) => {
  const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  invoke('log_to_file', { message: `[${level.toUpperCase()}] ${message}` }).catch(() => {});
};

console.log = (...args) => { originalLog(...args); remoteLog('log', ...args); };
console.error = (...args) => { originalError(...args); remoteLog('error', ...args); };
console.warn = (...args) => { originalWarn(...args); remoteLog('warn', ...args); };
// -----------------------------------------------

console.log("[Main] Starting React application...");

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * @class ErrorBoundary
 */
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Check local storage size for debugging purposes
 * Monitors workspace storage usage to detect potential issues
 */
try {
  const storeKey = 'oxide-workspace-storage-v1';
  const data = localStorage.getItem(storeKey);
  if (data) {
    const sizeMB = (data.length / (1024 * 1024)).toFixed(2);
    console.log(`[Main] Storage size: ${sizeMB} MB`);
  }
} catch (e) {
  console.error("[Main] Storage check failed", e);
}

/**
 * Global error handler for uncaught exceptions
 * Catches errors that bubble up to the window level
 */
window.onerror = (msg, url, line, col, error) => {
  console.error("[Global Error]", { msg, url, line, col, error });
};

/**
 * Mount the React application to the DOM
 * Wraps the app in an ErrorBoundary for crash protection
 */
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} else {
  console.error("[Main] Root element not found!");
}
