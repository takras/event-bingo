import { useContext } from "react";
import { EntryWithId, Icon } from "@/types";
import { BoardContext, getIcon } from "@/utils";
import styles from "./cell.module.css";
import pageStyles from "./page.module.css";
import classNames from "classnames";

type Cell = {
  index: number;
  boardState: number[];
  entries: EntryWithId[];
  icons: Icon[];
};
export const Cell = ({ index, boardState, entries, icons }: Cell) => {
  const id = boardState[index];
  const entry = entries?.find((e, i) => i === id);
  const boardContext = useContext(BoardContext);

  const variant = [
    styles.comic,
    styles.bold,
    styles.regular,
    styles.big,
    styles.small,
  ];

  if (!entry) {
    return null;
  }

  const styleVariant = variant[Math.floor(Math.random() * variant.length)];
  return (
    <div
      className={classNames(
        pageStyles.cell,
        boardContext?.isBigBoard ? null : styleVariant
      )}
    >
      {entry.description}
      {entry.icon &&
        getIcon({ name: entry.icon, icons, className: pageStyles.icon })}
    </div>
  );
};
