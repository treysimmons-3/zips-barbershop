import path from "node:path";
import { defineConfig } from "vite";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

if (!Number.isFinite(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineConfig({
  // Relative asset URLs work both at a domain root and under a GitHub Pages repo path.
  base: "./",
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: Boolean(rawPort),
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
