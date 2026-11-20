// Fitur group/notifopengroup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/notifopengroup", {
  "name": "notifopengroup",
  "command": [
    "notifopengroup",
    "notifopen"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat grup dibuka",
  "usage": ".notifopengroup on/off",
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
