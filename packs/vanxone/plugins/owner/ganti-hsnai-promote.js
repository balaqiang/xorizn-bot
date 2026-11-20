// Fitur owner/ganti-hsnai-promote — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-promote", {
  "name": "ganti-hsnai-promote.jpg",
  "command": [
    "ganti-hsnai-promote.jpg",
    "gantihsnaipromote",
    "sethsnaipromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-promote.jpg",
  "usage": ".ganti-hsnai-promote.jpg (reply/kirim gambar atau URL)",
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
