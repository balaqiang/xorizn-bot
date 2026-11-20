// Fitur tools/fkontak — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/fkontak", {
  "name": "fkontak",
  "command": [
    "fkontak",
    "fcontact",
    "fvc"
  ],
  "category": "tools",
  "desc": "Buat fake contact card dengan nama dan nomor custom.",
  "usage": ".fkontak <nomor>,<nama>",
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
