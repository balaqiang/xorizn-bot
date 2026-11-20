// Fitur group/jadwalgroup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/jadwalgroup", {
  "name": "jadwalgroup",
  "command": [
    "jadwalgroup",
    "schedulegroup",
    "jdwlgrup",
    "autoopenclose"
  ],
  "category": "group",
  "desc": "Jadwal buka/tutup grup otomatis",
  "usage": ".jadwalgroup <open/close> <HH:MM>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
