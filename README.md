# event-bingo
Bingo for eventer 

Trenger json-struktur i en fil. minimumPerCategory er påkrevd og minst en kategori-type.

## Krav

Kategori i `category` *må* være korrekt og eksistere i `categories` listen.

Hvis egenskapen `icon` er i et entry, vil et ikon dukke opp _etter_ teksten. Ikonene kan være et av følgende:

    idea, fire, merchant, guide

`minimumPerCategory` må være minst 1.

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
    "For å få et lodd i trekningen av premie av gratis helgepass neste år, må du ha 3 fem-på-rad blant de gyldige linjene.",
    "Har du fylt ut hele brettet, teller det som to lodd. Innleveringsfrist søndag kl 15.",
    "Tusen takk til Marthe fra Sola brettspillklubb som lot oss få bruke ideen hennes til Grimcon 2024!"
  ],
}
```