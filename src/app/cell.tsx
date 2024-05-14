import { EntryWithId, Icon } from "@/types";
import { getIcon } from "@/utils";
import styles from "./page.module.css";

type Cell = {
  index: number;
  boardState: number[];
  entries: EntryWithId[];
  icons: Icon[];
};
export const Cell = ({ index, boardState, entries, icons }: Cell) => {
  const id = boardState[index];
  const entry = entries?.find((e, i) => i === id);
  if (!entry) {
    return null;
  }
  return (
    <div className={styles.cell}>
      {entry.description}
      {entry.icon &&
        getIcon({ name: entry.icon, icons, className: styles.icon })}
    </div>
  );
};
