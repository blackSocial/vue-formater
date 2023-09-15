export const setupScriptHandle = (sourceVue: string[]) => {
  let sliceEndIndex = sourceVue.length;

  for (let index = sourceVue.length - 1; index > -1; index--) {
    const element = sourceVue[index];
    if (element.includes("return")) {
      sliceEndIndex = index;
      break;
    }
  }

  const cloneVue = sourceVue.slice(0, sliceEndIndex);

  const formattedVue: string[] = [];
  let uselessCodeTag: boolean = false;

  cloneVue.forEach((sourceItem: string) => {
    // 去除空
    if (!sourceItem) return;
    // 去除console
    if (sourceItem.includes("console")) return;

    // setup中的判断
    if (sourceItem.includes("export")) {
      uselessCodeTag = true;
      return;
    } else if (/^\s{2}setup/.test(sourceItem)) {
      uselessCodeTag = false;
      return;
    }

    // 通过 uselessCodeTag 判断
    if (uselessCodeTag) {
      return;
    }

    formattedVue.push(sourceItem);
  });

  return formattedVue;
};

export const scriptHandle = (sourceVue: string[]) => {
  const formattedVue: string[] = [];
  sourceVue.forEach((sourceItem: string) => {
    // 去除空
    if (!sourceItem) return;
    // 去除console
    if (sourceItem.includes("console")) return;
    formattedVue.push(sourceItem);
  });
  return formattedVue;
};
