// Fitur group/goodbye — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/goodbye", {
  "name": "goodbye",
  "command": [
    "goodbye",
    "bye"
  ],
  "category": "group",
  "desc": "Mengatur goodbye message untuk grup",
  "usage": ".goodbye <on/off>",
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
