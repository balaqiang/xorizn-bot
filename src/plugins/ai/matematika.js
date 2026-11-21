// Fitur ai/matematika — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/matematika", {
  "name": "mathgpt",
  "command": [
    "mathgpt",
    "mathsolver"
  ],
  "category": "ai",
  "desc": "AI untuk menyelesaikan soal matematika",
  "usage": ".matematika <soal>",
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
    "assets": []
  }
})
