/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Category, InputFile, Entry, Icon } from "@/types";
import { v4 } from "uuid";
import spel from "@/data/SPEL 13-event-bingo-v3.json";
import Link from "next/link";
import iconStyles from "@/app/page.module.css";
import styles from "./generate.module.css";

type CategoryWithId = Category & { id: string };
type RuleWithId = { id: string; rule: string };
type EntryWithId = Entry & { id: string };
type IconWithId = Icon & { id: string };

export default function About() {
  const [json, setJson] = useState<InputFile>();
  const [name, setName] = useState<string | undefined>("");
  const [version, setVersion] = useState(1);
  const [isBigBoard, setIsBigBoard] = useState(true);
  const [logo, setLogo] = useState("");
  const [header, setHeader] = useState("");
  const [supplementImage, setSupplementImage] = useState("");
  const [icons, setIcons] = useState<IconWithId[]>([]);
  const [entries, setEntries] = useState<EntryWithId[]>([]);
  const [defaultMinimumPerCategory, setDefaultMinimumPerCategory] = useState(0);
  const [rules, setRules] = useState<RuleWithId[]>([]);
  const [categories, setCategories] = useState<CategoryWithId[]>([]);

  function removeEntry(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  function updateEntry(id: string, newValue: Entry) {
    const updatedEntries = entries.map((e) => {
      if (e.id === id) {
        return {
          ...newValue,
          id,
        };
      }
      return e;
    });
    setEntries(updatedEntries);
  }

  function removeRule(id: string) {
    setRules(rules.filter((c) => c.id !== id));
  }

  function updateRule(id: string, newValue: string) {
    const updatedRules = rules.map((r) => {
      if (r.id === id) {
        return { rule: newValue, id };
      }
      return r;
    });
    setRules(updatedRules);
  }

  function removeCategory(id: string) {
    const oldCategoryName = categories.filter((c) => c.id === id)[0].name;
    setCategories(categories.filter((c) => c.id !== id));

    setEntries(
      entries.map((e) => {
        if (e.category === oldCategoryName) {
          return { ...e, category: "" };
        }
        return e;
      })
    );
  }

  function updateIcon(newValues: IconWithId) {
    const oldValue = icons.filter((i) => i.id === newValues.id)[0].name;
    const updatedIcons = icons.map((i) => {
      if (i.id === newValues.id) {
        return {
          ...newValues,
        };
      }
      return i;
    });
    setIcons(updatedIcons);
    setEntries(
      entries.map((e) => {
        if (e.icon === oldValue) {
          return { ...e, icon: newValues.name };
        }
        return e;
      })
    );
  }

  function removeIcon(id: string) {
    const oldIconName = icons.filter((i) => i.id === id)[0].name;
    setIcons(icons.filter((i) => i.id !== id));
    setEntries(
      entries.map((e) => {
        if (e.icon === oldIconName) {
          const { icon, ...entry } = e;
          return entry;
        }
        return e;
      })
    );
  }

  function updateCategory(id: string, newValue: string) {
    const name = newValue.toLowerCase().trim();
    const oldValue = categories.filter((c) => c.id === id)[0].name;
    const updatedCategories = categories.map((c) => {
      if (c.id === id) {
        return { name, id };
      }
      return c;
    });
    setCategories(updatedCategories);
    setEntries(
      entries.map((e) => {
        if (e.category === oldValue) {
          return { ...e, category: name };
        }
        return e;
      })
    );
  }

  function readFromJsonData(input: InputFile) {
    setLogo(input.logo);
    setSupplementImage(input.supplementImage);
    setCategories(input.categories.map((c) => ({ ...c, id: v4() })));
    setEntries(input.entries.map((e) => ({ ...e, id: v4() })));
    setHeader(input.header);
    setIcons(input.icons.map((i) => ({ ...i, id: v4() })));
    setRules(input.rules.map((r) => ({ rule: r, id: v4() })));
    setDefaultMinimumPerCategory(input.defaultMinimumPerCategory);
    setVersion(input.version ? input.version + 1 : 1);
    setName(input.name ?? "");
    setIsBigBoard(input.isBigBoard || true);
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const input = JSON.parse(reader.result as string) as InputFile;
      readFromJsonData(input);
    };
    reader.onerror = () => {
      console.log("file error", reader.error);
    };
  }

  useEffect(() => {
    console.log("render");
    const jsonStructure: InputFile = {
      version: version ?? 1,
      logo,
      name: name ?? "",
      isBigBoard,
      defaultMinimumPerCategory,
      supplementImage,
      icons: icons.map((i) => {
        return {
          image: i.image,
          name: i.name,
        };
      }),
      categories: categories
        .filter((c) => c.name !== "")
        .map((c) => {
          return { name: c.name };
        }),
      header,
      rules: rules.filter((r) => r.rule !== "").map((r) => r.rule),
      entries: entries
        .filter((e) => e.description !== "")
        .map((e) => {
          return {
            category: e.category,
            description: e.description,
            icon: e.icon,
          };
        }),
    };
    setJson(jsonStructure);
  }, [
    isBigBoard,
    version,
    name,
    logo,
    defaultMinimumPerCategory,
    supplementImage,
    categories,
    header,
    rules,
    entries,
    icons,
  ]);

  return (
    <div>
      <h1>Let&apos;s make a JSON file!</h1>
      <Link href="/">Back to Event Bingo</Link>
      <div>
        Paste your input to the left and see the JSON content to the right. Copy
        the content and paste in your favorite text editor and save as a json
        file.
      </div>
      <div className={styles.generate}>
        <div className={styles.inputContainer}>
          <section className={styles.fileInput}>
            <p>
              You can load a previously generated JSON file here, to continue
              from that point.
            </p>
            <p>
              <strong>Warning!</strong> Current sheet will be replaced.
            </p>
            <input type="file" onChange={handleFileChange}></input>
            <button onClick={() => readFromJsonData(spel)}>
              Load GrimCon2014 sample
            </button>
          </section>

          <section className={styles.secion}>
            <label htmlFor="boardName">Name of the event: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              id="boardName"
            ></input>
          </section>

          <section className={styles.secion}>
            <label htmlFor="boardSize">Size of the board: </label>
            <select
              id="boardSize"
              onChange={(e) => setIsBigBoard(e.currentTarget.value === "BIG")}
            >
              <option value="BIG">Big board</option>
              <option value="SMALL">Small board</option>
            </select>
          </section>

          <section className={styles.section}>
            <label htmlFor="logoUrl">Logo url: </label>
            <input
              type="text"
              id="logoUrl"
              placeholder="https://example.com/logo.jpeg"
              size={50}
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            ></input>
            <div className={styles.logoContainer}>
              <img src={logo} className={styles.logo} alt=""></img>
              {!logo && <span>Preview area</span>}
            </div>
          </section>

          <section className={styles.section}>
            <label htmlFor="supplementUrl">
              Supplemental squared image url (ie QR code):{" "}
            </label>
            <input
              type="text"
              id="supplementUrl"
              placeholder="https://example.com/qrcode.jpeg"
              size={50}
              value={supplementImage}
              onChange={(e) => setSupplementImage(e.target.value)}
            ></input>
            <div className={styles.supplementContainer}>
              <img
                src={supplementImage}
                className={styles.supplementImage}
                alt=""
              ></img>
              {!supplementImage && <span>Preview area</span>}
            </div>
          </section>

          <section className={styles.section}>
            <label htmlFor="minimumPick">Minimum picks per category: </label>
            <input
              id="minimumPick"
              value={defaultMinimumPerCategory}
              type="number"
              onChange={(e) =>
                setDefaultMinimumPerCategory(parseInt(e.target.value))
              }
            ></input>
          </section>

          <section className={styles.section}>
            <label htmlFor="inputHeader">Header value</label>
            <input
              id="inputHeader"
              type="text"
              value={header}
              onChange={(e) => setHeader(e.currentTarget.value)}
            ></input>
          </section>

          <section className={styles.section}>
            <label htmlFor="buttonAddCategory">Categories:</label>
            <p>
              There is no check for duplicates. Categories will not show to the
              right until it has content.
            </p>
            <p>This will not appear on the sheet.</p>
            <button
              id="buttonAddCategory"
              onClick={() =>
                setCategories((current) => [...current, { name: "", id: v4() }])
              }
            >
              Add category
            </button>
            {categories.map((category) => {
              return (
                <div className={styles.category} key={category.id}>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      updateCategory(category.id, e.currentTarget.value)
                    }
                  ></input>
                  <button onClick={() => removeCategory(category.id)}>-</button>
                </div>
              );
            })}
          </section>

          <section className={styles.section}>
            <label htmlFor="buttonAddRule">Rules:</label>
            <p>
              Rules and regulations for the event. Keep it short. Keep it
              simple.
            </p>
            <p>Empty rules will not show in the json until it has a value.</p>
            <button
              id="buttonAddRule"
              onClick={() =>
                setRules((current) => [...current, { rule: "", id: v4() }])
              }
            >
              Add rule
            </button>
            {rules.map((rule) => {
              return (
                <div className={styles.rule} key={rule.id}>
                  <input
                    type="text"
                    value={rule.rule}
                    size={50}
                    onChange={(e) => updateRule(rule.id, e.currentTarget.value)}
                  ></input>
                  <button onClick={() => removeRule(rule.id)}>-</button>
                </div>
              );
            })}
          </section>

          <section className={styles.section}>
            <label htmlFor="buttonAddIcon">Icons:</label>
            <p>Invalid URLs will not show in the json file.</p>
            <button
              id="buttonAddIcon"
              onClick={() =>
                setIcons((current) => [
                  ...current,
                  { image: "", name: "", id: v4() },
                ])
              }
            >
              Add Icon
            </button>
            {icons.map((icon) => {
              return (
                <div className={styles.iconSection} key={icon.id}>
                  <input
                    type="text"
                    value={icon.name}
                    size={10}
                    onChange={(e) =>
                      updateIcon({ ...icon, name: e.currentTarget.value })
                    }
                  ></input>
                  <input
                    type="text"
                    value={icon.image}
                    size={50}
                    onChange={(e) => {
                      updateIcon({ ...icon, image: e.currentTarget.value });
                    }}
                  ></input>
                  <img
                    src={icon.image}
                    className={iconStyles.icon}
                    alt={icon.name}
                  ></img>
                  <button
                    onClick={() => {
                      removeIcon(icon.id);
                    }}
                  >
                    -
                  </button>
                </div>
              );
            })}
          </section>

          <section className={styles.section}>
            <label htmlFor="buttonAddEntry">Entries:</label>
            <p>Empty entries will not show in the json until it has a value.</p>
            <button
              id="buttonAddEntry"
              onClick={() =>
                setEntries((current) => [
                  ...current,
                  {
                    category: categories[0].name || "",
                    description: "",
                    id: v4(),
                  },
                ])
              }
            >
              Add entry
            </button>
            {entries.map((entry) => {
              return (
                <div className={styles.entry} key={entry.id}>
                  <input
                    type="text"
                    value={entry.description}
                    size={50}
                    onChange={(e) => {
                      updateEntry(entry.id, {
                        ...entry,
                        description: e.currentTarget.value,
                      });
                    }}
                  ></input>
                  <select
                    name="category"
                    defaultValue={entry.category}
                    onChange={(e) =>
                      updateEntry(entry.id, {
                        ...entry,
                        category: e.currentTarget.value,
                      })
                    }
                  >
                    <option value="">-</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="icon"
                    defaultValue={entry.icon}
                    onChange={(e) =>
                      updateEntry(entry.id, {
                        ...entry,
                        icon: e.currentTarget.value,
                      })
                    }
                  >
                    <option value="">-</option>
                    {icons.map((icon) => (
                      <option key={icon.id} value={icon.name}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => removeEntry(entry.id)}>-</button>
                </div>
              );
            })}
          </section>
        </div>

        <div className={styles.jsonContainer}>
          <textarea
            className={styles.textArea}
            readOnly
            value={JSON.stringify(json, null, 4)}
          ></textarea>
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(json, null, 4)
            )}`}
            onClick={() => setVersion((current) => current + 1)}
            download={`${name}-event-bingo-v${version - 1}.json`}
          >
            Donwload JSON file
          </a>
        </div>
      </div>
    </div>
  );
}
