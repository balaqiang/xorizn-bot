// Fitur group/autosticker — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/autosticker", {
  "name": "autosticker",
  "command": [
    "autosticker",
    "autostiker"
  ],
  "category": "group",
  "desc": "Toggle auto sticker - otomatis jadikan gambar/video jadi sticker",
  "usage": ".autosticker on/off",
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
