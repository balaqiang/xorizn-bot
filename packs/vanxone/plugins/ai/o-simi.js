// Fitur ai/o-simi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/simi", {
  "name": "simi",
  "command": [
    "simi",
    "simisimi"
  ],
  "category": "ai",
  "desc": "Ngobrol santai bareng SimiSimi",
  "usage": ".simi <pesan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
