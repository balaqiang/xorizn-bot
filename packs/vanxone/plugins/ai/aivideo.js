// Fitur ai/aivideo — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/aivideo", {
  "name": "aivideo",
  "command": [
    "aivideo",
    "freevideo",
    "genvideo"
  ],
  "category": "ai",
  "desc": "Generate AI video dari prompt atau gambar",
  "usage": ".aivideo <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 15,
  "energi": 10,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
