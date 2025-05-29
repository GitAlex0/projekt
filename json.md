# JSON Datei Aufbau

## Felder

| Feld         | Typ         | Beschreibung                                                                                   |
|--------------|-------------|-----------------------------------------------------------------------------------------------|
| **1, 2, ...** | *Int*      | Fragen-ID, einzigartig, immer hochzählen                                                     |
| **q**        | *String*    | Frage                                                                                        |
| **type**     | *String*    | Fragentyp:<br>• `"mc"`: Multiple Choice<br>• `"r"`: Slider                                   |
| **a**        | *Object*    | *(Nur bei `"mc"` Typ)* Objekt, das alle Antwortmöglichkeiten enthält <br> Aktuelles Limit: `5`, Design muss optimiert werden für mehr Fragen                         |
| **c**        | *Int*       | *(Optional, bei `"mc"` Typ)* Die korrekte Antwort                                            |
| ~~**r**~~        | ~~*Object*~~    | ~~*(Nur bei `"r"` Typ)* Objekt mit min. und max. Slider:<br>• `min` *Int*: minimaler Wert<br>• `max` *Int*: maximaler Wert~~  <br>**Nicht implementiert, wahrscheinlich kein Bedarf! <br> Wird in Zukunft entfernt**|
| **skill**    | *String*    | Skill / Fähigkeit, die mit der Frage eruiert werden soll                                     |
| **next**     | *String*    | *(Optional)* Die Fragen-ID, die auf diese Frage folgen soll                                  |
| **timed**    | *Boolean*   | *(Optional)* `true` zeigt an, ob Zeit bei Frage erfasst werden soll. Bei `false` weglassen   |

---

## Beispiel Frage

```json
5: {
    q: "What is your favorite hobby?",
    type: "mc",
    a: {
        1: "Reading",
        2: "Sports",
        3: "Gaming",
        4: "Traveling"
    },
    skill: "season",
    timed: true
}

0: { q: "", type: "", a: { 1: "", 2: "", 3: "", 4: "", 5: "" }, c: 1, skill: "", next:"", timed: true}
```
