// Fitur fun/wa-canvas — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/wa-canvas", {
  "name": "wa-canvas",
  "command": [
    "wa-canvas",
    "fakewaprofile"
  ],
  "category": "fun",
  "desc": "Buat fake WhatsApp profile card",
  "usage": ".wa-canvas <nama> | <nomor> | [status]",
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
