// Fitur group/hidetag2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/hidetag2", {
  "name": "hidetag2",
  "command": [
    "hidetag2",
    "h2",
    "ht2"
  ],
  "category": "group",
  "desc": "Hidetag dengan fakeQuoted styling",
  "usage": ".h2 <text> atau reply pesan",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
