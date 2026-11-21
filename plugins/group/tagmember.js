// Fitur group/tagmember — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/tagmember", {
  "name": "tagmember",
  "command": [
    "tagmember",
    "member",
    "members"
  ],
  "category": "group",
  "desc": "Tag semua member biasa (bukan admin) kecuali bot & pengirim",
  "usage": ".tagmember <pesan>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
