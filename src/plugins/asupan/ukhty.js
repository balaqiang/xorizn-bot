// Fitur asupan/ukhty — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("asupan/ukhty", {
  "name": "ukhty",
  "command": [
    "ukhty",
    "ukht"
  ],
  "category": "asupan",
  "desc": "Video ukhty",
  "usage": ".ukhty",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
