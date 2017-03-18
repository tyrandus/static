![Logo](icon.png)

# Server

``` js
// Anwendung und Server starten
const app = express()
app.listen(3000, () => {
  log.info('Server is ready ...')
})
```

# Routes

```js
// GET-Request: Vertretungsplan als JSON-Datei
app.get('/json/vertretung', (req, res) => {
  res.redirect('/json/vertretung.json')
})

// GET-Request: Vertretungsplan als menschennutzbares Interface
app.get('/vertretung', (req, res) => {
  res.redirect('/vertretung.html')
})

// GET-Request: Impressum
app.get('/impressum', (req, res) => {
  res.redirect('/impressum.html')
})

// GET-Request: Login
app.get('/login', (req, res) => {
  res.redirect('/login.html')
})
```

# Middleware

``` js
function middleware (ANFRAGE, ANTWORT, WEITER) {
  // Code zur Verarbeitung der Anfrage
  if (fertig)  {
    // Weiterleiten oder Daten versenden
    ANTWORT.send(/* z.B. HTML-Datei */)
  } else {
    // An nächste Middleware übergeben
    WEITER()
  }
}
```

# Statische Inhalte

```js
// Für den öffentlichen Zugang benötigte Middleware
const middlewarePublic = [
  express.static('websites'),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json()
]

// Middleware verwenden
app.use(middlewarePublic)
```

# Authentifizierung

``` js
// Middleware zum Authentifizieren des Nutzers anhand des Sessioncookies
function checkAuth (req, res, next) {
  // Ziel des Nutzers speichern
  const origins = req.originalUrl.split('/')
  req.session.origin = origins.pop()

  if (!req.session.user) {
    // Zu Anmeldeformular weiterleiten, wenn nicht angemeldet
    res.redirect('/login.html')
  } else {
    // Sonst Anfrage "durchlassen"
    next()
  }
}
```

``` js
app.post('/login', (req, res) => {
  const origin = req.session.origin
  req.session.origin = null
  const user = req.body.username
  const pass = req.body.password

  if (passwords[user] && passwords[user] === pass) {
    req.session.user = user

    if (req.body.remember) {
      // Anmeldedaten für 30 Tage speichern
      req.sessionOptions.maxAge = 30 * 24 * 60 * 60 * 1000
    }

    res.send({success: '/frontend/' + origin})
  } else {
    res.send({error: 'Ungültige Kombination aus Nutzername und Passwort.'})
  }
})
```

``` json
{
  "admin": "123456",
  "secondary": "pass1234"
}
```

# Upload

``` js
function createDatasetFromTable (tabelle) {
  // ...

  const neueVertretung = []
  const neueLehrer = []

  for (var j = 0; j < tabelle.length; j++) {

    var reihe = tabelle[j]
    const reg = new RegExp(/[[0-9]{1,2}[a-z]|[A][0-9]{2}/i)

    if (reg.test(reihe[0])) {
      // ...

      var klassen = reihe[0].split(/[,|\s| ]+/)
      var stunde = reihe[1]
      var fach = reihe[3] ? reihe[2] + ' ' + resetUndefined(reihe[3]) : reihe[2]
      var lehrer = teacherController.expandTeacherArray(replaceBrackets(resetUndefined(reihe[4])), neueLehrer)
      var raum

      if (reihe[6]) {
        raum = reihe[5] + ' ' + resetUndefined(reihe[6])
      } else {
        raum = reihe[5] ? reihe[5] : '-'
      }

      var bemerkungen = resetUndefined(reihe[7])
      for (var i = 0; i < klassen.length; i++) {

        if (neueVertretung.findIndex(element => {
          return element.klasse === klassen[i] &&
            element.stunde === stunde &&
            element.fach === fach &&
            element.lehrer === lehrer &&
            element.raum === raum &&
            element.bemerkungen === bemerkungen
        }) < 0) {
          // Lehrer, Fächer, Raum als Objekt zur Rückgabe hinzufügen
          neueVertretung.push({
            'klasse': klassen[i],
            stunde,
            fach,
            lehrer,
            raum,
            bemerkungen
          })
        }
      }
    }
  }

  // ...
}
```
``` js
function expandTeacherAbbr (abbr) {
  // Ersatz in Array teachers suchen und zurückgeben
  return teachers[abbr] && config.get('config.expandTeachers') ? teachers[abbr] : abbr
}
```

# Löschen

``` js
function deleteEntryForDate (date) {
  delete vertretung[date]
  delete vertretung._lehrer[date]
  vertretung._daten.splice(vertretung._daten.findIndex(elem => elem === date), 1)
}
```

# Website

``` js
// Stunden, die die Suchkriterien erfüllen
var lessons = vertretung[substitutionDate]

  // Filtern nach ausgewählter Klasse bzw.
  // nach ausgewähltem Lehrer
  .filter(function (stunde) {
    if (MODE === KLASSE) {
      return gradeSelect.value === 'initial'
        || stunde.klasse === gradeSelect.value
    } else if (MODE === LEHRER) {
      return teacherSelect.value === 'initial'
        || stunde.lehrer.indexOf(teacherSelect.value) >= 0
    }
  })
  // Sortieren nach Klassen und Stunden
  // (10a - 10c vor 5a - 9c vor A17 - A18)
  .sort(function (stundeA, stundeB) {
    if (stundeA.klasse > stundeB.klasse) {
      return 1
    } else if (stundeA.klasse === stundeB.klasse) {
      return stundeA.stunde > stundeB.stunde ? 1 : -1
    } else {
      return -1
    }
  })
  // Für jedes Ergebnis ein <div.lesson> ausgeben
  .map(function (stunde) {
    return `
      <div class="lesson" data-grade="${stunde.klasse}" style="border-color: ${colorClues[stunde.klasse]};">
        <ul class="fa-ul">
          <li>
            <i class="fa fa-li fa-clock-o"></i>
            ${stunde.stunde}. Stunde
          </li>
          <li>
            <i class="fa fa-li fa-list"></i>
            ${stunde.fach}
          </li>
          <li>
            <i class="fa fa-li fa-user"></i>
            ${stunde.lehrer}
          </li>
          <li>
            <i class="fa fa-li fa-map-marker"></i>
            ${stunde.raum}
          </li>
          <li>
            <i class="fa fa-li fa-pencil-square-o"></i>
            ${stunde.bemerkungen || 'Keine Bemerkungen.'}
          </li>
        </ul>
      </div>
    `
  })
  // Array zusammenfügen
  .join('')

  // HTML in <#results> einfügen
  results.innerHTML = lessons
```

# Desktopmitteilungen

``` js
notifier.notify({
  title: 'DudenVertretung Desktop',
  message: 'Neue Vertretungsplandaten sind jetzt verfügbar.',
  icon: path.join(__dirname, 'img', 'appicon.png'),
  sound: true,
  wait: true
})
```
