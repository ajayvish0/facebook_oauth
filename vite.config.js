// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    outDir: "dist",
  },
  publicDir: "public",

  // server: {
  //   https: true,
  //   host: "localhost",
  //   port: 3000,
  // },
});
