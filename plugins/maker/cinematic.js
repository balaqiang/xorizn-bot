// Fitur maker/cinematic — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/cinematic", {
  "name": "cinematic",
  "command": [
    "moody",
    "darktone",
    "nighttone",
    "filterdark",
    "flashmood"
  ],
  "category": "maker",
  "desc": "Mengubah foto biasa menjadi Cinematic Dark Retro Flash Tone presisi",
  "usage": ".cinematic (Kirim/Reply Foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
