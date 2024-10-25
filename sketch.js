let angle; // Dichiarazione della variabile per l'angolo
let angles = []; // Dichiarazione dell'array per gli angoli
let offsets = []; // Dichiarazione dell'array per gli offset

function preload() {
  // put preload code here
}

function setup() {
  let canvasWidth = windowWidth; // Imposta la larghezza del canvas come la larghezza della finestra
  let canvasHeight = canvasWidth * (200 / 400); // Mantiene la proporzione per l'altezza
  createCanvas(canvasWidth, canvasHeight); // Crea il canvas con larghezza e altezza responsive
  
  angle = random(TWO_PI); // Genera un angolo casuale all'inizio
  
  let totalRects = 34 * 20; // Numero totale di rettangoli
  let cols = 34; // Numero di colonne
  let rows = 20; // Numero di righe
  let centerX = cols / 2; // Indice della colonna centrale
  let centerY = rows / 2; // Indice della riga centrale

  for (let j = 0; j < rows; j++) { // Ciclo per le righe
    for (let i = 0; i < cols; i++) {
      // Se il rettangolo è ai lati, l'angolo è 0
      if (i === 0 || i === cols - 1 || j === 0 || j === rows - 1) {
        angles[j * cols + i] = 0; // Angolo fisso di 0
        offsets[j * cols + i] = { x: 0, y: 0 }; // Nessun offset per i bordi
      } else {
        // Calcola la distanza dal centro per determinare l'angolo
        let distanceFromCenter = dist(i, j, centerX, centerY);
        // Mappa la distanza a un angolo massimo, aumentando l'inclinazione verso il centro
        let maxAngle = map(distanceFromCenter, 0, dist(0, 0, centerX, centerY), PI / 4, 0); 
        // Genera un angolo casuale tra -maxAngle e +maxAngle
        angles[j * cols + i] = random(-maxAngle, maxAngle); // Angolo casuale per i rettangoli interni
        
        // Aggiungi un offset se il rettangolo è vicino al centro
        if (distanceFromCenter < 5) { // Aumenta la soglia per considerare "vicino al centro"
          offsets[j * cols + i] = { 
            x: random(-10, 10), // Offset casuale per la posizione x
            y: random(-10, 10)  // Offset casuale per la posizione y
          };
        } else {
          offsets[j * cols + i] = { x: 0, y: 0 }; // Nessun offset per i rettangoli più lontani
        }
      }
    }
  }
  
  window.addEventListener('resize', () => {
    let canvasWidth = windowWidth; // Ricalcola la larghezza del canvas
    let canvasHeight = canvasWidth * (200 / 400); // Ricalcola l'altezza mantenendo la proporzione
    resizeCanvas(canvasWidth, canvasHeight); // Ridimensiona il canvas
  });
}

function draw() {
  background("white");
  
  let rectSize = Math.min(width, height) / 34 * 1.50; // Calcola la dimensione del quadrato
  let cols = 34; // Numero di colonne
  let rows = 20; // Numero di righe
  let x = (width - cols * rectSize) / 2; // Calcola la posizione x
  let y = (height - rows * rectSize) / 2; // Calcola la posizione y

  let centerX = cols / 2; // Indice della colonna centrale
  let centerY = rows / 2; // Indice della riga centrale

  let index = 0; // Indice per accedere agli angoli
  for (let j = 0; j < rows; j++) { // Ciclo per le righe
    for (let i = 0; i < cols; i++) {
      // Calcola la distanza dal centro
      let distanceFromCenter = dist(i, j, centerX, centerY);
      // Mappa la distanza a un angolo,
      let maxAngle = map(distanceFromCenter, 0, dist(0, 0, centerX, centerY), PI / 4, 0); 
      // Usa l'angolo fisso dall'array
      let angle = angles[index]; 
      
      push(); // Salva lo stato corrente della trasformazione
      translate(x + i * rectSize + rectSize / 2 + offsets[index].x, y + j * rectSize + rectSize / 2 + offsets[index].y); // Trasla il punto di origine con offset
      rotate(angle); // Ruota con l'angolo fisso
      
      // Disegna il rettangolo con solo il bordo
      noFill(); // Disabilita il riempimento
      stroke("black"); // Imposta il colore del bordo
      rect(-rectSize / 2, -rectSize / 2, rectSize, rectSize); // Disegna il rettangolo centrato
      
      pop(); // Ripristina lo stato precedente della trasformazione
      index++; // Incrementa l'indice per il prossimo rettangolo
    }
  }
}
