// Fitur random/cecanindo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/cecanindo", {
  "name": "cecanindo",
  "command": [
    "cecanindo",
    "cewekindo",
    "cewekindonesia"
  ],
  "category": "asupan",
  "desc": "Random gambar cewek cantik Indonesia",
  "usage": ".cecanindo",
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
