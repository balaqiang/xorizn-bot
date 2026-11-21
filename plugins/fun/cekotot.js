// Fitur fun/cekotot — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/cekotot", {
  "name": "cekotot",
  "command": [
    "cekotot",
    "ototcheck",
    "cekmuscle"
  ],
  "category": "fun",
  "desc": "Cek seberapa berotot kamu (random)",
  "usage": ".cekotot <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
