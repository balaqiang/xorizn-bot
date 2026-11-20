// Fitur fun/putus — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/putus", {
  "name": "putus",
  "command": [
    "breakup",
    "cerai"
  ],
  "category": "fun",
  "desc": "Memutuskan hubungan dengan pasangan",
  "usage": ".putus",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
