import { SFCDescriptor } from "@vue/compiler-sfc";

export type CustomVueDescriptor = Pick<SFCDescriptor, "script" | "styles" | "template">;
