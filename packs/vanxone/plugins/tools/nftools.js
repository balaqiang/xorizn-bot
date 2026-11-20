// Fitur tools/nftools — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/nftools", {
  "name": "nftools",
  "command": [
    "nftools",
    "nfcreate"
  ],
  "category": "tools",
  "desc": "Membuat akun melalui NF Tools dan menampilkan tautan hasil API",
  "usage": ".nftools",
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
