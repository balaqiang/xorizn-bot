// Fitur tools/potongsound — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/potongsound", {
  "name": "potongsound",
  "command": [
    "potongsound",
    "cutsound",
    "trimsound",
    "potongvn",
    "cutvn"
  ],
  "category": "tools",
  "desc": "Potong audio atau voice note sesuai durasi yang diinginkan",
  "usage": ".potongsound <awal> <akhir> [fadein|fadeout|fadeall]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
