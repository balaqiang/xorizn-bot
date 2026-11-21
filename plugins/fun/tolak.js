// Fitur fun/tolak — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/tolak", {
  "name": "tolak",
  "command": [
    "reject",
    "no",
    "gaktau"
  ],
  "category": "fun",
  "desc": "Menolak tembakan dari seseorang",
  "usage": ".tolak @tag",
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
