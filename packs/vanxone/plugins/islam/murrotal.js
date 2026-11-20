// Fitur islamic/murrotal — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("islamic/murrotal", {
  "name": "murrotal",
  "command": [
    "murrotal",
    "murottal",
    "audioquran",
    "quraudio"
  ],
  "category": "islam",
  "desc": "Dengarkan audio murottal Al-Quran berdasarkan surah",
  "usage": ".murrotal <nama surah>",
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
