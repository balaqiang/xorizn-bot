// Fitur jpm/stopjpmbasic — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("jpm/stopjpmbasic", {
  "name": "stopjpmbasic",
  "command": [
    "stopjpmbasic",
    "stopjpmb"
  ],
  "category": "broadcast",
  "desc": "Menghentikan JPM Basic yang sedang berjalan",
  "usage": ".stopjpmbasic",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
