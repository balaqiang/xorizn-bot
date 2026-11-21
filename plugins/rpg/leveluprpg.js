// Fitur rpg/leveluprpg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/leveluprpg", {
  "name": "leveluprpg",
  "command": [
    "leveluprpg",
    "lvluprpg",
    "rpglevelup"
  ],
  "category": "rpg",
  "desc": "Toggle notifikasi level up RPG",
  "usage": ".leveluprpg <on/off>",
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
