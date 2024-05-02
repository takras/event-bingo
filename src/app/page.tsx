"use client";
import styles from "./page.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Entry, InputFile } from "@/types";
import Image from "next/image";
import grimcon from "@/data/grimcon2024.json";

type EntryWithId = Entry & { id: number };

type AdminTools = {
  randomizeBoard: () => void;
  setShowTasks: Dispatch<SetStateAction<boolean>>;
};
const AdminTools = ({ randomizeBoard, setShowTasks }: AdminTools) => {
  return (
    <div className="adminTools">
      <button type="button" onClick={randomizeBoard}>
        Randomize
      </button>
      <button type="button" onClick={() => setShowTasks(true)}>
        Show total available tasks
      </button>
    </div>
  );
};

const Cell = ({
  index,
  boardState,
  entries,
}: {
  index: number;
  boardState: number[];
  entries: EntryWithId[];
}) => {
  const id = boardState[index];
  const entry = entries?.find((e, i) => i === id);
  if (!entry) {
    return null;
  }
  return (
    <div className="cell">
      {entry.description}
      {entry.icon && getIcon(entry.icon)}
    </div>
  );
};

function getIcon(name: string) {
  const icons = [
    {
      name: "idea",
      image: "ideskaper.png",
    },
    {
      name: "fire",
      image: "ildsjel.png",
    },
    {
      name: "merchant",
      image: "kremmer.png",
    },
    {
      name: "guide",
      image: "veiviser.png",
    },
  ];

  const icon = icons.find((icon) => icon.name === name);
  if (!icon) {
    return null;
  }
  return (
    <Image alt={icon.name} className={"icon"} src={`/images/${icon.image}`} />
  );
}

export default function Home() {
  const inputFile = grimcon as InputFile;
  const [entries, setEntries] = useState<EntryWithId[]>();
  const [showTasks, setShowTasks] = useState(false);

  const filledBoard: number[] = [];
  const pickedEntries: number[] = [];

  useEffect(() => {
    setEntries(inputFile.entries.map((entry, id) => ({ ...entry, id })));
  }, [inputFile]);

  function fillBoardState() {
    if (!entries) {
      return;
    }
    inputFile.categories.forEach((category) => {
      const filteredEntries = entries.filter(
        (entry) => entry.category === category.name
      );
      getRandomEntriesFromList(filteredEntries);
    });

    const remainingEntries = entries.filter(
      (entry) => !pickedEntries.includes(entry.id)
    );
    getRandomEntriesFromList(remainingEntries, true);
    filledBoard.push(...shuffleArray(pickedEntries));
  }

  fillBoardState();

  function getRandomEntriesFromList(entries: EntryWithId[], fill = false) {
    const MAXIMUM_PICKS = 24;
    const MINIUM_SELECTION = fill ? MAXIMUM_PICKS - pickedEntries.length : 5;

    const MIN = 0;
    const MAX = entries.length;
    let count = 0;
    let entryId = -1;
    const filteredPicks: number[] = [];
    while (filteredPicks.length < MINIUM_SELECTION && count < 5000) {
      const id = Math.floor(Math.random() * (MAX - MIN)) + MIN;
      entryId = entries[id].id;
      count = count + 1;

      if (!entryId) {
        continue;
      }

      if (!filteredPicks.includes(entryId)) {
        filteredPicks.push(entryId);
        pickedEntries.push(entryId);
        continue;
      }
      if (count > 5000) {
        console.log("AAAAH!");
        break;
      }
    }
  }

  function shuffleArray(list: number[]) {
    return list.sort(() => Math.random() - 0.5);
  }

  function randomizeBoard() {
    console.log(entries);
  }

  function Board() {
    const columns = [0, 1, 2, 3, 4];
    const rows = [0, 1, 2, 3, 4];
    let cellCount = 0;
    const CENTER = 2;

    return (
      <>
        <AdminTools
          setShowTasks={setShowTasks}
          randomizeBoard={randomizeBoard}
        />
        <div className="content">
          <div className="board">
            {(inputFile.logo || inputFile.supplementImage) && (
              <div className="header">
                {inputFile.logo && (
                  <Image
                    width={256}
                    height={142}
                    alt={"Logo"}
                    className="logo"
                    src={`/images/${inputFile.logo}`}
                  />
                )}
                {inputFile.supplementImage && (
                  <Image
                    width={140}
                    height={140}
                    alt="QR Code"
                    className="supplement"
                    src={`/images/${inputFile.supplementImage}`}
                  />
                )}
              </div>
            )}
            <div className="name">Navn:</div>
            {entries &&
              rows.map((r) => (
                <div className="row" key={r}>
                  {columns.map((c) => {
                    return (
                      <div className="column" key={`${c}${r}`}>
                        {c === CENTER && r === CENTER ? (
                          <div className="cell empty"></div>
                        ) : (
                          <Cell
                            index={cellCount++}
                            boardState={filledBoard}
                            entries={entries}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            <div className="rules">
              {inputFile.rules.map((rule, i) => (
                <p key={"rule" + i}>{rule}</p>
              ))}
            </div>
          </div>
        </div>

        {showTasks && (
          <div>
            {entries?.map((entry) => (
              <p key={"tastList" + entry.id}>{entry.description}</p>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <main className={styles.main}>
      <Board />
    </main>
  );
}
