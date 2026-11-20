// Fitur group/notifclosegroup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/notifclosegroup", {
  "name": "notifclosegroup",
  "command": [
    "notifclosegroup",
    "notifclose"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat grup ditutup",
  "usage": ".notifclosegroup on/off",
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
