// Fitur religi/ramadhan2027 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/ramadhan2027", {
  "name": "ramadhan2027",
  "command": [
    "ramadhan2027",
    "ramadan2027",
    "hitungramadhan2027"
  ],
  "category": "islam",
  "desc": "Menghitung mundur waktu menuju bulan suci Ramadhan 2027 ala Zero Two",
  "usage": ".ramadhan2027",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
