// Fitur group/notifpromote — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/notifpromote", {
  "name": "notifpromote",
  "command": [
    "notifpromote"
  ],
  "category": "group",
  "desc": "Toggle notifikasi saat ada yang dijadikan admin",
  "usage": ".notifpromote on/off",
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
