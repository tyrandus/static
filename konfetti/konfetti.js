var figures = []          // Array für Zahlenobjekte
var fontSize = 24         // Schriftgröße
var maxFigures = 100      // Anzahl der zu zeigenden Zahlen
var finishedFigures = 0   // Zahlen, die unteren Bildschirmrand erreicht haben
var active = false        // Animation gerade aktiv?
var canv                  // <canvas#canv>

function setup () {
  // Allgemeine Konfiguration
  canv = createCanvas(windowWidth, windowHeight)
  canv.id('canv')
  textSize(fontSize)
  textFont('Consolas')
  background('rgba(0, 0, 0, 0)')
  fill(15, 93, 0);

  // Zahlen generieren
  createFigures()
}

function draw () {
  if (active) {
    // Canvas-Element zurücksetzen
    var canvas = document.getElementById('canv')
    canvas.getContext('2d').clearRect(0, 0, this.width, this.height)

    // Jede Zahl ...
    figures.forEach(function (figure, index) {
      // ... wenn noch nicht beendet anzeigen
      if (!figure.finished) {
        text(figure.number, figure.x, figure.y)
        figure.y += figure.speed
        figure.speed += 0.01

        // Wenn Zahl unteren Bildschirmrand übertritt
        if (figure.y > height + fontSize) {
          figure.finished = true
          finishedFigures++

          // Wenn alle Zahlen durchgelaufen
          if (finishedFigures === maxFigures) {
            active = false
            finishedFigures = 0
            canv.hide()
            createFigures()
          }
        }
      }
    })
  }
}


function createFigures () {
  figures = []

  // erstellt <maxFigures> Zahlen
  for (var i = 0; i < maxFigures; i++) {
    figures.push({
      x: Math.round(random(0, width)),
      y: Math.round(random(-height, 0)),
      number: Math.round(random(0, 1)),
      speed: random(5, 15),
      finished: false
    })
  }
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
  if (!active) {
    createFigures()
  }
}

function activate () {
  canv.show()
  active = true
}
