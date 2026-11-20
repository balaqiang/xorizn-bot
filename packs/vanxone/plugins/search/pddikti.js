// Fitur search/pddikti — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/pddikti", {
  "name": "pddikti",
  "command": [
    "pddikti",
    "dikti",
    "carimahasiswa"
  ],
  "category": "search",
  "desc": "Cari data Mahasiswa, Dosen, PT, dan Prodi dari PDDIKTI",
  "usage": ".pddikti <mode> <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
