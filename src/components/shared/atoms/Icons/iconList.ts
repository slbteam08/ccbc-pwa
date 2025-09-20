const getPath = (name: string, ext = "svg") => {
  return `/assets/icons/${name}.${ext}`;
};

export const iconList = {
  ppl: getPath("ppl"),
  newspaper: getPath("newspaper"),
  class: getPath("class"),
  speech: getPath("speech"),
  qrCode: getPath("QR-CODE", "png"),
};

//export iconList name as const
export type IconName = keyof typeof iconList;
