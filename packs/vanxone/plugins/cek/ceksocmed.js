// Fitur cek/ceksocmed — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceksocmed", {
  "name": "ceksocmed",
  "command": [
    "ceksocmed",
    "sosmed",
    "medsos"
  ],
  "category": "cek",
  "desc": "Cek tingkat kecanduan sosmed",
  "usage": ".ceksocmed <nama>",
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
