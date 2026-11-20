// Fitur ai/o-toghibli — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/toghibli", {
  "name": "toghibli",
  "command": [
    "toghibli",
    "ghiblistyle"
  ],
  "category": "ai",
  "desc": "Ubah gambar ke style Ghibli",
  "usage": ".toghibli (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
