// Fitur tools/todoc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/todoc", {
  "name": "doc",
  "command": [
    "doc"
  ],
  "category": "tools",
  "desc": "Convert media ke document (custom filename)",
  "usage": ".todoc (reply media)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
