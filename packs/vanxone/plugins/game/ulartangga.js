// Fitur game/ulartangga — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/ulartangga", {
  "name": "ulartangga",
  "command": [
    "ulartangga",
    "ut",
    "snakeladder",
    "sl"
  ],
  "category": "game",
  "desc": "Main ular tangga bersama player lain dengan visual board",
  "usage": ".ulartangga <create|join|start|info|exit|delete>",
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
