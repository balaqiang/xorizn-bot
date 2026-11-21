// Fitur cek/cekkece — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekkece", {
  "name": "cekkece",
  "command": [
    "cekkece",
    "kece"
  ],
  "category": "cek",
  "desc": "Cek seberapa kece kamu",
  "usage": ".cekkece <nama>",
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
