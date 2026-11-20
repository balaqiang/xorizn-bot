// Fitur stalker/countrystalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/countrystalk", {
  "name": "countrystalk",
  "command": [
    "countrystalk",
    "stalknegara",
    "infonegara"
  ],
  "category": "stalker",
  "desc": "Mencari informasi detail tentang suatu negara",
  "usage": ".country <nama negara>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
