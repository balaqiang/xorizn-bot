// Fitur tools/codepromt — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/codepromt", {
  "name": "promptcode",
  "command": [
    "promptcode",
    "detectbug",
    "convertcode",
    "explaincode",
    "imagesolve"
  ],
  "category": "tools",
  "desc": "Imported from Rimuru MD V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
