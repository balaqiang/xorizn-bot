// Fitur tools/tovn — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/tovn", {
  "name": "tovn",
  "command": [
    "tovoicenote",
    "toptt",
    "audiotovn"
  ],
  "category": "tools",
  "desc": "Mengubah audio/video menjadi voice note",
  "usage": ".tovn (reply/caption audio/video)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
