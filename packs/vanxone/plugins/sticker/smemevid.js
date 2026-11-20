// Fitur sticker/smemevid — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/smemevid", {
  "name": "smemevid",
  "command": [
    "smemevideo",
    "memevid"
  ],
  "category": "sticker",
  "desc": "Membuat sticker meme dari video",
  "usage": ".smemevid <top>|<bottom>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
