// Fitur random/couple — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("random/couple", {
  "name": "ppcouple",
  "command": [
    "ppcouple",
    "cp",
    "ppcp"
  ],
  "category": "fun",
  "desc": "Random gambar pp couple",
  "usage": ".ppcouple",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
