// Fitur owner/ganti-hsnai-demote — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-demote", {
  "name": "ganti-hsnai-demote.jpg",
  "command": [
    "ganti-hsnai-demote.jpg",
    "gantihsnaidemote",
    "sethsnaidemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-demote.jpg",
  "usage": ".ganti-hsnai-demote.jpg (reply/kirim gambar atau URL)",
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
