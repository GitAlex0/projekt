# quiz.js Funktionsdokumentation
## Inhaltsverzeichnis

- [next()](#next)
- [populateQuiz(question)](#populatequizquestion)
- [createButton(value-id-questionid)](#createbuttonvalue-id-questionid)
- [clearButtons()](#clearbuttons)
- [inputSlider(slider)](#inputsliderslider)
- [answerButtonPress(button)](#answerbuttonpressbutton)
- [saveAnswer(questionId-answerId-timefalse)](#saveanswerquestionid-answerid-timefalse)
- [keepTime(timeID-force--false)](#keeptimetimeid-force--false)
- [Wie die Funktionen zusammenhängen](#wie-die-funktionen-zusammenhängen)
- [Zusammenfassung](#zusammenfassung)
## next()
**Argumente:** keine  
**Beschreibung:**  
Wechselt zur nächsten Frage im Quiz.
- Löscht vorherige Antwort-Buttons und UI-Elemente.
- Zeigt die nächste Quizfrage mit `populateQuiz` an.
- Berechnet und aktualisiert die Fortschrittsanzeige mit `setProgress`.
- Aktualisiert den Cookie-Index und erhöht den Fragenindex.
- Versteckt den "Weiter"-Button und zeigt den "Ergebnis"-Button, wenn das Quiz beendet ist.

---

## populateQuiz(question)
**Argumente:**  
- `question` (Objekt): Das aktuelle Frageobjekt, das angezeigt werden soll.

**Beschreibung:**  
Zeigt die aktuelle Frage und die möglichen Antworten an.
- Setzt den Fragetext.
- Bei Multiple-Choice-Fragen (`type == "mc"`) werden Antwort-Buttons mit `createButton` erstellt.
- Bei einer Slider-Frage wird der Slider angezeigt und dessen Wert gesetzt.
- Bei zeitgesteuerten Fragen werden relevante UI-Elemente angezeigt/versteckt und der Timer mit `keepTime` gestartet/gestoppt.

---

## createButton(value, id, questionId)
**Argumente:**  
- `value` (String): Der Text für den Antwort-Button.
- `id` (Nummer|String): Die ID der Antwort.
- `questionId` (String|Nummer): Die ID der Frage.

**Beschreibung:**  
Erstellt einen Antwort-Button für eine Multiple-Choice-Frage.
- Klont eine Button-Vorlage, setzt Text und Datenattribute.
- Fügt den Button der UI hinzu.
- Hebt den Button hervor, wenn er zuvor ausgewählt wurde.

---

## clearButtons()
**Argumente:** keine  
**Beschreibung:**  
Entfernt alle Antwort-Buttons und blendet UI-Elemente zur aktuellen Frage aus.
- Leert den Button-Container.
- Versteckt Slider, Timer und Lock-UI-Elemente.

---

## inputSlider(slider)
**Argumente:**  
- `slider` (HTMLInputElement): Das Slider-Input-Element.

**Beschreibung:**  
Verarbeitet die Eingabe für Slider-Fragen.
- Aktualisiert den angezeigten Wert.
- Speichert die Antwort mit `saveAnswer`.

---

## answerButtonPress(button)
**Argumente:**  
- `button` (HTMLElement): Der gedrückte Button.

**Beschreibung:**  
Verarbeitet die Logik, wenn ein Antwort-Button gedrückt wird.
- Bestimmt, welche Antwort ausgewählt wurde.
- Handhabt das Timing bei zeitgesteuerten Fragen (mit `keepTime`).
- Speichert die Antwort mit `saveAnswer`.
- Deaktiviert andere Buttons, wenn die Frage zeitgesteuert ist.
- Hebt den ausgewählten Button hervor.

---

## saveAnswer(questionId, answerId, time=false)
**Argumente:**  
- `questionId` (String|Nummer): Die ID der aktuellen Frage.
- `answerId` (String|Nummer): Die ID der ausgewählten Antwort.
- `time` (Nummer|Boolean, optional): Die benötigte Zeit zum Beantworten (falls zeitgesteuert).

**Beschreibung:**  
Speichert die Antwort des Nutzers (und ggf. die Zeit) in localStorage.
- Aktualisiert das `answers`-Objekt in localStorage.
- Bei Zeitmessung wird das `times`-Objekt in localStorage aktualisiert.

---

## keepTime(timeID, force = false)
**Argumente:**  
- `timeID` (String): Die eindeutige Kennung für den Timer (meist die Frage-ID).
- `force` (Boolean, optional): Bei true wird der Timer auch dann zurückgesetzt, wenn er existiert.

**Beschreibung:**  
Verwaltet das Timing für zeitgesteuerte Fragen mit Cookies.
- Existiert ein Timer-Cookie und `force` ist false, wird die vergangene Zeit berechnet und zurückgegeben, dann das Cookie gelöscht.
- Existiert kein Timer oder `force` ist true, wird ein neuer Timer-Cookie gesetzt und `true` zurückgegeben.

---

## Wie die Funktionen zusammenhängen

- **Nutzer klickt "Weiter"-Button:**  
    Ruft `next()` auf, das die vorherige UI löscht, die nächste Frage mit `populateQuiz()` anzeigt und die Fortschrittsanzeige aktualisiert.
- **`populateQuiz()`**  
    Entscheidet, ob die Frage Multiple-Choice oder Slider ist, und erstellt die passende UI (Buttons via `createButton()` oder Slider).
    Handhabt zeitgesteuerte Fragen mit `keepTime()`.
- **Nutzer wählt eine Antwort:**  
    - Bei Buttons: `answerButtonPress()` wird aufgerufen, nutzt ggf. `keepTime()` und ruft immer `saveAnswer()` auf.
    - Bei Slider: `inputSlider()` wird aufgerufen, das `saveAnswer()` aufruft.
- **`saveAnswer()`**  
    Speichert die Antwort (und ggf. Zeit) des Nutzers in localStorage.
- **`clearButtons()`**  
    Wird genutzt, um die UI vor der nächsten Frage zurückzusetzen.
- **Fortschrittsanzeige:**  
    Wird in `next()` mit der globalen Funktion `setProgress()` aktualisiert.

---

**Zusammenfassung:**  
Die Funktionen arbeiten zusammen, um Fragen anzuzeigen, Nutzereingaben zu verarbeiten, Zeit zu messen, Antworten zu speichern und UI sowie Fortschrittsanzeige während des Quiz zu aktualisieren.