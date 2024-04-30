# event-bingo
Bingo for eventer 

Trenger json-struktur i en fil. minimumPerCategory er påkrevd og minst en kategori-type.

## Krav

Kategori i `category` *må* være korrekt og eksistere i `categories` listen.

Hvis egenskapen `icon` er i et entry, vil et ikon dukke opp etter teksten. Ikonene kan være et av følgende:

    idea, fire, merchant, guide

`minimumPerCategory` må være minst 1 og kan ikke overstige maksimalt antall oppgaver med den kategori i json-filen.

```json
// input.json
  
{
  minimumPerCategory: 5,
  categories: ["game", "task", "social"],
  entries: [
    {
      id: 0,
      description: "Vinn i et spill med minst 4 spillere.",
      category: "game",
    },
    {
      id: 1,
      description:
        "Trill en terning så dårlig at den faller i gulvet, og få noen andre til å plukke den opp for deg.",
      category: "task",
    },
    {
      id: 24,
      description: "Ta en selfie med en ",
      category: "task",
      icon: "idea",
    },
  ]
}
```