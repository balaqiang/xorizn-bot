// Fitur tools/hitungwrmlbb — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/hitungwrmlbb", {
  "name": "hitungwrmlbb",
  "command": [
    "hitungwrmlbb",
    "wrml",
    "wrmlbb",
    "winrate"
  ],
  "category": "tools",
  "desc": "Hitung kebutuhan win tanpa lose untuk mencapai target win rate di Mobile Legends.",
  "usage": ".hitungwrmlbb <total_match> <wr_sekarang> <wr_target>",
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
