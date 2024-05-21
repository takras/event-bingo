/* eslint-disable @next/next/no-img-element */
"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { EntryWithId, InputFile } from "@/types";
import { ToolsMenu } from "./tools-menu";
import { Cell } from "./cell";
import { BoardContext, getIcon } from "@/utils";
import { Guide } from "./guide";
import grimcon from "@/data/grimcon2024.json";
import classnames from "classnames";
import styles from "./page.module.css";

const basePath = "/event-bingo";

type Board = {
  entries: EntryWithId[];
  entriesOrder: number[];
  input: InputFile;
  tasksAreShown?: boolean;
};
const Board = ({ entries, input, entriesOrder, tasksAreShown }: Board) => {
  const boardContext = useContext(BoardContext);

  let cellCount = 0;
  const classNames = classnames(
    styles.board,
    tasksAreShown ? styles.blurred : null
  );

  return (
    <div className={classNames}>
      {input.supplementImage && (
        <div className={styles.supplementHeader}>
          <img
            width={140}
            height={140}
            alt="QR Code"
            className={styles.supplement}
            src={input.supplementImage}
          />
        </div>
      )}
      {input.logo && (
        <div className={styles.header}>
          {input.logo && (
            <img
              width={256}
              height={142}
              alt={"Logo"}
              className={styles.logo}
              src={input.logo}
            />
          )}
        </div>
      )}

      <div className={styles.name}>{input.header}</div>
      <div className={styles.gridContainer}>
        <div className={styles.github}>
          <div className={styles.url}>takras.github.io/event-bingo</div>
        </div>
        <div className={styles.grid}>
          {entries &&
            boardContext?.rows.map((r) => (
              <div className={styles.row} key={r}>
                {boardContext.columns.map((c) => {
                  return (
                    <div className={styles.column} key={`${c}${r}`}>
                      {c === boardContext.center &&
                      r === boardContext.center ? (
                        <div className={classnames(styles.cell)}>
                          <img
                            className={styles.image}
                            alt="X"
                            src={`${basePath}/images/x.png`}
                          ></img>
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
        </div>
      </div>
      <div className={styles.rules}>
        {input.rules.map((rule, i) => (
          <p key={"rule" + i} className={styles.rule}>
            {rule}
          </p>
        ))}
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
  const [showGuide, setShowGuide] = useState(false);

  const [boardSize, setBoardSize] = useState(input.isBigBoard);
  const [numberOfPages, setNumberOfPages] = useState(1);

  const COLUMNS_BIG = useMemo(() => [0, 1, 2, 3, 4], []);
  const ROWS_BIG = useMemo(() => [0, 1, 2, 3, 4], []);
  const CENTER_BIG = 2;
  const COLUMNS_SMALL = useMemo(() => [0, 1, 2, 3], []);
  const ROWS_SMALL = useMemo(() => [0, 1, 2], []);
  const CENTER_SMALL = -1;

  const [columns, setColumns] = useState(COLUMNS_BIG);
  const [rows, setRows] = useState(ROWS_BIG);
  const [center, setCenter] = useState(CENTER_BIG);

  const boardState = useMemo(() => {
    return {
      columns,
      rows,
      center,

      numberOfPages,
      setNumberOfPages,
      setInput,
      setShowGuide,
      setShowTasks,
      boardSwitchName: boardSize === input.isBigBoard,
      setToggleBoardSize: setBoardSize,
      isBigBoard: boardSize,
    };
  }, [columns, rows, center, numberOfPages, boardSize, input.isBigBoard]);

  useEffect(() => {
    if (boardSize !== input.isBigBoard) {
      setColumns(COLUMNS_SMALL);
      setRows(ROWS_SMALL);
      setCenter(CENTER_SMALL);
      return;
    }
    setColumns(COLUMNS_BIG);
    setRows(ROWS_BIG);
    setCenter(CENTER_BIG);
  }, [
    boardSize,
    COLUMNS_BIG,
    COLUMNS_SMALL,
    CENTER_SMALL,
    ROWS_BIG,
    ROWS_SMALL,
    input.isBigBoard,
  ]);

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

  const showBoard = !showTasks && !showGuide;

  return (
    <BoardContext.Provider value={boardState}>
      <main className={styles.main}>
        <ToolsMenu randomizeBoard={randomizeBoard} />
        <div className={styles.content}>
          {showBoard &&
            pagesOfBoards.map((_board, i) => (
              <Board
                key={i}
                entries={entries}
                entriesOrder={shuffleArray(filteredEntries)}
                input={input}
                tasksAreShown={showTasks}
              />
            ))}
          {showTasks && (
            <div className={styles.taskList}>
              <h2>Tasks</h2>
              {entries
                .toSorted((a, b) => (a.category > b.category ? -1 : 1))
                .map((entry) => (
                  <p key={"tastList" + entry.id}>
                    <strong>{entry.category}</strong> - {entry.description}
                    {entry.icon &&
                      getIcon({
                        name: entry.icon,
                        icons: input.icons,
                        className: styles.icon,
                      })}
                  </p>
                ))}
            </div>
          )}
          {showGuide && <Guide />}
        </div>
      </main>
    </BoardContext.Provider>
  );
}
