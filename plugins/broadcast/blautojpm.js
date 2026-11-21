// Fitur jpm/blautojpm — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/blautojpm", {
  "name": "blautojpm",
  "command": [
    "blautojpm",
    "blacklistautojpm",
    "autojpmbl",
    "listblautojpm"
  ],
  "category": "broadcast",
  "desc": "Blacklist grup dari Auto JPM",
  "usage": ".blautojpm <add/del/list>",
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
