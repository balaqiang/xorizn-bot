// Fitur primbon/ramalanjodoh — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/ramalanjodoh", {
  "name": "ramalanjodoh",
  "command": [
    "ramalanjodoh"
  ],
  "category": "primbon",
  "desc": "Ramalan jodoh berdasarkan primbon Jawa",
  "usage": ".ramalanjodoh nama1 tgl1 bln1 thn1 nama2 tgl2 bln2 thn2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
