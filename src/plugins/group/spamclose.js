// Fitur group/spamclose — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("group/spamclose", {
  "name": "spamclose",
  "command": [
    "spamclose",
    "spam-close"
  ],
  "category": "group",
  "desc": "Otomatis menutup grup saat member mengirim 5 pesan beruntun",
  "usage": ".spamclose on/off",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
