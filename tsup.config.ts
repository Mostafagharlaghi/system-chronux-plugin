// system-chronux-plugin/tsup.config.ts

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __filename = fileURLToPath(
  import.meta.url,
);

const __dirname = path.dirname(
  __filename,
);

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    external: [
        "react",
        "react-dom",
        "@chakra-ui/react",
        "@emotion/react",
        "@emotion/styled",
        "framer-motion",
        "react-icons",
        "@dolphin/app-sdk",
        "@dolphin/app-core",
        "@dolphin/ui",
    ],

    onSuccess: async () => {
        const pkgPath = path.resolve(__dirname, "package.json");
        const distPkgPath = path.resolve(__dirname, "dist", "package.json");

        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

        const out = {
            name: pkg.name,
            version: pkg.version,
            main: "./index.js",
            module: "./index.mjs",
            types: "./index.d.ts",
            "exports": {
                ".": {
                    "import": "./index.mjs",
                    "require": "./index.js",
                    "types": "./index.d.ts"
                }
            },
            peerDependencies: pkg.peerDependencies || {}
        };

        fs.writeFileSync(distPkgPath, JSON.stringify(out, null, 2), "utf8");
        console.log("📦 system-chronux-plugin/dist/package.json generated");
    }
});
