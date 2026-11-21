// Fitur tools/cekrek — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/cekrek", {
  "name": "cekrek",
  "command": [
    "cekrek",
    "cekrekening"
  ],
  "category": "tools",
  "desc": "",
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
