import { atom } from "recoil";

export const numPagesState = atom({
  key: "numPages",
  default: 0,
});

export const pageNumberState = atom({
  key: "pageNumber",
  default: 1,
});

export const scaleState = atom({
  key: "scale",
  default: 1,
});

export const showThumbnailState = atom({
  key: "thumbnail",
  default: false,
});
export const fullScreenState = atom({
  key: "fullScreen",
  default: false,
});
