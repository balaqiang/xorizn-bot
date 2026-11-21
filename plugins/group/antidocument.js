// Fitur group/antidocument — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antidocument", {
  "name": "antidocument",
  "command": [
    "antidocument",
    "antidoc",
    "nodocument",
    "nodoc"
  ],
  "category": "group",
  "desc": "Mengatur antidocument di grup",
  "usage": ".antidocument <on/off>",
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
