// Fitur tools/audionoicereducer — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/audionoicereducer", {
  "name": "audionoicereducer",
  "command": [
    "audionoicereducer",
    "noisereducer",
    "cleanaudio",
    "anr"
  ],
  "category": "tools",
  "desc": "Kurangi noise dari audio",
  "usage": ".audionoicereducer (reply audio)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
