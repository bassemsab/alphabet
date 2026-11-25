import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 2000,
    allowedHosts: ["local-dev.ether.paris", "dev.ether.paris", "localhost", "127.0.0.1"]
  },
  plugins: [
    tailwindcss(),
    sveltekit()
  ]
});
