// Fitur tools/casetoplugin — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/casetoplugin", {
  "name": "casetoplugin",
  "command": [
    "casetoplugin",
    "case2plugin",
    "caseconvert"
  ],
  "category": "tools",
  "desc": "Convert format switch-case ke format plugin Baileys",
  "usage": ".casetoplugin <reply kode case>",
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
