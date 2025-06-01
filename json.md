# Dokumentation JSON-Dateien
Zum erstellen:
- Daten in `create.js` in `quizData` oder `skillData` eingeben
- Befehl in Terminal ausführen:
    ```console
    node create.js
    ```
## Inhaltsverzeichnis

- [quiz.json Aufbau](#quizjson-aufbau)
    - [Felder](#felder)
    - [Beispiel Frage](#beispiel-frage)
- [skills.json Aufbau](#skillsjson-aufbau)
    - [Felder](#felder-1)
    - [Beispiel](#beispiel-beruf)

## quiz.json Aufbau

### Felder

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
| **timed**    | *Object*   | *(Optional)* `max` in Sekunden, maximale Zeit für Höchstpunktzahl <br> `zero` in Sekunden, Zeit nach der 0 Punkte vergeben werden|

---

### Beispiel Frage

```js
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

0: { q: "", type: "", a: { 1: "", 2: "", 3: "", 4: "", 5: "" }, c: 1, skill: "", next:"", timed: {max: , zero: }}
```




## skills.json Aufbau

### Felder

| Feld         | Typ         | Beschreibung                                                                                   |
|--------------|-------------|-----------------------------------------------------------------------------------------------|
| **job1, job2, ...** | *Object*   | Name des Beruf(sfelds)                                                                 |
| **skill1, skill2**        | *Int*    | Gewichtung des jeweiligen Berufs, sollte ein  niedriger einstelliger Wert sein *(1-5)*                                                                                        |

### Beispiel Beruf
```js
job1: {
    skill1: 1,
    skill2: 4,
}

job1: { skill1: 1, skill2: 4 },
```