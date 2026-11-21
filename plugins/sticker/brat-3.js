// Fitur sticker/brat — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/brat", {
  "name": "menusticker",
  "command": [
    "menusticker",
    "stikermenu",
    "listmenustiker",
    "liststiker"
  ],
  "category": "sticker",
  "desc": "Menu sticker Vemzo",
  "usage": ".menusticker",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
