// Fitur info/listheroml — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/listheroml", {
  "name": "listhero",
  "command": [
    "listhero",
    "heroml"
  ],
  "category": "info",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
