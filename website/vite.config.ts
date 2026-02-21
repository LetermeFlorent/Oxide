/**
 * Project: Oxide Website
 * Responsibility: Vite Configuration
 * License: O.A.S - MS-RSL
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
