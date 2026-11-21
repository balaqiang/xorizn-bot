// Fitur group/notifgantitag — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/notifgantitag", {
  "name": "notifgantitag",
  "command": [
    "notifgantitag",
    "notiflabel",
    "notiftag",
    "labeltag"
  ],
  "category": "group",
  "desc": "Mengatur notifikasi perubahan label/tag member",
  "usage": ".notifgantitag <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
