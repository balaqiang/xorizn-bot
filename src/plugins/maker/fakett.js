// Fitur maker/fakett — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakett", {
  "name": "fakett",
  "command": [
    "fakett",
    "faketiktok",
    "fakettprofile"
  ],
  "category": "maker",
  "desc": "Buat gambar tampilan profil TikTok palsu",
  "usage": ".fakett nama|username|verified|mengikuti|pengikut|suka|bio (sambil kirim/reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
