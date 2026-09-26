import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), svgr()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      proxy: {
        "/api": {
          target:
            env.VITE_API_PROXY_TARGET ||
            "http://13.209.192.134:3000",
          changeOrigin: true,
          secure: false,
          rewrite: (requestPath) =>
            requestPath.replace(/^\/api/, ""),
        },
      },
    },
  };
});