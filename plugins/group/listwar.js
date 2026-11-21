// Fitur group/listwar — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/listwar", {
  "name": "listwar",
  "command": [
    "listwar",
    "triggerlist",
    "autolist"
  ],
  "category": "group",
  "desc": "Aktif/nonaktifkan trigger list grup (ketik ",
  "usage": ".listwar <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
