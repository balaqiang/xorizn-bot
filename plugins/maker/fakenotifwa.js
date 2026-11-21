// Fitur maker/fakenotifwa — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakenotifwa", {
  "name": "fakenotifwa",
  "command": [
    "fakenotifwa",
    "fakenotif",
    "notifwa"
  ],
  "category": "maker",
  "desc": "Membuat gambar tampilan fake notifikasi WhatsApp iOS via AlwaysCodex API",
  "usage": ".fakenotifwa nama|pesan|jam|tanggal (atau reply gambar untuk PP)",
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
