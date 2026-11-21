// Fitur fun/kapan — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/kapan", {
  "name": "kapan",
  "command": [
    "kapan",
    "when"
  ],
  "category": "fun",
  "desc": "Tanya bot kapan sesuatu",
  "usage": ".kapan <pertanyaan>",
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
