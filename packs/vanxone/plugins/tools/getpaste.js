// Fitur tools/getpaste — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/getpaste", {
  "name": "getpaste",
  "command": [
    "getpaste",
    "getpb",
    "pastebin"
  ],
  "category": "tools",
  "desc": "Ambil konten dari Pastebin",
  "usage": ".getpaste <link pastebin>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
