// Fitur jpm/jpm — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/jpm", {
  "name": "jpm",
  "command": [
    "jpm",
    "jasher",
    "jaser"
  ],
  "category": "broadcast",
  "desc": "Kirim pesan ke semua grup (JPM)",
  "usage": ".jpm <pesan>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
