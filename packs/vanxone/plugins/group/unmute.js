// Fitur group/unmute — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/unmute", {
  "name": "unmute",
  "command": [
    "unbisukan"
  ],
  "category": "group",
  "desc": "Membuka mute grup",
  "usage": ".unmute",
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
