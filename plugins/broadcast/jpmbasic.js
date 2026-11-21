// Fitur jpm/jpmbasic — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("jpm/jpmbasic", {
  "name": "jpmbasic",
  "command": [
    "jpmbasic",
    "jpmb",
    "jaser2"
  ],
  "category": "broadcast",
  "desc": "JPM basic tanpa externalAdReply, support reply pesan",
  "usage": ".jpmbasic <pesan> atau reply pesan",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
