import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  }
})
