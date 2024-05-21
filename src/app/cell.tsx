import { EntryWithId, Icon } from "@/types";
import { getIcon } from "@/utils";
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
  return (
    <div
      className={classNames(
        pageStyles.cell,
        variant[Math.floor(Math.random() * variant.length)]
      )}
    >
      {entry.description}
      {entry.icon &&
        getIcon({ name: entry.icon, icons, className: pageStyles.icon })}
    </div>
  );
};
