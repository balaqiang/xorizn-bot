// Fitur random/cecanthai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/cecanthai", {
  "name": "cecanthai",
  "command": [
    "cecanthai",
    "cewekthai",
    "cewekthailand"
  ],
  "category": "asupan",
  "desc": "Random gambar cewek cantik Thailand",
  "usage": ".cecanthai",
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
