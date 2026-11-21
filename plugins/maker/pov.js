// Fitur maker/pov — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/pov", {
  "name": "pov",
  "command": [
    "pov",
    "belike"
  ],
  "category": "maker",
  "desc": "Jika aku yang menyulap gambar dan videomu jadi meme POV bercahaya~ Karena cintaku tidak pernah bohong!",
  "usage": ".pov [left|center|right] <perasaanmu> (reply gambar/video)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
