// Fitur cek/cekkepribadian — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekkepribadian", {
  "name": "cekkepribadian",
  "command": [
    "cekkepribadian",
    "personality"
  ],
  "category": "cek",
  "desc": "Cek kepribadian kamu",
  "usage": ".cekkepribadian <nama>",
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
