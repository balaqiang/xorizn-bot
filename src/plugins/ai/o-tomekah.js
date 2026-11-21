// Fitur ai/o-tomekah — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/tomekah", {
  "name": "tomekah",
  "command": [
    "tomekah",
    "mekah",
    "mecca",
    "tomecca"
  ],
  "category": "ai",
  "desc": "Ubah background gambar ke Mekah",
  "usage": ".tomekah (reply gambar)",
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
