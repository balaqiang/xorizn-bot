// Fitur tools/carbon — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/carbon", {
  "name": "carbon",
  "command": [
    "carbon",
    "carbonify",
    "carboncode"
  ],
  "category": "tools",
  "desc": "Membuat gambar kode dengan tampilan carbon style",
  "usage": ".carbon <kode>",
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
