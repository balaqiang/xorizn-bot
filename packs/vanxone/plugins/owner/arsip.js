// Fitur owner/arsip — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/arsip", {
  "name": "arsip",
  "command": [
    "arsip",
    "archive"
  ],
  "category": "owner",
  "desc": "Arsipkan/buka arsip chat",
  "usage": ".arsip <nomor/reply> atau .arsip buka <nomor>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
