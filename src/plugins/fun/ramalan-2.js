// Fitur fun/ramalan — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/ramalan", {
  "name": "ramal",
  "command": [
    "ramal"
  ],
  "category": "fun",
  "desc": "",
  "usage": "",
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
