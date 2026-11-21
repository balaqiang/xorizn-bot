// Fitur group/notifmakan — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/notifmakan", {
  "name": "notifmakan",
  "command": [
    "notifmakan",
    "jadwalmakan",
    "makanreminder"
  ],
  "category": "group",
  "desc": "Atur pengingat waktu makan otomatis",
  "usage": ".notifmakan on <jam1,jam2,...> [menu] / off / edit <jam1,jam2,...> [menu]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
