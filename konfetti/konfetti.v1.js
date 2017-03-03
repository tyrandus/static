var doit = false; // SETZT ANIMATION IN GANG
var outoftime = false; // BOOLEAN FÜR ANIMATIONSENDE
var reset = true; // IST TRUE NACH RESET
var circles = []; // ARRAY FUER ZAHLEN
var canv; // CANVAS
var start; // STARTZEIT
var number = 200; // ANZAHL DER ZAHLEN
var gefallene = 0; // RESET-ZAHLEN

// WIRD DURCH CLICK AUF DIV AUFGERUFEN, UM KONFETTI ZU STARTEN
function activate() {
  doit = true;
  reset = false;
  start = millis(); // STARTZEIT ZUM BEENDEN DER ANIMATION
}


// SETZT CANVAS UND ZAHLEN ZURUECK FUER NAECHSTE ANIMATION
function res() {
  doit = false;
  canvas.style.display = 'none';
  outoftime = false;
  gefallene = 0;

  for (var i = 0; i < circles.length; i++) {
    var cur = circles[i];
    cur.x = floor(random(width));
    cur.y = floor(random(1000) - 1000);
    cur.gez = false;
    cur.val = random([0, 1]);
  }

}

// ERSTELLT ZU BEGINN CANVAS MIT <NUMBER> ZAHLEN
function setup() {

  // ERMITTELT DOKUMENTHÖHE
  var body = document.body,
    html = document.documentElement;
  var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);


  // ERSTELLT CANVAS
  canv = createCanvas(windowWidth, height);
  canv.id('canv');
  canv.position(0, 0);


  //ERSTELLT <NUMBER> ZAHLEN
  for (var i = 0; i < number; i++) {

    var rand = random(100);

    var circle = {
      x: floor(random(width)) // X-POSITION
        ,
      y: floor(random(1000) - 1000) // Y-POSITION
        ,
      r: floor(map(rand, 0, 100, 20, 30)) // RADIUS
        ,
      vel: floor(map(rand, 0, 100, 8, 16)) // GESCHWINDIGKEIT
        ,
      startvel: floor(map(rand, 0, 100, 8, 16)) //ANFANGSGESCHWINDIGKEIT
        ,
      gez: false // KREIS WURDE NOCH NICHT ENTFERNT (ENDE DER ANIMATION)
        ,
      val: random([0, 1])
    }

    // FUEGT ZAHLEN ARRAY <CIRCLES[ ]> HINZU
    circles.push(circle);
  }


}

// Bei Änderung der Fensterbreite
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ZEICHNET ZAHLEN
function draw() {

  fill(15, 93, 0);

  // PRUEFT, OB ZEIT ABGELAUFEN IST
  if (millis() - start > 2000) {
    outoftime = true;
    reset = false;
  }

  // PRUEFT, KONFETTI AKTIV IST
  if (doit) {

    // AKTIVIERT UND LEERT CANVAS
    var canvas = document.getElementById('canv');
    canvas.style.display = 'block';
    canvas.getContext('2d').clearRect(0, 0, this.width, this.height);

    noStroke();

    // SCHLEIFE FUER ZUGRIFF AUF >CIRCLES[]<
    for (var i = 0; i < circles.length; i++) {

      var cur = circles[i];

      // PRUEFT, OB KREIS NACH ABLAUF DER ZEIT ZURUECKGESETZT WURDE
      // AN SEINE ANFANGSPOSITION, ADDIERT IHN DANN ZU >GEFALLENE<
      if (cur.y === -50 && outoftime) {
        if (!cur.gez) {
          gefallene++;
          cur.gez = true;
        }

        // WENN ALLE ZAHLEN ZURUECKGESETZT SIND, WIRD DIE CANVAS
        // DURCH <RES()> ZURUECKGESETZT
        if (gefallene === number) {
          doit = false;
          res();
          break;
        }

        // ZEICHNET NORMAL ZAHLEN
      } else {

        var curpos = document.documentElement.scrollTop; // AKTUELLE SCROLLPOSITION

        // fill(cur.cr, cur.cg, cur.cb);
        textSize(cur.r);
        text(cur.val, cur.x, cur.y);

        cur.y += cur.vel;

        // SETZT ZAHLEN ZURUECK UND GIBT IHNEN NEUE FARBE
        if (cur.y >= curpos + windowHeight) {
          cur.y = -50;
        }
      }
    }

  }
}
