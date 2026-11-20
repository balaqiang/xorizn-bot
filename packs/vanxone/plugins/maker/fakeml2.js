// Fitur maker/fakeml2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakeml2", {
  "name": "fakeml2",
  "command": [
    "fakeml2",
    "mlfake2",
    "fakecardml2",
    "profileml2"
  ],
  "category": "maker",
  "desc": "Membuat kartu profil Mobile Legends palsu (v2)",
  "usage": ".fakeml2 username|rank|border (reply/kirim foto untuk avatar)",
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
