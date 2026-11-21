// Fitur rpg/bankcek — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/bankcek", {
  "name": "bankcek",
  "command": [
    "bankcek"
  ],
  "category": "rpg",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
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
