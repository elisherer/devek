import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { ViteDevServer, defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

function devApiMock() {
  return {
    name: "devApiMock",
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use((req, res, next) => {
          const call = `${req.method} ${req.originalUrl}`;

          switch (call) {
            case "GET /api/ip": {
              const ip_address = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
              res.setHeader("Content-Type", "application/json");
              res.write(JSON.stringify({ ip_address }));
              return res.end();
            }
          }
          next();
        });
      };
    },
  };
}

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    tailwindcss(),
    devApiMock(),
    VitePWA({
      manifest: false,
      strategies: "generateSW",
      registerType: "autoUpdate", // workbox.clientsClaim = true & workbox.skipWaiting = true
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ event }) => event.request.url === "/" || event.request.url.endsWith(".html"),
            handler: "NetworkFirst",
          },
          {
            urlPattern: /\/api\/.*/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
  build: {},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 8030,
    strictPort: true,
  },
  define: {
    "import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
});
