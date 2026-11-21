// Fitur canvas/jmk48 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/jmk48", {
  "name": "jmk48",
  "command": [
    "jmk48"
  ],
  "category": "image",
  "desc": "Bikin gambarmu jadi member JMK48",
  "usage": ".jmk48 (reply/kirim foto)",
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
