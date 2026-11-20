// Fitur group/anticulik — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/anticulik", {
  "name": "anticulik",
  "command": [
    "anticulik",
    "antikidnap",
    "antiileng",
    "anticulikgc"
  ],
  "category": "group",
  "desc": "Bot otomatis keluar grup jika ditambah tanpa izin",
  "usage": ".anticulik on/off",
  "owner": true,
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
