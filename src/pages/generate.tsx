/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Category, InputFile } from "@/types";
import styles from "./generate.module.css";

export default function About() {
  const [json, setJson] = useState<InputFile>();
  const [logo, setLogo] = useState("");
  const [supplementImage, setSupplementImage] = useState("");
  const [defaultMinimumPerCategory, setDefaultMinimumPerCategory] = useState(5);
  const [categories, setCategories] = useState<Category[]>([
    {
      name: "social",
    },
  ]);

  function removeCategory(name: string) {
    setCategories(categories.filter((c) => c.name !== name));
  }

  function updateCategory(name: string, newValue: string) {
    const updatedCategories = categories.map((c) => {
      if (c.name === name) {
        return { name: newValue };
      }
      return c;
    });
    setCategories(updatedCategories);
  }

  useEffect(() => {
    const jsonStructure: InputFile = {
      logo,
      defaultMinimumPerCategory,
      supplementImage,
      icons: [
        {
          name: "idea",
          image: "https://takras.github.io/event-bingo/images/veiviser.png",
        },
      ],
      categories,
      header: "Name",
      rules: [],
      entries: [],
    };
    setJson(jsonStructure);
  }, [logo, defaultMinimumPerCategory, supplementImage, categories]);

  return (
    <div>
      <h1>Let&apos;s Generate the JSON file!</h1>
      <div>
        Paste your input to the left and see the JSON content to the right. Copy
        the content and paste in your favorite text editor and save as a json
        file.
      </div>
      <div className={styles.generate}>
        <div className={styles.inputContainer}>
          <section>
            <label htmlFor="logoUrl">Logo url: </label>
            <input
              type="text"
              id="logoUrl"
              placeholder="https://example.com/image.jpeg"
              size={50}
              onChange={(e) => setLogo(e.target.value)}
            ></input>
            <div className={styles.logoContainer}>
              <img src={logo} className={styles.logo} alt=""></img>
            </div>
          </section>

          <section>
            <label htmlFor="logoUrl">
              Supplemental squared image url (ie QR code):{" "}
            </label>
            <input
              type="text"
              id="logoUrl"
              placeholder="https://example.com/qrcode.jpeg"
              size={50}
              onChange={(e) => setSupplementImage(e.target.value)}
            ></input>
            <div className={styles.supplementContainer}>
              <img
                src={supplementImage}
                className={styles.supplementImage}
                alt=""
              ></img>
            </div>
          </section>

          <section>
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

          <section>
            <label>Categories:</label>
            <button
              onClick={() =>
                setCategories((current) => [...current, { name: "" }])
              }
            >
              Add category
            </button>
            {categories.map((category) => {
              return (
                <div className={styles.category} key={category.name}>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      updateCategory(category.name, e.currentTarget.value)
                    }
                  ></input>
                  <button onClick={() => removeCategory(category.name)}>
                    -
                  </button>
                </div>
              );
            })}
          </section>

          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(json, null, 4)
            )}`}
            download={"data.json"}
          >
            Donwload JSON file
          </a>
        </div>

        <div className={styles.jsonContainer}>
          <textarea
            className={styles.textArea}
            readOnly
            value={JSON.stringify(json, null, 4)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
