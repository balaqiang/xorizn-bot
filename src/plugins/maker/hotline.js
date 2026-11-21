// Fitur maker/hotline — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/hotline", {
  "name": "hotline",
  "command": [
    "hotline"
  ],
  "category": "maker",
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
