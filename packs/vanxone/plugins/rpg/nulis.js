// Fitur rpg/nulis — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/nulis", {
  "name": "nulis",
  "command": [
    "nulis",
    "author",
    "wattpad"
  ],
  "category": "rpg",
  "desc": "Nulis cerpen atau artikel untuk dapet royalti",
  "usage": ".nulis",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
