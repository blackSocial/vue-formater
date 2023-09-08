import { writeFile } from "node:fs/promises";
import { parentPort } from "node:worker_threads";

parentPort!.on("message", async (script) => {
  const sourceVue = script.content.split("\n");

  /**
   * 去除空;去除console;筛选出setup中的代码
   */
  const formattedVue: string[] = [];
  let uselessCodeTag = "none"; // going进行中,next-stop下一个结束,none无

  sourceVue.forEach((sourceItem: string) => {
    // 去除空
    if (!sourceItem) return;

    // 去除console
    if (sourceItem.includes("console")) return;

    // 筛选出setup中的代码
    if (sourceItem.includes("export default defineComponent")) {
      uselessCodeTag = "going";
      return;
    } else if (/^\s{4}return/.test(sourceItem)) {
      uselessCodeTag = "going";
      return;
    } else if (/^\s{2}setup/.test(sourceItem)) {
      uselessCodeTag = "next-stop";
      return;
    }

    // 通过 uselessCodeTag 判断
    if (uselessCodeTag === "going") {
      return;
    } else if (uselessCodeTag === "next-stop") {
      uselessCodeTag = "none";
    }

    formattedVue.push(sourceItem);
  });

  script.content = formattedVue.join("\n");

  parentPort!.postMessage({ script });

  parentPort!.unref();
});
