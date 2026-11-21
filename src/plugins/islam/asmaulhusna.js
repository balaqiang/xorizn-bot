// Fitur religi/asmaulhusna — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("religi/asmaulhusna", {
  "name": "asmaulhusna",
  "command": [
    "asmaul",
    "husna",
    "99names"
  ],
  "category": "islam",
  "desc": "99 Nama Allah (Asmaul Husna)",
  "usage": ".asmaulhusna [nomor/nama]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
