// Fitur tools/translate — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/translate", {
  "name": "tran",
  "command": [
    "tran",
    "ts"
  ],
  "category": "tools",
  "desc": "Menerjemahkan teks ke berbagai bahasa (Google Translate)",
  "usage": ".tr <kode_bahasa> <teks> atau balas pesan",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
