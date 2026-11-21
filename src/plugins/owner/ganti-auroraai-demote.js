// Fitur owner/ganti-auroraai-demote — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-demote", {
  "name": "ganti-auroraai-demote.jpg",
  "command": [
    "ganti-auroraai-demote.jpg",
    "gantiauroraaidemote",
    "setauroraaidemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-demote.jpg",
  "usage": ".ganti-auroraai-demote.jpg (reply/kirim gambar atau URL)",
  "owner": true,
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
