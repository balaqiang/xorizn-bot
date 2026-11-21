// Fitur jpm/jpmch — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/jpmch", {
  "name": "jpmch",
  "command": [
    "jpmch",
    "jpmchannel"
  ],
  "category": "broadcast",
  "desc": "Kirim pesan ke semua channel WhatsApp",
  "usage": ".jpmch <pesan>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
