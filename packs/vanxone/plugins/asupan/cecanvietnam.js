// Fitur random/cecanvietnam — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/cecanvietnam", {
  "name": "cecanvietnam",
  "command": [
    "cecanvietnam",
    "cewekvietnam",
    "cewekvn"
  ],
  "category": "asupan",
  "desc": "Random gambar cewek cantik Vietnam",
  "usage": ".cecanvietnam",
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
