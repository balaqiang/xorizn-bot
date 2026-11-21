// Fitur fun/cekperfoma — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/cekperfoma", {
  "name": "cekperforma",
  "command": [
    "cekperforma",
    "performa",
    "cekperf"
  ],
  "category": "fun",
  "desc": "Cek performa secara random (bercanda)",
  "usage": ".cekperforma <nama>",
  "owner": false,
  "group": false,
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
