// Fitur fun/bagaimana — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/bagaimana", {
  "name": "bagaimana",
  "command": [
    "bagaimana",
    "gimana",
    "how"
  ],
  "category": "fun",
  "desc": "Tanya bot bagaimana sesuatu",
  "usage": ".bagaimana <pertanyaan>",
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
