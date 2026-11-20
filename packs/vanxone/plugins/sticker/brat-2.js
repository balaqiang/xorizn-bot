// Fitur sticker/brat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/brat", {
  "name": "brat",
  "command": [
    "bratmenu",
    "bratimg",
    "brattext"
  ],
  "category": "sticker",
  "desc": "Menu variant brat dan generator sticker brat",
  "usage": ".brat | .bratimg <text>",
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
