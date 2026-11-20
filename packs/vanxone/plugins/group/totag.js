// Fitur group/totag — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/totag", {
  "name": "totag",
  "command": [
    "tagall2",
    "mentionall"
  ],
  "category": "group",
  "desc": "Tag semua member dengan reply pesan",
  "usage": ".totag (reply pesan)",
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
