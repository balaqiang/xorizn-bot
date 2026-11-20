// Fitur cek/cekyandere — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekyandere", {
  "name": "cekyandere",
  "command": [
    "cekyandere",
    "yandere"
  ],
  "category": "cek",
  "desc": "Cek tingkat yandere kamu",
  "usage": ".cekyandere <nama>",
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
