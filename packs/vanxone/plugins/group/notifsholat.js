// Fitur group/notifsholat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/notifsholat", {
  "name": "notifsholat",
  "command": [
    "notifsholat",
    "notifsolat"
  ],
  "category": "group",
  "desc": "Toggle notifikasi sholat untuk grup ini",
  "usage": ".notifsholat on/off",
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
