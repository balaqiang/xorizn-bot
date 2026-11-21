// Fitur fun/akankah — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/akankah", {
  "name": "akankah",
  "command": [
    "akankah",
    "akan",
    "will"
  ],
  "category": "fun",
  "desc": "Tanya bot akankah sesuatu terjadi",
  "usage": ".akankah <pertanyaan>",
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
