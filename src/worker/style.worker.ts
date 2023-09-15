import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { cwd } from "node:process";
import { parentPort } from "node:worker_threads";
import stylelint from "stylelint";
import { SFCStyleBlock } from "@vue/compiler-sfc";
import STYLE_CONFIG from "../config/stylelint.config.js";
import { fileURLToPath } from "node:url";

const libPath = cwd();

parentPort!.on("message", async (styles: SFCStyleBlock[]) => {
  const promiseIterator: Array<Promise<any>> = [];

  console.log();

  styles.forEach((style, index) => {
    const filePath = join(libPath, `${index.toString()}.stylus`);

    const promise = writeFile(filePath, style.content)
      .then(() => {
        return stylelint.lint({
          files: filePath,
          config: STYLE_CONFIG,
          configBasedir: join(dirname(fileURLToPath(import.meta.url)), "../.."),
          fix: true
        });
      })
      .then(() => {
        return readFile(filePath, "utf-8");
      });

    promiseIterator.push(promise);
  });

  const result = await Promise.all(promiseIterator);

  // clean stylus
  for (let index = 0; index < styles.length; index++) {
    const filePath = join(libPath, `${index.toString()}.stylus`);
    rm(filePath);
  }

  // concat
  result.forEach((item, index) => {
    styles[index].content = item;
  });

  parentPort!.postMessage({ styles });

  parentPort!.unref();
});
