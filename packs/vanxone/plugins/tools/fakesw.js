// Fitur tools/fakesw — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fakesw", {
  "name": "fakesw",
  "command": [
    "fakesw",
    "fsw",
    "swfake"
  ],
  "category": "tools",
  "desc": "Generate gambar Fake Status WhatsApp",
  "usage": ".fakesw sw|views|caption (Reply Gambar)",
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
