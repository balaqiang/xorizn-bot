// Fitur tools/nulis — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/nulis", {
  "name": "nulis",
  "command": [
    "tulis",
    "write"
  ],
  "category": "tools",
  "desc": "Generate tulisan tangan di kertas",
  "usage": ".nulis <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": [
      "ourin-font",
      "ourin-kertas"
    ]
  }
})
