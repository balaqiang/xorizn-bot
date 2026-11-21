// Fitur tools/hostmedia — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/hostmedia", {
  "name": "hostmedia",
  "command": [
    "hostmedia",
    "serverhostmedia",
    "hostmed"
  ],
  "category": "tools",
  "desc": "Nampilin daftar server host media beserta batas maksimalnya",
  "usage": "hostmedia",
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
