import prettier from "prettier";
import PRETTIER_CONFIG from "../config/prettier.config.js";

export async function runPrettier(text: string) {
  return prettier.format(text, PRETTIER_CONFIG as Record<string, any>);
}
