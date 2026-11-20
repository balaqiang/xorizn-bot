// Fitur group/antilinkgc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antilinkgc", {
  "name": "antilinkgc",
  "command": [
    "antilinkgc",
    "algc",
    "antilinkgrup"
  ],
  "category": "group",
  "desc": "Anti link WhatsApp (grup, saluran, wa.me)",
  "usage": ".antilinkgc <on/off/metode> [kick/remove]",
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
