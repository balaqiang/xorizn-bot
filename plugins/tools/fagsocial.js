// Fitur tools/fagsocial — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fagsocial", {
  "name": "fagsocial",
  "command": [
    "fagsocial",
    "fag",
    "ftt"
  ],
  "category": "tools",
  "desc": "Mengubah Foto menjadi Overlay IG Reels (.fag) atau TikTok FYP (.ftt) dengan responsif penuh",
  "usage": ".fag username | caption  ATAU  .ftt username | caption",
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
