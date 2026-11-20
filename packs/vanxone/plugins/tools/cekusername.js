// Fitur tools/cekusername — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/cekusername", {
  "name": "cekusername",
  "command": [
    "cekusername",
    "checkusername",
    "usernamewa"
  ],
  "category": "tools",
  "desc": "Cek ketersediaan username WhatsApp",
  "usage": ".cekusername <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
