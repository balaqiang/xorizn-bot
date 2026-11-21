// Fitur cek/cekhoki — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekhoki", {
  "name": "cekhoki",
  "command": [
    "hoki",
    "lucky"
  ],
  "category": "cek",
  "desc": "Cek seberapa hoki kamu",
  "usage": ".cekhoki <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
