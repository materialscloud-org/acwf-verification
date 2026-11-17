import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// matsci-parse (via mc-react-library) imports moyo-wasm for symmetry, and Vite
// emits moyo's .wasm when it loads the module, even though tree-shaking drops
// all of moyo's code. Drop .wasm files that no chunk refers to.
function dropUnreferencedWasm() {
  return {
    name: "drop-unreferenced-wasm",
    apply: "build",
    generateBundle(_, bundle) {
      const code = Object.values(bundle)
        .filter((file) => file.type === "chunk")
        .map((chunk) => chunk.code)
        .join("\n");
      for (const [name, file] of Object.entries(bundle)) {
        if (
          file.type === "asset" &&
          name.endsWith(".wasm") &&
          !code.includes(name.split("/").pop())
        ) {
          delete bundle[name];
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), dropUnreferencedWasm()],
  optimizeDeps: {
    include: ["mc-react-header"],
    // Required to run wasm modules in dev mode for vite.
    exclude: ["@spglib/moyo-wasm"],
  },
});
