import { mkdir, readFile, rmdir, writeFile } from "node:fs/promises";
import { parentPort } from "node:worker_threads";
import stylelint from "stylelint";
import { SFCStyleBlock } from "vue/compiler-sfc";
import STYLE_CONFIG from "../config/stylelint.config.js";
import { join } from "node:path";
import { getCurrentDir } from "../utils/get-current-dir.js";
import { STYLUS_PATH } from "../constant/path.constant.js";

const libPath = join(getCurrentDir(), "../");
const stylusPath = join(libPath, STYLUS_PATH);

parentPort!.on("message", async (styles: SFCStyleBlock[]) => {
  const promiseIterator: Array<Promise<any>> = [];

  try {
    await mkdir(stylusPath);
  } catch (error) {}

  styles.forEach((style, index) => {
    const filePath = join(stylusPath, `${index.toString()}.stylus`);

    const promise = writeFile(filePath, style.content)
      .then(() => {
        return stylelint.lint({
          files: filePath,
          config: STYLE_CONFIG,
          fix: true
        });
      })
      .then(() => {
        return readFile(filePath, "utf-8");
      });

    promiseIterator.push(promise);
  });

  const result = await Promise.all(promiseIterator);

  result.forEach((item, index) => {
    styles[index].content = item;
  });

  parentPort!.postMessage({ styles });

  parentPort!.unref();
});
