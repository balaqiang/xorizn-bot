// Fitur rpg/membunuh — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("rpg/membunuh", {
  "name": "membunuh",
  "command": [
    "membunuh"
  ],
  "category": "rpg",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
