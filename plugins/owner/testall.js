// Fitur testing/testall — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("testing/testall", {
  "name": "testall",
  "command": [
    "testall",
    "testbuilder"
  ],
  "category": "owner",
  "desc": "🧪 Test semua fitur MessageBuilder.js",
  "usage": ".testall <mode>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
