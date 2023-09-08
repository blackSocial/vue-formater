import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { argv } from "node:process";
import { SFCDescriptor, parse } from "vue/compiler-sfc";
import { createWorker } from "./utils/create-worker.js";
import { getCurrentDir } from "./utils/get-current-dir.js";
import { runPrettier } from "./utils/run-prettier.js";
import { WORKER_PATH } from "./constant/path.constant.js";
import { CustomVueDescriptor } from "./interface/custom-vue-descriptor.interface.js";
import { generateVirtualDom } from "./utils/generate-virtual-dom.js";

const [, , SOURCE_PATH] = argv;

if (!SOURCE_PATH) {
  throw new Error("缺少路径参数");
}

const workerPath = join(getCurrentDir(), WORKER_PATH);

const dirPromise = readdir(workerPath);

const filePromise = readFile(SOURCE_PATH!, "utf8").then((content) => runPrettier(content));

const [files, sourceContent] = await Promise.all([dirPromise, filePromise]);

const { scriptSetup, script, styles, template } = parse(sourceContent).descriptor;

const promiseIterator = [];

for (const file of files) {
  if (file.includes("script") && !scriptSetup && !script) break;

  if (file.includes("style") && styles.length === 0) break;

  const promise = new Promise((reslove) => {
    const worker = createWorker(join(workerPath, "/", file), (mes) => {
      reslove(mes);
    });

    if (file.includes("script")) {
      worker.postMessage(scriptSetup ? scriptSetup : script);
    } else {
      worker.postMessage(styles);
    }
  });

  promiseIterator.push(promise);
}

const result = await Promise.all(promiseIterator);

const vueDescriptor = Object.assign({ template }, ...result) as CustomVueDescriptor;

const prettierDom = await runPrettier(generateVirtualDom(vueDescriptor));

writeFile(SOURCE_PATH, prettierDom);
