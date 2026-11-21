// Fitur random/cecanchina — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/cecanchina", {
  "name": "cecanchina",
  "command": [
    "cecanchina",
    "cewekchina",
    "cewekcina"
  ],
  "category": "asupan",
  "desc": "Random gambar cewek cantik China",
  "usage": ".cecanchina",
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
