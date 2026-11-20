// Fitur rpg/marry — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/marry", {
  "name": "marry",
  "command": [
    "marry",
    "nikah",
    "wedding"
  ],
  "category": "rpg",
  "desc": "Menikahi player lain",
  "usage": ".marry @user",
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
