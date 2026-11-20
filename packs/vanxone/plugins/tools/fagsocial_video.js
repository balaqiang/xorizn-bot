// Fitur tools/fagsocial_video — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fagsocial_video", {
  "name": "fagsocial_video",
  "command": [
    "fagsocial_video",
    "fagv",
    "fttv"
  ],
  "category": "tools",
  "desc": "Mengubah Video menjadi Overlay IG Reels (.fagv) atau TikTok FYP (.fttv) (Ultra HD + Size Presisi)",
  "usage": ".fagv username | caption  ATAU  .fttv username | caption",
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
