import adapter from "svelte-adapter-bun";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      out: "build",
      precompress: true
    }),
    csrf: {
      trustedOrigins: [
        "https://alphabet.ether.paris",
        "https://local-dev.ether.paris:3000",
        "https://dev.ether.paris:3000",
        "http://localhost:3000",
        "http://localhost:2000"
      ]
    }
  }
};

export default config;
