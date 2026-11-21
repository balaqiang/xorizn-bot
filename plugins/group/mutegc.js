// Fitur group/mutegc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/mutegc", {
  "name": "mutegc",
  "command": [
    "mutegc",
    "mutegrup",
    "blockbot",
    "lockbot"
  ],
  "category": "group",
  "desc": "Blokir command bot untuk member, hanya admin/owner yang bisa pakai",
  "usage": ".mutegc",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
