// Fitur random/cecankorea — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/cecankorea", {
  "name": "cecankorea",
  "command": [
    "cecankorea",
    "cewekkorea",
    "cewekkor"
  ],
  "category": "asupan",
  "desc": "Random gambar cewek cantik Korea",
  "usage": ".cecankorea",
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
