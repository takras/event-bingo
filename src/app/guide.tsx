import styles from "./guide.module.css";

export const Guide = () => {
  return (
    <div className={styles.guideContainer}>
      <h2>Guide for Event Bingo</h2>
      <p>
        Event Bingo was made for a board game event in Stavanger called
        Spill-o-Rama by Marthe. Great success!
      </p>
      <p>
        No bingo tools available online suited the requirements. Each task had
        to support free text, but also a category for each. The bingo board
        would be filled with even distribution from these categories, and the
        rest random, to assure a board wouldn&apos;t be filled with just
        &quot;play games&quot;, for instance.
      </p>

      <h3>How to use</h3>
      <p>
        Each time something changes on this page, a random board is shown in the
        browser. You can also open up the tool menu and click randomize to force
        a new board.
      </p>
      <p>
        When printing, you could add more boards by usibg the <strong>+</strong>{" "}
        and <strong>-</strong> buttons in the tool menu. Each time these buttons
        are pressed, the boards will again be re-generated.
      </p>

      <h3>Your custom content</h3>
      <p>
        To use your own content, you need to upload a configuration file. This
        file needs to be in a certain format, and without errors, in order to
        work. You can use tools like{" "}
        <a href="https://jsonlint.com/" target="_blank">
          jsonlint.com
        </a>{" "}
        to verify the file and find mistakes.
      </p>
      <p>
        The file has to be a json-file. You can download a sample from the tool
        menu. The sample file is what you see when you visit this page by
        default.
      </p>

      <h4>Json-file description</h4>
      <p>
        If you are used to json-files, most of it is self-explanatory. If you
        are unfamiliar, you can see here for commentaries on the format.
      </p>

      <pre className={styles.json}>
        {`
  {
    // Logo has a max height of 150px and max width of 300px
    // and needs to be publically available.
    "logo": "https://takras.github.io/event-bingo/images/grimcon2024.jpeg",

    // This is the QR code image in the default. Max height of 140px.
    "supplementImage": "https://takras.github.io/event-bingo/images/qr.png",

    // What comes before the long line, typical "Name" would be suggested.
    "header": "Navn",

    // Here is a list of icons to use at the end of a task.
    // All images has to be publically available.
    // The names *must* be unique. Images will be resized to a squared 20px.
    "icons": [
      {
        "name": "idea",
        "image": "https://takras.github.io/event-bingo/images/ideskaper.png"
      },
      {
        "name": "fire",
        "image": "https://takras.github.io/event-bingo/images/ildsjel.png"
      },
      {
        "name": "merchant",
        "image": "https://takras.github.io/event-bingo/images/kremmer.png"
      },
      {
        "name": "guide",
        "image": "https://takras.github.io/event-bingo/images/veiviser.png"
      }
    ],

    // How many to pull from a given category before moving on to the next category.
    "defaultMinimumPerCategory": 5,

    // A list of the categories you are going to use in this board. The entries (further down)
    // has to match these exactly.
    "categories": [
      { "name": "game" },
      { "name": "task" },
      { "name": "social" },
      { "name": "merch" }
    ],

    // One paragraph per entry in this array. This might be a trial and error, and will
    // affect the print area.
    "rules": [
      "Velkommen til GrimCon-bingo! Her skal du prøve å oppnå Bingo.",
      "For å få et lodd i trekningen av premie av gratis helgepass neste år..."
    ],

    // Here's the core list. All the tasks follow in this array and can be as long
    // as you wish. Required fields: "description" and "category".
    // Optional field: "icon".

    "entries": [
      {
        "description": "Vinn i et spill med minst 4 spillere.",
        "category": "game"
      },
      {
        "description": "Gi klem til en ",
        "category": "social",

        // If using icon, it has to match one of the icons defined earlier in your file.
        // The icon will be added *after* the text. This limitation might be changed later.
        "icon": "fire"
      },
  `}
      </pre>
    </div>
  );
};
