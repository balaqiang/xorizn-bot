// Fitur group/unmutemember — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/unmutemember", {
  "name": "unmutemember",
  "command": [
    "unmutemember",
    "unmutmember",
    "unsilentmember",
    "unbisukanmember",
    "listmutemember"
  ],
  "category": "group",
  "desc": "Membuka mute member tertentu",
  "usage": ".unmutemember <@tag/reply/nomor>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
