// Fitur economy/riyal — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("economy/riyal", {
  "name": "riyal",
  "command": [
    "riyal",
    "sar",
    "kursriyal",
    "arab",
    "konversiriyal",
    "saudi"
  ],
  "category": "rpg",
  "desc": "Konversi mata uang Rupiah ke Riyal Arab Saudi / sebaliknya",
  "usage": ".riyal <nominal> <idr/sar>",
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
