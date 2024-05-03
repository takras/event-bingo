/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./page.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Entry, InputFile } from "@/types";
import grimcon from "@/data/grimcon2024.json";
import classnames from "classnames";

const basePath = "/event-bingo";

type EntryWithId = Entry & { id: number };

type AdminTools = {
  randomizeBoard: () => void;
  numberOfPages: number;
  setNumberOfPages: Dispatch<SetStateAction<number>>;
  setShowTasks: Dispatch<SetStateAction<boolean>>;
  setInput: Dispatch<SetStateAction<InputFile>>;
};
const AdminTools = ({
  randomizeBoard,
  setShowTasks,
  setInput,
  numberOfPages,
  setNumberOfPages,
}: AdminTools) => {
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

  return (
    <div className="adminTools">
      <button type="button" onClick={randomizeBoard}>
        Randomize
      </button>
      <button type="button" onClick={() => setShowTasks(true)}>
        Show total available tasks
      </button>
      <input type="file" onChange={handleFileChange}></input>
      <a
        href="/event-bingo/example.json"
        download={true}
        type="application/json"
      >
        Download sample file
      </a>
      <div className="pagesCounter">
        <button
          type="button"
          onClick={() => setNumberOfPages((current) => current + 1)}
        >
          +
        </button>
        <span>{numberOfPages}</span>
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

const Cell = ({
  index,
  boardState,
  entries,
  icons,
}: {
  index: number;
  boardState: number[];
  entries: EntryWithId[];
  icons: Icon[];
}) => {
  const id = boardState[index];
  const entry = entries?.find((e, i) => i === id);
  if (!entry) {
    return null;
  }
  return (
    <div className="cell">
      {entry.description}
      {entry.icon && getIcon({ name: entry.icon, icons })}
    </div>
  );
};

type Icon = { name: string; image: string };
type GetIcon = {
  name: string;
  icons: Icon[];
};
function getIcon({ name, icons }: GetIcon) {
  const icon = icons.find((icon) => icon.name === name);
  if (!icon) {
    return null;
  }
  return <img alt={icon.name} className={"icon"} src={icon.image} />;
}

type Board = {
  entries: EntryWithId[];
  entriesOrder: number[];
  input: InputFile;
  tasksAreShown?: boolean;
};
const Board = ({ entries, input, entriesOrder, tasksAreShown }: Board) => {
  const columns = [0, 1, 2, 3, 4];
  const rows = [0, 1, 2, 3, 4];
  let cellCount = 0;
  const CENTER = 2;
  const classNames = classnames("board", tasksAreShown ? "blurred" : "");

  return (
    <div className="content">
      <div className={classNames}>
        {(input.logo || input.supplementImage) && (
          <div className="header">
            {input.logo && (
              <img
                width={256}
                height={142}
                alt={"Logo"}
                className="logo"
                src={input.logo}
              />
            )}
            {input.supplementImage && (
              <img
                width={140}
                height={140}
                alt="QR Code"
                className="supplement"
                src={input.supplementImage}
              />
            )}
          </div>
        )}
        <div className="name">{input.header}</div>
        {entries &&
          rows.map((r) => (
            <div className="row" key={r}>
              {columns.map((c) => {
                return (
                  <div className="column" key={`${c}${r}`}>
                    {c === CENTER && r === CENTER ? (
                      <div className="cell empty">
                        <img alt="X" src={`${basePath}/images/x.png`}></img>
                      </div>
                    ) : (
                      <Cell
                        index={cellCount++}
                        boardState={entriesOrder}
                        entries={entries}
                        icons={input.icons}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        <div className="rules">
          {input.rules.map((rule, i) => (
            <p key={"rule" + i}>{rule}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

type GetRandomEntries = {
  entriesToPickFrom: EntryWithId[];
  minimumPicks: number;
};
const getRandomEntriesFromList = ({
  entriesToPickFrom,
  minimumPicks,
}: GetRandomEntries) => {
  const MINIUM_SELECTION = Math.min(minimumPicks, entriesToPickFrom.length);

  const MIN = 0;
  const MAX = entriesToPickFrom.length;
  let count = 0;
  let entryId = -1;
  const filteredPicks: number[] = [];
  while (filteredPicks.length < MINIUM_SELECTION && count < 5000) {
    const id = Math.floor(Math.random() * (MAX - MIN)) + MIN;
    entryId = entriesToPickFrom[id].id;
    count = count + 1;

    if (!entryId) {
      continue;
    }

    if (!filteredPicks.includes(entryId)) {
      filteredPicks.push(entryId);
      continue;
    }
    if (count > 5000) {
      console.log("AAAAH!");
      break;
    }
  }
  return filteredPicks;
};

export default function Home() {
  const [input, setInput] = useState<InputFile>(grimcon as InputFile);
  const [filteredEntries, setFilteredEntries] = useState<number[]>([]);
  const [entries, setEntries] = useState<EntryWithId[]>();
  const [showTasks, setShowTasks] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(1);

  useEffect(() => {
    setEntries(input.entries.map((entry, id) => ({ ...entry, id })));
  }, [input]);

  useEffect(() => {
    if (!entries) {
      return;
    }

    const pickedEntries: number[] = [];

    input.categories.forEach((category) => {
      const list = entries.filter((entry) => entry.category === category.name);
      const randomList = getRandomEntriesFromList({
        entriesToPickFrom: list,
        minimumPicks: input.defaultMinimumPerCategory,
      });
      pickedEntries.push(...randomList);
    });

    const remainingEntries = entries.filter(
      (entry) => !pickedEntries.includes(entry.id)
    );

    const remaining = getRandomEntriesFromList({
      entriesToPickFrom: remainingEntries,
      minimumPicks: 24 - pickedEntries.length,
    });

    setFilteredEntries([...pickedEntries, ...remaining]);
  }, [entries, input.categories, input.defaultMinimumPerCategory]);

  useEffect(() => {}, [entries]);

  function shuffleArray(list: number[]) {
    return list.toSorted(() => Math.random() - 0.5);
  }

  function randomizeBoard() {
    setEntries((entries) => [...(entries || [])]);
  }

  if (!entries) {
    return <div>Loading...</div>;
  }

  const pagesOfBoards = [];
  while (pagesOfBoards.length < Math.max(numberOfPages, 1)) {
    pagesOfBoards.push(filteredEntries.toSorted(() => Math.random() - 0.5));
  }

  return (
    <main className={styles.main}>
      <AdminTools
        setShowTasks={setShowTasks}
        randomizeBoard={randomizeBoard}
        setInput={setInput}
        numberOfPages={numberOfPages}
        setNumberOfPages={setNumberOfPages}
      />
      {pagesOfBoards.map((_board, i) => (
        <Board
          key={i}
          entries={entries}
          entriesOrder={shuffleArray(filteredEntries)}
          input={input}
          tasksAreShown={showTasks}
        />
      ))}
      {showTasks && (
        <div className="taskList">
          <button onClick={() => setShowTasks(false)}>Hide tasks</button>
          {entries
            .toSorted((a, b) => (a.category > b.category ? -1 : 1))
            .map((entry) => (
              <p key={"tastList" + entry.id}>
                <strong>{entry.category}</strong> - {entry.description}
                {entry.icon &&
                  getIcon({ name: entry.icon, icons: input.icons })}
              </p>
            ))}
        </div>
      )}
    </main>
  );
}
