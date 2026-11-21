// Fitur rpg/stamina — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/stamina", {
  "name": "stamina",
  "command": [
    "stamina",
    "energy",
    "cekstamina"
  ],
  "category": "rpg",
  "desc": "Cek dan pulihkan stamina",
  "usage": ".stamina / .stamina isi",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
