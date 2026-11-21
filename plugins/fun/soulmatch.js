// Fitur fun/soulmatch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/soulmatch", {
  "name": "soulmatch",
  "command": [
    "soulmatch"
  ],
  "category": "fun",
  "desc": "Cek kecocokan jiwa dengan seseorang",
  "usage": ".soulmatch nama1|nama2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
