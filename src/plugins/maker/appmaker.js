// Fitur maker/appmaker — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/appmaker", {
  "name": "web2apk",
  "command": [
    "web2apk",
    "appmaker",
    "makeapk",
    "tobuildapk"
  ],
  "category": "maker",
  "desc": "Mengubah URL Website menjadi Aplikasi Android (.apk)",
  "usage": ".web2apk NamaApp | URL | Email (balas foto untuk icon/splash)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
