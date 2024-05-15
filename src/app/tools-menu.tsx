import { InputFile } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import styles from "./tools-menu.module.css";
import classNames from "classnames";

type AdminTools = {
  randomizeBoard: () => void;
  numberOfPages: number;
  setNumberOfPages: Dispatch<SetStateAction<number>>;
  setShowTasks: Dispatch<SetStateAction<boolean>>;
  setInput: Dispatch<SetStateAction<InputFile>>;
  setShowGuide: Dispatch<SetStateAction<boolean>>;
};

export const ToolsMenu = ({
  randomizeBoard,
  setShowTasks,
  setInput,
  numberOfPages,
  setNumberOfPages,
  setShowGuide,
}: AdminTools) => {
  const [showPanel, setShowPanel] = useState(false);

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      setInput(json);
    };
    reader.onerror = () => {
      console.log("file error", reader.error);
    };
  }

  if (!showPanel) {
    return (
      <div className={styles.adminTools}>
        <button type="button" onClick={() => setShowPanel(true)}>
          Tools & Help
        </button>
      </div>
    );
  }

  return (
    <div className={classNames(styles.adminTools, styles.open)}>
      <button type="button" onClick={() => setShowPanel(false)}>
        Close tools
      </button>
      <button type="button" onClick={randomizeBoard}>
        Randomize
      </button>
      <button type="button" onClick={() => setShowTasks((current) => !current)}>
        Show/hide tasks
      </button>
      <button type="button" onClick={() => setShowGuide((current) => !current)}>
        Show/hide guide
      </button>
      <Link href="/generate">Make a JSON file</Link>
      <input type="file" onChange={handleFileChange}></input>
      <a
        href="/event-bingo/example.json"
        download={true}
        type="application/json"
      >
        Download sample file
      </a>
      <div className={styles.pagesCounter}>
        <button
          type="button"
          onClick={() => setNumberOfPages((current) => current + 1)}
        >
          +
        </button>
        <span className={styles.span}>{numberOfPages}</span>
        <button
          type="button"
          onClick={() => setNumberOfPages((current) => current - 1)}
        >
          -
        </button>
      </div>
    </div>
  );
};
