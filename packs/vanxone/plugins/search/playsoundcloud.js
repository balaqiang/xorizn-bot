// Fitur search/playsoundcloud — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/playsoundcloud", {
  "name": "playsoundcloud",
  "command": [
    "playsoundcloud",
    "playsc"
  ],
  "category": "search",
  "desc": "Cari dan download lagu dari SoundCloud",
  "usage": ".playsc judul",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
