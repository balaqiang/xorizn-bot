// Fitur owner/cat — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/cat", {
  "name": "cat",
  "command": [
    "cat",
    "readfile",
    "catfile"
  ],
  "category": "owner",
  "desc": "Membaca isi file teks dan mengirimkannya sebagai teks, code block, atau HsnAi Rich Code.",
  "usage": ".cat [-text|-code|-snip|-hsnai] (reply file/teks)",
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
