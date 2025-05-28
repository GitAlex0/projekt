# JSON Datei Aufbau

- **"1", "2", ...** *"String"*:  
    Fragen-ID, einzigartig, immer hochzählen.

- **q** *"String"*:  
    Frage.

- **type** *"String"*:  
    Fragentyp:  
    - `"mc"`: Multiple choice  
    - `"r"`: Slider

- **a** *"String"*:  
    (Nur bei `"mc"` Typ) Object, dass alle Antwortmöglichkeiten enthählt.

- **c** *Int*:  
    (Optional, bei `"mc"` Typ) Die korrekte Antwort.

- **r** *{Object}*:  
    (Nur bei `"r"` Typ) Object mit mit min. und max. Slider:  
    - `min` *Int*: minimaler  Wert
    - `max`*Int*: maximaler Wert

- **skill** *"String"*:  
    Skill / Fähigkeit der mit der Frage eruiert werden soll.

- **next** *Int*:  
    (Optional) Die Fragen-ID, die auf diese Frage folgen soll.

- **timed** *Boolean*:  
    (Optional) `true` oder `false`, zeigt an, ob Zeit bei Frage erfasst werden soll.

**Beispiel Frage:** <br>
`5: { q: "What is your favorite hobby?", type: "mc", a: { 1: "Reading", 2: "Sports", 3: "Gaming", 4: "Traveling" }, skill: "season", timed:true},`
