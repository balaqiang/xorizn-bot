// Fitur owner/addmp3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/addmp3", {
  "name": "addmp3",
  "command": [
    "addmp3",
    "addaudio",
    "tambahmp3",
    "setmp3",
    "addmusik"
  ],
  "category": "owner",
  "desc": "Tambah file MP3/Audio ke folder assets/audio",
  "usage": ".addmp3 <nama_file.mp3> (reply audio)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
