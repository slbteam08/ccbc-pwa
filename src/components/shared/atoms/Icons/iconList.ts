const getPath = (name: string) => {
  return `/assets/icons/${name}.svg`;
};

export const iconList = {
  ppl: getPath("ppl"),
  newspaper: getPath("newspaper"),
  class: getPath("class"),
  speech: getPath("speech"),
  qrCode: getPath("qrCode"),
};

//export iconList name as const
export type IconName = keyof typeof iconList;
