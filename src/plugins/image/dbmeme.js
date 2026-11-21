// Fitur canvas/dbmeme — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/dbmeme", {
  "name": "dbmeme",
  "command": [
    "dbmeme",
    "distractedboy",
    "dbm",
    "memedb"
  ],
  "category": "image",
  "desc": "Membuat meme ",
  "usage": ".dbmeme <text1> | <text2> | <text3>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
