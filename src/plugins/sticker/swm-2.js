// Fitur sticker/swm — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/swm", {
  "name": "swm",
  "command": [
    "stickerwm",
    "stickermark",
    "colong"
  ],
  "category": "sticker",
  "desc": "Mengganti packname dan author pada sticker",
  "usage": ".swm <packname> atau .swm <packname>|<author>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
