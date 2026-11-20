// Fitur internet/fdroid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("internet/fdroid", {
  "name": "fdroid",
  "command": [
    "fdroid",
    "fdroidsearch",
    "fdroiddl",
    "fdroidapp"
  ],
  "category": "tools",
  "desc": "Cari dan dapatkan link download aplikasi open-source dari F-Droid",
  "usage": ".fdroid <nama_aplikasi>",
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
