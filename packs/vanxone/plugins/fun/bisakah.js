// Fitur fun/bisakah — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/bisakah", {
  "name": "bisakah",
  "command": [
    "bisakah",
    "bisa"
  ],
  "category": "fun",
  "desc": "Tanya bot bisakah sesuatu",
  "usage": ".bisakah <pertanyaan>",
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
