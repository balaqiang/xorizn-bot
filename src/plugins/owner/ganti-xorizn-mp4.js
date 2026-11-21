// Fitur owner/ganti-xorizn-mp4 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-mp4", {
  "name": "ganti-xorizn.mp4",
  "command": [
    "ganti-xorizn.mp4",
    "gantixoriznvideo",
    "setxoriznvideo"
  ],
  "category": "owner",
  "desc": "Ganti video xorizn.mp4",
  "usage": ".ganti-xorizn.mp4 (reply/kirim video)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
