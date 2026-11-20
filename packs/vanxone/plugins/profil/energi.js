// Fitur user/energi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/energi", {
  "name": "energi",
  "command": [
    "energi",
    "myenergi",
    "limit",
    "ceklimit"
  ],
  "category": "profil",
  "desc": "Cek energi user",
  "usage": ".energi [@user]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
