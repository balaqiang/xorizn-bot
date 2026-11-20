// Fitur tools/removebg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/removebg", {
  "name": "removebg",
  "command": [
    "rmbg",
    "nobg",
    "hapusbg"
  ],
  "category": "tools",
  "desc": "Menghapus background gambar",
  "usage": ".removebg (reply gambar)",
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
