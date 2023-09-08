import { dirname } from "node:path";
export function getCurrentDir() {
  return dirname(new URL(import.meta.url).pathname);
}
