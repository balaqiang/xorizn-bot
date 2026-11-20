// Fitur tools/o-transkrip — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/transkrip", {
  "name": "transkrip",
  "command": [
    "transkrip",
    "stt",
    "speechtotext",
    "transcribe"
  ],
  "category": "tools",
  "desc": "Konversi voice note / audio ke teks (Speech-to-Text)",
  "usage": ".transkrip (reply voice note)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [
      "groq"
    ],
    "scrapers": [],
    "assets": []
  }
})
