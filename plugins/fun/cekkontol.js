// Fitur fun/cekkontol — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/cekkontol", {
  "name": "cekkontol",
  "command": [
    "cekkontol",
    "kontolcheck"
  ],
  "category": "fun",
  "desc": "Cek ukuran random (bercanda doang)",
  "usage": ".cekkontol <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
