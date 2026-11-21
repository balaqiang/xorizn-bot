// Fitur primbon/sifatusahabisnis — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/sifatusahabisnis", {
  "name": "sifatusahabisnis",
  "command": [
    "sifatusahabisnis",
    "usahabisnis",
    "sifatbisnis"
  ],
  "category": "primbon",
  "desc": "Cek sifat usaha/bisnis berdasarkan tanggal lahir",
  "usage": ".sifatusahabisnis <tgl> <bln> <thn>",
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
