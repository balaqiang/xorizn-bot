// Fitur maker/fakequotes2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/fakequotes2", {
  "name": "fq2",
  "command": [
    "fq2",
    "quoteschat2"
  ],
  "category": "maker",
  "desc": "Buat gambar quotes chat keren",
  "usage": ".fakequotes2 <teks quotes>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
