// Fitur fun/terima — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/terima", {
  "name": "terima",
  "command": [
    "accept",
    "yes"
  ],
  "category": "fun",
  "desc": "Menerima tembakan dari seseorang",
  "usage": ".terima @tag",
  "owner": false,
  "group": true,
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
