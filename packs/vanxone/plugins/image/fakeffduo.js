// Fitur canvas/fakeffduo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakeffduo", {
  "name": "fakeffduo",
  "command": [
    "fakeffduo"
  ],
  "category": "image",
  "desc": "Bikin gambar banner Fake FF (Duo)",
  "usage": ".fakeffduo <nama1>|<nama2>|[bgNum]",
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
