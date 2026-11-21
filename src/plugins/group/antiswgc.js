// Fitur group/antiswgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antiswgc", {
  "name": "antiswgc",
  "command": [
    "antiswgc",
    "antiswgroup",
    "antiswmentiongc",
    "antiswtaggc"
  ],
  "category": "group",
  "desc": "Deteksi tipe SW group mention atau status mention yang masuk ke grup",
  "usage": ".antiswgc <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
