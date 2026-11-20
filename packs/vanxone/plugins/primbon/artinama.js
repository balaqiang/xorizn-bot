// Fitur primbon/artinama — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/artinama", {
  "name": "artinama",
  "command": [
    "artinama",
    "namameaning",
    "artinamaku"
  ],
  "category": "primbon",
  "desc": "Cek arti nama menurut primbon",
  "usage": ".artinama <nama>",
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
