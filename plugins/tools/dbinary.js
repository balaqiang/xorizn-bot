// Fitur tools/dbinary — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/dbinary", {
  "name": "dbinary",
  "command": [
    "dbinary",
    "decodebinary",
    "binary2text"
  ],
  "category": "tools",
  "desc": "Decode binary menjadi teks",
  "usage": ".dbinary <binary>",
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
