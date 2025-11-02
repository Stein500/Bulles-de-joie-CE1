const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Données des élèves (pour commencer)
let donneesEcole = {
  "eleves": {
    "fifame": { 
      nom: "AGBLO AGONDJIHOSSOU Fifamè", 
      notes: [19.25, 16.50, 5, 15, 15.25, 14, 15, 17, 12],
      telephoneParent: "12345678"
    },
    "emmanuel": { 
      nom: "AKYOH Emmanuel", 
      notes: [7.50, 18.50, 0, 12, 7, 14.50, 5.25, 18, 13],
      telephoneParent: "87654321" 
    }
  }
};

// Route pour obtenir les notes d'un élève
app.get('/eleve/:id', (req, res) => {
  const eleveId = req.params.id;
  const telephone = req.query.telephone;
  
  const eleve = donneesEcole.eleves[eleveId];
  
  if (eleve && eleve.telephoneParent === telephone) {
    res.json({ succes: true, eleve: eleve });
  } else {
    res.json({ succes: false, message: "Accès refusé" });
  }
});

// Route pour modifier les notes (enseignant)
app.post('/admin/modifier-notes', (req, res) => {
  const { eleveId, nouvellesNotes } = req.body;
  
  if (donneesEcole.eleves[eleveId]) {
    donneesEcole.eleves[eleveId].notes = nouvellesNotes;
    res.json({ succes: true, message: "Notes mises à jour" });
  } else {
    res.json({ succes: false, message: "Élève non trouvé" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Bulles de Joie démarrée sur le port ${PORT}`);
});
