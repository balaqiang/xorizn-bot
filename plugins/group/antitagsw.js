// Fitur group/antitagsw — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antitagsw", {
  "name": "antitagsw",
  "command": [
    "antitag",
    "antistatustag"
  ],
  "category": "group",
  "desc": "Mengaktifkan/menonaktifkan anti tag status di grup",
  "usage": ".antitagsw <on/off>",
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
