import { Worker } from "node:worker_threads";

type OnMessgae = (mes: any) => void;

export function createWorker(url: string, onMessgae: OnMessgae) {
  const worker = new Worker(url);
  worker.on("message", onMessgae);
  worker.on("error", (error) => {
    console.log(error);
  });
  return worker;
}
