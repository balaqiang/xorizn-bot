// Fitur info/bluearchive-char — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/bluearchive-char", {
  "name": "bluearchive-char",
  "command": [
    "bluearchive-char",
    "bachar"
  ],
  "category": "info",
  "desc": "Lihat info character Blue Archive",
  "usage": ".bluearchive-char <nama>",
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
