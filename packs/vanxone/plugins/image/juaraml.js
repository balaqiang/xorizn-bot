// Fitur canvas/juaraml — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/juaraml", {
  "name": "juaraml",
  "command": [
    "juaraml"
  ],
  "category": "image",
  "desc": "Bikin sertifikat juara Mobile Legends",
  "usage": ".juaraml <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
