// Fitur tools/myip — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/myip", {
  "name": "myip",
  "command": [
    "myip",
    "botip",
    "publicip"
  ],
  "category": "tools",
  "desc": "Cek IP publik server bot",
  "usage": ".myip",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
