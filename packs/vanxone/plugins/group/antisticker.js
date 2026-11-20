// Fitur group/antisticker — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antisticker", {
  "name": "antisticker",
  "command": [
    "antisticker",
    "as",
    "nosticker"
  ],
  "category": "group",
  "desc": "Mengatur antisticker di grup",
  "usage": ".antisticker <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
