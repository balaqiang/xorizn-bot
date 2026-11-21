// Fitur premium/talkingphoto — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/talkingphoto", {
  "name": "talkingphoto",
  "command": [
    "talkingphoto",
    "talkphoto"
  ],
  "category": "Premium",
  "desc": "Mengubah foto menjadi talking photo/video",
  "usage": ".talkingphoto <teks> | woman1|woman2|man1|man2 (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
