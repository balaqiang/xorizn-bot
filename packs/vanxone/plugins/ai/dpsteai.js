// Fitur ai/dpsteai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/dpsteai", {
  "name": "dpsteai",
  "command": [
    "dpsteai",
    "dpste",
    "dipasteai"
  ],
  "category": "ai",
  "desc": "Chat dengan AI dari dipastebin.web.id (mendukung session per-user)",
  "usage": ".dpsteai <pertanyaan> atau .dpsteai reset (untuk hapus sesi)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
