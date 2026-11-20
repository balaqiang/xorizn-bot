// Fitur fun/coba — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/coba", {
  "name": "coba",
  "command": [
    "coba",
    "try"
  ],
  "category": "fun",
  "desc": "Coba tanyakan sesuatu ke bot",
  "usage": ".coba <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
