import clean from "rollup-plugin-clean";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

let cfg;
const dest = process.env.DEST;
const apiKey = process.env.SCREEPS_API_KEY;

if ((cfg = require("./screeps")) == null) {
  cfg = {
      "protocol": "https",
      "hostname": "screeps.com",
      "port": 443,
      "path": "/",
      "branch": "auto"
  };

  console.info("No API config specified, using default.");
}

if (dest) {
    cfg.branch = dest;
    console.info("Uploading to branch '" + dest + "'.");
}

if (!apiKey) {
  throw new Error("Invalid API key specified.");
}
else if (apiKey.length !== 36) {
  console.log("API Key Length was " + apiKey.length);
  throw new Error("Invalid API key specified.");
} else {
    cfg.token = apiKey;
}


export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    clean(),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    screeps({config: cfg, dryRun: cfg == null})
  ]
}
