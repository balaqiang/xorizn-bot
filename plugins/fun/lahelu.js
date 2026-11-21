// Fitur random/lahelu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/lahelu", {
  "name": "lahelu",
  "command": [
    "lahelu",
    "randommeme"
  ],
  "category": "fun",
  "desc": "Random gambar lahelu",
  "usage": ".lahelu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
