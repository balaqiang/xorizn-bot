// Fitur tools/txt2qr — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/txt2qr", {
  "name": "txt2qr",
  "command": [
    "txt2qr",
    "texttoqr",
    "qrcreate"
  ],
  "category": "tools",
  "desc": "Generate QR code dari teks",
  "usage": ".txt2qr <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
