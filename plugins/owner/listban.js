// Fitur owner/listban — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/listban", {
  "name": "listban",
  "command": [
    "listban",
    "listbanned"
  ],
  "category": "owner",
  "desc": "Melihat daftar banned user",
  "usage": ".listban",
  "owner": true,
  "group": false,
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
