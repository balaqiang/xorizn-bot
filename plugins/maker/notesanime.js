// Fitur maker/notesanime — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/notesanime", {
  "name": "notesanime",
  "command": [
    "notesanime",
    "na",
    "animenote"
  ],
  "category": "maker",
  "desc": "Buat quote gaya catatan tulisan tangan di buku notes ala anime",
  "usage": ".notesanime <teks>",
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
