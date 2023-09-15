import { parentPort } from "node:worker_threads";
// import { setupJudge } from "../utils/setup-judge.js";
import { SFCScriptBlock } from "@vue/compiler-sfc";
import { scriptHandle, setupScriptHandle } from "../utils/script-handle.js";

interface ScriptCallbackParams {
  condition: boolean;
  script: SFCScriptBlock;
}

const callback = async ({ condition, script }: ScriptCallbackParams) => {
  const sourceVue = script.content.split("\n");

  const formattedVue = condition ? scriptHandle(sourceVue) : setupScriptHandle(sourceVue);

  script.content = formattedVue.join("\n");

  parentPort!.postMessage({ script });

  parentPort!.unref();
};

parentPort!.on("message", callback);
