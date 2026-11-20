// Fitur game/werewolf — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/werewolf", {
  "name": "werewolf",
  "command": [
    "werewolf",
    "ww",
    "wwgc"
  ],
  "category": "game",
  "desc": "Main Werewolf Game bersama player lain",
  "usage": ".ww <create|join|start|vote|player|exit|delete>",
  "owner": false,
  "group": true,
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
