// Fitur sticker/emojimix — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/emojimix", {
  "name": "emojimix",
  "command": [
    "emojimix",
    "mixemoji",
    "emix"
  ],
  "category": "sticker",
  "desc": "Gabungkan 2 emoji menjadi 1",
  "usage": ".emojimix <emoji1><emoji2>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
