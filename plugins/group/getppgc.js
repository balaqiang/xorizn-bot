// Fitur group/getppgc — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/getppgc", {
  "name": "getppgc",
  "command": [
    "getppgc",
    "ppgc"
  ],
  "category": "group",
  "desc": "Mengambil foto profile group",
  "usage": ".getppgc",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
