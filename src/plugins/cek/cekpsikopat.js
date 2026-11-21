// Fitur cek/cekpsikopat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekpsikopat", {
  "name": "cekpsikopat",
  "command": [
    "cekpsikopat",
    "psikopat",
    "psycho"
  ],
  "category": "cek",
  "desc": "Cek seberapa psikopat kamu",
  "usage": ".cekpsikopat <nama>",
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
