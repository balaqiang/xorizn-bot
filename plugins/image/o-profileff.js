// Fitur canvas/o-profileff — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/profileff", {
  "name": "profileff",
  "command": [
    "profileff",
    "profilff",
    "pff"
  ],
  "category": "image",
  "desc": "Buat gambar profil FF keren",
  "usage": ".profileff <nama> | <guild> | <bg_index>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
