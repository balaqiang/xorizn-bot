// Fitur jpm/setdelayjpm — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/setdelayjpm", {
  "name": "setdelayjpm",
  "command": [
    "setdelayjpm",
    "delayjpm",
    "jedajpm",
    "setjedajpm"
  ],
  "category": "broadcast",
  "desc": "Atur jeda antar kirim JPM ke grup",
  "usage": ".setdelayjpm <ms>",
  "owner": true,
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
