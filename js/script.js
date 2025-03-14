const firebaseConfig = {
    apiKey: "TAIzaSyBtdZN0A-BkjQ7ixEVfSRaqqUqa6I8mTDs",
    authDomain: "trovalibri-e26dc.firebaseapp.com",
    projectId: "trovalibri-e26dc",
    storageBucket: "trovalibri-e26dc.firebasestorage.app",
    messagingSenderId: "217261855254",
    appId: "1:217261855254:web:628470bda2e0208e1ddb37"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('cercaBtn').addEventListener('click', cercaLibri);
  });
  
  async function cercaLibri() {
      const categoria = document.getElementById('categoriaInput').value.trim();
  
      if (!categoria) {
          alert('Inserisci una categoria valida.');
          return;
      }
  
      const url = `https://openlibrary.org/subjects/${categoria}.json?limit=10`;
  
      try {
          const res = await fetch(url);
          if (!res.ok) throw new Error('Categoria non trovata.');
          const dati = await res.json();
          mostraRisultati(dati.works);
      } catch (error) {
          alert(error.message);
          console.error(error);
      }
  }
  
  function mostraRisultati(books) {
      const lista = document.getElementById('risultati');
      lista.innerHTML = '';
  
      if (!books || books.length === 0) {
          lista.innerHTML = '<li>Nessun libro trovato per questa categoria.</li>';
          return;
      }
  
      books.forEach(libro => {
          const li = document.createElement('li');
          li.textContent = `${libro.title} (Autori: ${libro.authors.map(a => a.name).join(', ')})`;
          li.addEventListener('click', () => mostraDescrizione(libro.key, li));
          lista.appendChild(li);
      });
  }
  
  async function mostraDescrizione(keyLibro, elementoCliccato) {
      document.querySelectorAll('.descrizione').forEach(el => el.remove());
  
      const url = `https://openlibrary.org${keyLibro}.json`;
  
      const descrizioneElemento = document.createElement('div');
      descrizioneElemento.classList.add('descrizione');
      descrizioneElemento.innerHTML = 'Caricamento descrizione...';
      elementoCliccato.after(descrizioneElemento);
  
      try {
          const res = await fetch(url);
          if (!res.ok) throw new Error('Errore nel caricamento descrizione libro.');
  
          const dati = await res.json();
  
          let descrizioneTesto = 'Descrizione non disponibile.';
          if (dati.description) {
              descrizioneTesto = typeof dati.description === 'string' ? dati.description : dati.description.value;
          }
  
          descrizioneElemento.innerHTML = `
              <strong>Descrizione:</strong><br>${descrizioneTesto}<br>
              <button id="salvaLibroBtn">Salva libro</button>`;
  
          document.getElementById('salvaLibroBtn').onclick = () => {
              salvaLibroFirebase(dati.title, descrizioneTesto, keyLibro);
          };
  
      } catch (err) {
          descrizioneElemento.innerHTML = 'Errore caricamento descrizione libro.';
          console.error(err);
      }
  }
  
  function salvaLibroFirebase(titolo, descrizione, keyLibro) {
      db.collection('libriSalvati').add({
          titolo: titolo,
          descrizione: descrizione,
          keyLibro: keyLibro,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((docRef) => {
          alert('Libro salvato correttamente con ID: ' + docRef.id);
      })
      .catch((error) => {
          alert('Errore salvataggio libro: ' + error.message);
          console.error(error);
      });
  }


  document.getElementById("categoriaInput").addEventListener("input", function () {
    this.value = this.value.toLowerCase(); 
});

document.getElementById("cercaBtn").addEventListener("click", function () {
    let categoria = document.getElementById("categoriaInput").value.toLowerCase(); 
    console.log("Ricerca per categoria:", categoria);
   
});