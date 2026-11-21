// Fitur group/delstickercmd — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/delstickercmd", {
  "name": "delstickercmd",
  "command": [
    "delstickercmd",
    "delcmdsticker",
    "removesticker",
    "unsticker"
  ],
  "category": "group",
  "desc": "Hapus sticker command",
  "usage": ".delstickercmd <command> atau reply sticker",
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
