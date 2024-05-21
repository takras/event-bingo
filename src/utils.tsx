import { Dispatch, SetStateAction, createContext } from "react";
import { Icon, InputFile } from "./types";

type GetIcon = {
  name: string;
  icons: Icon[];
  className: string;
};
export function getIcon({ name, icons, className }: GetIcon) {
  const icon = icons.find((icon) => icon.name === name);
  if (!icon) {
    return null;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={icon.name} className={className} src={icon.image} />;
}

type BoardContext = {
  columns: number[];
  rows: number[];
  center: number;

  numberOfPages: number;
  setNumberOfPages: Dispatch<SetStateAction<number>>;
  setShowTasks: Dispatch<SetStateAction<boolean>>;
  setInput: Dispatch<SetStateAction<InputFile>>;
  setShowGuide: Dispatch<SetStateAction<boolean>>;
  setToggleBoardSize: Dispatch<SetStateAction<boolean>>;
  isBigBoard: boolean;
};

export const BoardContext = createContext<BoardContext | null>(null);
