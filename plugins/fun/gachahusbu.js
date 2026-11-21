// Fitur fun/gachahusbu — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/gachahusbu", {
  "name": "gachasuami",
  "command": [
    "gachasuami"
  ],
  "category": "fun",
  "desc": "Gacha husbu impianmu, rebut hatinya, dan jadikan dia pasanganmu!",
  "usage": ".gachahusbu | .husbuku | .tinggalinhusbu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
