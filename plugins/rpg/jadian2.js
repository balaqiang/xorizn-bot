// Fitur rpg/jadian2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/jadian2", {
  "name": "tembak2",
  "command": [
    "tembak2",
    "terima2",
    "tolak2",
    "putus2",
    "pasangan2"
  ],
  "category": "rpg",
  "desc": "Fitur hubungan: tembak, terima, tolak, putus, dan cek pasangan",
  "usage": ".tembak @tag\\n.terima\\n.tolak\\n.putus\\n.pasangan",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
