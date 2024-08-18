import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import path from "path";

//Remember to run
// npm i @types/node -D

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: false,

    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env),
  },
});
