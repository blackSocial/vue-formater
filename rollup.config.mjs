import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";

const MATRIX = [
  ["./src/index.ts", "./lib/vue-formater.js"],
  ["./src/worker/script.worker.ts", "./lib/worker/script.worker.js"],
  ["./src/worker/style.worker.ts", "./lib/worker/style.worker.js"]
];

export default MATRIX.map(([input, outputFile]) => {
  return {
    input,
    output: {
      file: outputFile,
      format: "es"
    },
    external: ["stylelint", "prettier", "@vue/compiler-sfc"],
    plugins: [
      commonjs(),
      resolve(),
      nodePolyfills(/* options */),
      typescript({ declaration: false }),
      terser()
    ]
  };
});
