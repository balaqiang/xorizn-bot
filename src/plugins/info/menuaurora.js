// Fitur main/menuaurora — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("main/menuaurora", {
  "name": "menuaurora",
  "command": [
    "menuaurora",
    "mh",
    "category",
    "aurora"
  ],
  "category": "info",
  "desc": "Menampilkan commands dalam kategori tertentu",
  "usage": ".menuaurora <kategori>",
  "owner": false,
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
