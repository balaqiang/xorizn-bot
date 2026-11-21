// Fitur cek/cekcupu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekcupu", {
  "name": "cekcupu",
  "command": [
    "cekcupu",
    "cupu",
    "noob"
  ],
  "category": "cek",
  "desc": "Cek tingkat kecupuan kamu",
  "usage": ".cekcupu <nama>",
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
