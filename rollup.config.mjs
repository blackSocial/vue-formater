import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

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
    plugins: [typescript({ declaration: false }), terser()]
  };
});
