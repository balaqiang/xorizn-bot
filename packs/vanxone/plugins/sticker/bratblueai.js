// Fitur sticker/bratblueai — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/bratblueai", {
  "name": "bratblueai",
  "command": [
    "bratblueai",
    "bratblue",
    "bratai",
    "bratchara"
  ],
  "category": "sticker",
  "desc": "Hehe~ Ai buatin sticker karakter Blue Archive dengan speech bubble brat style~ ⭐",
  "usage": ".bratblueai <teks kamu>",
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
