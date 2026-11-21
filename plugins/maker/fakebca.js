// Fitur maker/fakebca — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakebca", {
  "name": "fakebca",
  "command": [
    "fakebca",
    "fbca",
    "bca"
  ],
  "category": "maker",
  "desc": "Buat tampilan saldo Fake BCA menggunakan Canvas",
  "usage": ".fakebca NAMA|NO_REK|SALDO",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
