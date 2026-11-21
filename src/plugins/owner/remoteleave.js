// Fitur owner/remoteleave — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/remoteleave", {
  "name": "remoteleave",
  "command": [
    "remoteleave",
    "leavegroupbot"
  ],
  "category": "owner",
  "desc": "Memilih grup tertentu untuk bot tinggalkan dari satu menu",
  "usage": ".remoteleave",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
