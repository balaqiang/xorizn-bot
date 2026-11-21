// Fitur owner/getmp3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/getmp3", {
  "name": "getmp3",
  "command": [
    "getmp3",
    "getaudio",
    "ambilmp3",
    "ambilaudio"
  ],
  "category": "owner",
  "desc": "Ambil file MP3/Audio dari folder assets/audio",
  "usage": ".getmp3 <nama_file.mp3>",
  "owner": true,
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
