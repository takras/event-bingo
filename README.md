# event-bingo
Bingo for events

Made this for a board game event called GrimCon in Grimstad, Norway. Then expanded it to be more flexible with more input.
Default configuration is loaded, but you can use your own json-file.

[Try it out](https://takras.github.io/event-bingo/).

## Requirements

You must have *AT LEAST* 24 entries.

### Entries
```json
  [{
    "description": "Ta en selfie med en ",
    "category": "task",
    "icon": "idea",
  }]
```
The categories for entries has to be present, and needs to match the categories in the `categories` list.

`icon` is not required, but if present, a matching `name`  in the `icons` list must be present and contain a direct link to the image.

### Icons
Images used in GrimCon are `idea`, `fire`, `merchant` and `guide` and are hosted here.

### Logo
URL to the logo.

### Supplement Image
I use this to display a 140x140 pixel QR code on the top right. If you want a squared image there, this is the one to use. If not, delete it.

### Header
What it will display prior to the long horizontal line on top, i.e. "Name".

### Rules
One paragrapgh per array entry. Don't make the list too long, or it will not fit an A4 paper size, which this app is scaled for.

***input.json***:
```json
{
  "logo": "grimcon2024.jpeg",
  "supplementImage": "qr.png",
  "header": "Navn",
  "icons": [
    {
      "name": "idea",
      "image": "ideskaper.png"
    },
    {
      "name": "fire",
      "image": "ildsjel.png"
    },
    {
      "name": "merchant",
      "image": "kremmer.png"
    },
    {
      "name": "guide",
      "image": "veiviser.png"
    }
  ],
  "minimumPerCategory": 5,
    "categories": [
    { "name": "game" },
    { "name": "task" },
    { "name": "social" },
    { "name": "merch" },
  ],
  "entries": [
    {
      "description": "Vinn i et spill med minst 4 spillere.",
      "category": "game",
    },
    {
      "description":
        "Trill en terning så dårlig at den faller i gulvet, og få noen andre til å plukke den opp for deg.",
      "category": "task",
    },
    {
      "description": "Ta en selfie med en ",
      "category": "task",
      "icon": "idea",
    },
  ],
    "rules": [
    "Velkommen til GrimCon-bingo! Her skal du prøve å oppnå Bingo ved å fullføre forskjellige oppgaver og prøve å få fem-på-rad. Vertikalt, horisontalt og diagonalt er alle gyldige linjer, og midten er allerede krysset av!",
    "For å få et lodd i trekningen av premie av gratis helgepass neste år, må du ha 3 fem-på-rad blant de gyldige linjene."
  ],
}
```