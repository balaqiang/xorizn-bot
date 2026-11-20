// Fitur sticker/linesticker — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/linesticker", {
  "name": "linesticker",
  "command": [
    "linesticker",
    "linepack",
    "line"
  ],
  "category": "sticker",
  "desc": "Download sticker pack LINE",
  "usage": ".linesticker <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 25,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
