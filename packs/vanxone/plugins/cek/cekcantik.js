// Fitur cek/cekcantik — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekcantik", {
  "name": "cekcantik",
  "command": [
    "cantik",
    "beautiful"
  ],
  "category": "cek",
  "desc": "Cek seberapa cantik kamu",
  "usage": ".cekcantik <nama>",
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
