// Fitur canvas/darkness — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/darkness", {
  "name": "darkness",
  "command": [
    "darkness",
    "drakness"
  ],
  "category": "image",
  "desc": "Beri efek gelap pada gambar",
  "usage": ".darkness [amount]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
