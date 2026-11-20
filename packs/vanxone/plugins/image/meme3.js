// Fitur canvas/meme3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/meme3", {
  "name": "meme3",
  "command": [
    "meme3",
    "3panel"
  ],
  "category": "image",
  "desc": "Membuat meme 3 panel",
  "usage": ".meme3 <text1>|<text2>|<text3>",
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
