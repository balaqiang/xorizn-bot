// Fitur media/music — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("media/music", {
  "name": "music",
  "command": [
    "music"
  ],
  "category": "audio",
  "desc": "Koleksi musik 1-65",
  "usage": ".music1 sampai .music65",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
