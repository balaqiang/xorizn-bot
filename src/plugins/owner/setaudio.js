// Fitur media/setaudio — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("media/setaudio", {
  "name": "setaudio",
  "command": [
    "setaudio"
  ],
  "category": "owner",
  "desc": "",
  "usage": "",
  "owner": true,
  "group": false,
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
