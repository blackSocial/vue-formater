import { CustomVueDescriptor } from "../interface/custom-vue-descriptor.interface.js";

export function generateVirtualDom({ script, template, styles }: CustomVueDescriptor) {
  let virtualDom = "";

  if (template) {
    virtualDom += `<template>${template.content}</template>\n`;
  }

  if (script) {
    virtualDom += `\n<script lang="ts" setup>\n${script.content}\n</script>\n`;
  }

  if (styles) {
    styles.forEach((style) => {
      const content = `\n<style lang="less" ${style.scoped ? "scoped" : ""}>${
        style.content
      }</style>`;
      virtualDom += content;
    });
  }

  return virtualDom;
}
